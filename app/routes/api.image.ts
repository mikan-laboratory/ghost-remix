import { LoaderFunctionArgs } from '@remix-run/node';
import { ImageScaler } from '@mikan-labs/image-scaler';
import { env } from '~/env';
import { ONE_MONTH_IN_SECONDS } from '~/constants';

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
      url: `${env.BLOG_URL}${name}`,
      width: parseInt(width, 10),
      imageName,
      outputType: 'buffer',
      outputDir: env.IMAGE_OUTPUT_DIRECTORY,
    });

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Content-Length': imageBuffer.byteLength.toString(),
        'Cache-Control': `public, max-age=${ONE_MONTH_IN_SECONDS}`,
      },
    });
  } catch (error) {
    console.error(error);

    throw new Response('Something went wrong', {
      status: 500,
    });
  }
};
