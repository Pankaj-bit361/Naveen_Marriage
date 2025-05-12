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


const getPaginatedImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 30;
    const skip = (page - 1) * limit;

    const totalImages = await Image.countDocuments();
    const images = await Image.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalImages / limit),
      totalImages,
      images
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};



const createCollection = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Collection name is required' });
    }

    const existing = await ImageCollection.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Collection with this name already exists' });
    }

    const newCollection = await ImageCollection.create({ name, images: [] });
    res.status(201).json({ message: 'Collection created', data: newCollection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create collection' });
  }
};




const addImagesToCollection = async (req, res) => {
  try {
    const { collectionId, images } = req.body;

    if (!collectionId || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Collection ID and image array required' });
    }

    if (images.length > 20) {
      return res.status(400).json({ error: 'Cannot add more than 20 images at once' });
    }

    const collection = await ImageCollection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const existingUrls = new Set(collection.images.map(img => img.imageUrl));

    const newImages = images.filter(
      img => !existingUrls.has(img.imageUrl)
    );

    collection.images.push(...newImages);
    await collection.save();

    res.status(200).json({ message: `${newImages.length} images added`, data: collection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add images to collection' });
  }
};

module.exports = {syncS3ImagesToDB, getPaginatedImages, createCollection, addImagesToCollection};
