import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// S3客户端配置
const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || '',
  },
});

console.log('S3 Client initialized with config:', {
  region: process.env.REACT_APP_AWS_REGION,
  hasAccessKey: !!process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.REACT_APP_S3_BUCKET_NAME
});

// 将File对象转换为Uint8Array
const fileToUint8Array = async (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(arrayBuffer));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const extractFileName = (fileUrl: string): string => {
  return fileUrl.split('/').pop()?.replace(/^[^-]*-/, '') || '';
};

// 上传文件到S3
export const uploadFileToS3 = async (file: File, key: string): Promise<string> => {
  console.log('uploadFileToS3 called with:', { file, key });
  
  try {
    // 将文件转换为Uint8Array
    const fileBuffer = await fileToUint8Array(file);
    console.log('File converted to Uint8Array');

    const command = new PutObjectCommand({
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME || '',
      Key: key,
      Body: fileBuffer,
      ContentType: file.type,
      Metadata: {
        'x-amz-meta-originalname': file.name,
      },
    });

    console.log('Sending command to S3...');
    await s3Client.send(command);
    console.log('File uploaded successfully');
    
    // 返回文件的URL
    const fileUrl = `https://${process.env.REACT_APP_S3_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${key}`;
    console.log('Generated file URL:', fileUrl);
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}; 