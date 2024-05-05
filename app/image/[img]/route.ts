import fs from 'fs';
import path from 'path';

export async function GET( request:Request, { params }: { params: { img: string } }) {
  const { img } = params;
  const imagePath = path.join('/home/dseu/Desktop/uploads/',img);


  try {
    const fileData = fs.readFileSync(imagePath);
    return new Response(fileData, {
      headers: { 'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Content-Type': 'image/jpeg' },
    });
  } catch(error:any) {

    return new Response(error)
  }


}
