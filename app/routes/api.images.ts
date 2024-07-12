import { LoaderFunctionArgs } from '@remix-run/node';
import { ImageScaler } from '@mikan-labs/image-scaler';
import * as path from 'path';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);

    const searchParams = url.searchParams;

    const imageScaler = new ImageScaler();

    const name = searchParams.get('name');

    if (!name) throw new Error('Name not provided');

    const width = searchParams.get('w');

    if (!width) throw new Error('Width not provided');

    const splitImage = name.split('/');

    const imagePath = splitImage[splitImage.length - 1];
    const lastIndexOfPeriod = imagePath.lastIndexOf('.');
    const imageName = imagePath.substring(0, lastIndexOfPeriod);

    const imageBuffer = await imageScaler.scaleOrGetExisting({
      url: `http://localhost:8080${name}`,
      width: parseInt(width, 10),
      imageName,
      outputType: 'buffer',
      outputDir: path.join('ghost-data', 'images'),
    });

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Content-Length': imageBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.log(error);

    throw new Response('Something went wrong', {
      status: 500,
    });
  }
};
