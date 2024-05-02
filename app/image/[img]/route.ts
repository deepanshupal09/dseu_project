import fs from 'fs';
import path from 'path';

export async function GET( request:Request, { params }: { params: { img: string } }) {
  const { img } = params;
  const imagePath = path.join('/home/dseu/Desktop/uploads/',img);

  try {
    const fileData = fs.readFileSync(imagePath);
    return new Response(fileData, {
      headers: { 'Content-Type': 'image/jpeg' },
    });
  } catch(error:any) {

    return new Response(error)
  }


}
