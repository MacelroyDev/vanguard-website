import fs from 'fs';
import path from 'path';
import TiltCard from '@/components/tiltcard';

export default function CardImages() {
  const imagePaths = getImagePaths(); // Call the function to get the image paths
  let isHolo = false;

  return (
    <div className='flex flex-row flex-wrap m-5 justify-around'>
        {imagePaths.map((imagePath, index) => (
            isHolo = checkHolo(imagePath),
            <TiltCard imageID={imagePath} isHolo={isHolo}/>
        ))}
    </div>
  );
}

function getImagePaths() {
  const folderPath = path.join(process.cwd(), 'public', 'images', 'cards');
  try {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    return imageFiles.map((file) => `/images/cards/${file}`);
  } catch (error) {
    console.error('Error reading card image files:', error);
    return []; // Return an empty array on error
  }
}

function checkHolo(imagePath) {
    const holoCards = ["013", "015"];
    const fileName = imagePath.split('/').pop(); // Extract filename
    const baseFileName = fileName.split('.')[0]; // Remove file extension
  
    return holoCards.includes(baseFileName);
  }