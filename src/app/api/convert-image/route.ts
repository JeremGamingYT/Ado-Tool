import { NextRequest } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get('file') as File | null;
  if (!file) {
    return new Response('No file', { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const converted = await sharp(buffer).png().toBuffer();
  return new Response(converted, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="converted.png"',
    },
  });
}
