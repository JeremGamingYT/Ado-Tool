import { NextRequest } from 'next/server';
import AdmZip from 'adm-zip';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const files = data.getAll('files') as File[];
  if (!files.length) {
    return new Response('No files', { status: 400 });
  }
  const zip = new AdmZip();
  for (const f of files) {
    const buffer = Buffer.from(await f.arrayBuffer());
    zip.addFile(f.name, buffer);
  }
  const zipped = zip.toBuffer();
  return new Response(zipped, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="archive.zip"',
    },
  });
}
