const BASE_URL = 'https://naveen-marriage.vercel.app/api';

const getCompressedImageUrl = (url) => {
  const imageUrl = new URL(url);
  imageUrl.searchParams.set('q', '60');
  imageUrl.searchParams.set('w', '800');
  return imageUrl.toString();
};

export const fetchImages = async (page = 1, limit = 100) => {
  const response = await fetch(`${BASE_URL}/images?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch images');
  const data = await response.json();
  
  return {
    ...data,
    images: data.images.map(img => ({
      ...img,
      imageUrl: getCompressedImageUrl(img.imageUrl),
      thumbnailUrl: getCompressedImageUrl(img.imageUrl) + '&w=400'
    }))
  };
};

export const fetchCollections = async () => {
  const response = await fetch(`${BASE_URL}/collections`);
  if (!response.ok) throw new Error('Failed to fetch collections');
  return response.json();
};

export const fetchCollectionById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/collections/${id}`);
    if (!response.ok) throw new Error('Failed to fetch collection');
    const data = await response.json();
    
    // Transform the data to match our expected format
    return {
      id: id,
      name: `Collection ${id}`, // You might want to store collection names in your backend
      images: data.map(img => ({
        id: img._id,
        url: getCompressedImageUrl(img.imageUrl),
        fullUrl: img.imageUrl,
        title: img.filename
      }))
    };
  } catch (error) {
    throw new Error(`Failed to fetch collection: ${error.message}`);
  }
};

export const createCollection = async (name) => {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!response.ok) throw new Error('Failed to create collection');
  return response.json();
};

export const addImagesToCollection = async (collectionId, imageIds) => {
  const response = await fetch(`${BASE_URL}/add-images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ collectionId, imageIds })
  });
  if (!response.ok) throw new Error('Failed to add images to collection');
  return response.json();
};