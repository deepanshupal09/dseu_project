import fs from 'fs';
import path from 'path';

export async function GET( request:Request, { params }: { params: { img: string } }) {
  const { img } = params;
  const imagePath = path.join('/home/dseu/Desktop/uploads/',img);
  // console.log("path: ", imagePath)
  try {
    const fileData = fs.readFileSync(imagePath);
    return new Response(fileData, {
      headers: { 'Content-Type': 'image/jpeg' },
    });
  } catch(error:any) {
    // console.log("Error: ", error)
    return new Response(error)
  }

  // Return the image data as a response
}
