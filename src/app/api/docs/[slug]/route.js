import fs from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  const filePath = path.join(process.cwd(), 'src/app/docs', decodedSlug, 'page.md');

  try {
    const md = await fs.readFile(filePath, 'utf8');
    const lines = md.split('\n');
    const titleLine = lines[0];
    const title = titleLine.replace(/^#+\s*/, '').trim();
    const content = lines.slice(1).join('\n').trim();

    return Response.json({ title, content });
  } catch (error) {
    console.error('Error reading file:', error);
    return Response.json({ error: 'File not found' }, { status: 404 });
  }
}