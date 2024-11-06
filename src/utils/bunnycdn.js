const BunnyStorage = require('bunnycdn-storage').default;
const dotenv = require('dotenv');
dotenv.config();

const bunnyStorage = new BunnyStorage(
  process.env.BUNNY_STORAGE_API_KEY,
  process.env.BUNNY_STORAGE_ZONE_NAME
);

// Add upload method with loading indicator and progress tracking
const bunnyStorageWithLoading = {
  ...bunnyStorage,
  upload: async (buffer, path) => {
    console.log(`Starting upload to BunnyCDN: ${path}`);
    try {
      // Calculate file size in MB
      const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
      console.log(`File size: ${fileSizeMB} MB`);

      const startTime = Date.now();
      const result = await bunnyStorage.upload(buffer, path);
      const endTime = Date.now();

      // Calculate upload duration in seconds
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`Upload completed successfully in ${duration} seconds`);
      console.log(`File path: ${path}`);

      return result;
    } catch (error) {
      console.error('Error uploading file to BunnyCDN:');
      console.error('Path:', path);
      console.error('Error details:', error);
      throw error;
    }
  }
};

module.exports = bunnyStorageWithLoading; 