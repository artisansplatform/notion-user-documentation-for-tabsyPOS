import { Client } from '@notionhq/client'
import fs from 'fs/promises';
import path from 'path';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function GET() {
  const filePath = path.join(process.cwd(), 'src/app/docs/navigation.json');

  try {
    const navigation = await fs.readFile(filePath, 'utf8');
    return Response.json(JSON.parse(navigation));
  } catch (error) {
    console.error('Error reading navigation file:', error);
    return Response.json({ error: 'Failed to fetch navigation' }, { status: 500 });
  }
}