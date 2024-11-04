const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function uploadToSupabase(buffer, fileName) {
  try {
    console.log('Uploading to Supabase Storage...');
    
    const filePath = `profiles/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('E-learning')
      .upload(filePath, buffer, {
        contentType: 'image/*',
        upsert: true,
        cacheControl: '3600'
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('E-learning')
      .getPublicUrl(filePath);

    console.log('Upload complete:', publicUrl);
    return publicUrl;
  } catch (err) {
    console.error('Error uploading to Supabase:', err);
    throw err;
  }
}

module.exports = { uploadToSupabase }; 