const cloudinary = require('../config/cloudinary');

const DEMO_MODE = process.env.DEMO_MODE === 'true' || !process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name_here';

const uploadVideo = async (buffer, folder = 'videos') => {
  if (DEMO_MODE) {
    console.log('🎭 DEMO MODE: Simulating video upload');
    return {
      secure_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      public_id: `demo_video_${Date.now()}`,
      resource_type: 'video',
      format: 'mp4'
    };
  }

  return new Promise((resolve, reject) => {
    const streamifier = require('streamifier');
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: folder,
        chunk_size: 6000000,
        eager: [
          { width: 1920, height: 1080, crop: 'limit', quality: 'auto', format: 'mp4' }
        ],
        eager_async: true
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const uploadImage = async (buffer, folder = 'thumbnails') => {
  if (DEMO_MODE) {
    console.log('🎭 DEMO MODE: Simulating thumbnail upload');
    return {
      secure_url: `https://picsum.photos/seed/${Date.now()}/1280/720`,
      public_id: `demo_thumbnail_${Date.now()}`,
      resource_type: 'image',
      format: 'jpg'
    };
  }

  return new Promise((resolve, reject) => {
    const streamifier = require('streamifier');
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: folder,
        transformation: [
          { width: 1280, height: 720, crop: 'fill' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const deleteResource = async (publicId, resourceType = 'video') => {
  if (DEMO_MODE) {
    console.log('🎭 DEMO MODE: Simulating resource deletion');
    return { result: 'ok' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadVideo,
  uploadImage,
  deleteResource
};
