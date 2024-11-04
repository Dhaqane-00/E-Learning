const ftp = require('basic-ftp');

async function uploadToBunny(buffer, fileName) {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  
  try {
    console.log('Connecting to BunnyCDN...');
    await client.access({
      host: 'storage.bunnycdn.com',
      user: 'e-learining',
      password: '5c898266-6af9-42b7-ad97e6ddc0c7-f4cd-4544',
      secure: false,
      port: 21
    });

    console.log('Connected, attempting upload...');
    const stream = require('stream');
    const readableStream = new stream.PassThrough();
    readableStream.end(buffer);

    await client.uploadFrom(readableStream, fileName);
    
    const cdnUrl = `https://e-learining.b-cdn.net${fileName}`;
    console.log('Upload complete:', cdnUrl);
    return cdnUrl;
  } catch (err) {
    console.error('Error uploading to BunnyCDN:', err);
    throw err;
  } finally {
    client.close();
  }
}

module.exports = { uploadToBunny }; 