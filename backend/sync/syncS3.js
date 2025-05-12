const AWS = require('aws-sdk');
const Image = require('../models/Image');
const ImageCollection = require('../models/ImageCollection');

// const s3 = new AWS.S3({
//   region: process.env.AWS_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// const syncS3ImagesToDB = async () => {
//   const bucket = process.env.S3_BUCKET_NAME;
//   const folder = process.env.S3_FOLDER;

//   const data = await s3
//     .listObjectsV2({ Bucket: bucket, Prefix: `${folder}/` })
//     .promise();

//   let count = 0;

//   for (const item of data.Contents) {
//     if (item.Key.endsWith('/')) continue;

//     console.log(item)

//     const imageUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
//     const filename = item.Key.split('/').pop();



//     console.log(imageUrl, "26")

//     const exists = await Image.findOne({ imageUrl });

//     if (!exists) {
//       await Image.create({
//         imageUrl,
//         filename,
//         createdAt: new Date(item.LastModified),
//       });
//       count++;
//     }
//   }

//   return count;
// };


const createCollection = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: "Collection name is required" });

  const newCollection = new ImageCollection({
    name,
    createdAt: new Date(),
  });

  try {
    await newCollection.save();
    res.json({
      message: "Collection created successfully",
      collectionId: newCollection._id,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create collection' });
  }
};


const addImagesToCollection = async (req, res) => {
  const { imageIds, collectionId } = req.body;

  if (!imageIds || imageIds.length === 0)
    return res.status(400).json({ message: "No image IDs provided" });

  try {
    const collection = await ImageCollection.findById(collectionId);
    if (!collection)
      return res.status(404).json({ message: "Collection not found" });

    const imagesToAdd = await Image.find({ _id: { $in: imageIds } });

    if (imagesToAdd.length === 0)
      return res.status(404).json({ message: "No valid images found" });

    const formattedImages = imagesToAdd.map(img => ({
      imageUrl: img.imageUrl,
      filename: img.filename
    }));

    collection.images.push(...formattedImages);

    await collection.save();
    res.json({ message: "Images added to collection successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add images' });
  }
};


// Function to get all collections
const getAllCollections = async (req, res) => {
  try {
    const collections = await ImageCollection.find();
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
};

// Function to get images from a collection
const getCollectionImages = async (req, res) => {
  const { collectionId } = req.params;

  try {
    const collection = await ImageCollection.findById(collectionId);

    if (!collection) return res.status(404).json({ message: "Collection not found" });

    const images = collection.images;
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

// Function to get paginated images
const getPaginatedImages = async (req, res) => {
  const { page = 1, limit = 30 } = req.query;

  try {
    const images = await Image.find()
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ images });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

module.exports = {
  createCollection,
  addImagesToCollection,
  getAllCollections,
  getCollectionImages,
  getPaginatedImages,
};