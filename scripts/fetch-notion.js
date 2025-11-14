/**
 * Notion Documentation Fetcher
 * 
 * This script fetches documentation content from a Notion page and converts it into 
 * Markdown files for a Next.js documentation site. It processes the Notion page's 
 * block structure hierarchically and generates individual page files along with 
 * navigation data.
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Initialize the Notion client with authentication token from environment variables
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Store for tracking downloaded images
const imageCache = new Map();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Download an image from a URL and save it locally
 * @param {string} imageUrl - The URL of the image to download
 * @returns {Promise<string>} - The local path to the saved image
 */
async function downloadImage(imageUrl) {
  // Check if we've already downloaded this image
  if (imageCache.has(imageUrl)) {
    return imageCache.get(imageUrl);
  }

  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`Failed to download image: ${imageUrl}`);
      return imageUrl; // Return original URL if download fails
    }

    // Get the image buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine file extension from content-type or URL
    const contentType = response.headers.get('content-type');
    let extension = 'png'; // default
    if (contentType) {
      const match = contentType.match(/image\/(.*)/);
      if (match) {
        extension = match[1].split(';')[0]; // Remove any additional params
        // Normalize extensions
        if (extension === 'jpeg') extension = 'jpg';
      }
    } else {
      // Try to get extension from URL
      const urlMatch = imageUrl.match(/\.([a-z]{3,4})(\?|$)/i);
      if (urlMatch) {
        extension = urlMatch[1].toLowerCase();
      }
    }

    // Generate a unique filename based on the URL hash
    const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
    const filename = `${hash}.${extension}`;
    
    // Create the images directory if it doesn't exist
    const imagesDir = path.join(process.cwd(), 'public/images/docs');
    await fs.mkdir(imagesDir, { recursive: true });

    // Save the image
    const localPath = path.join(imagesDir, filename);
    await fs.writeFile(localPath, buffer);

    // Store the local URL path (for use in markdown)
    const publicPath = `/images/docs/${filename}`;
    imageCache.set(imageUrl, publicPath);

    console.log(`Downloaded image: ${filename}`);
    return publicPath;
  } catch (error) {
    console.error(`Error downloading image ${imageUrl}:`, error.message);
    return imageUrl; // Return original URL if error occurs
  }
}

/**
 * Process markdown content and download all images
 * @param {string} content - The markdown content
 * @returns {Promise<string>} - The processed markdown with local image paths
 */
async function processImagesInMarkdown(content) {
  // Match markdown image syntax: ![alt](url)
  const imageRegex = /!\[(.*?)\]\((https?:\/\/[^\)]+)\)/g;
  const images = [];
  let match;

  // Find all images
  while ((match = imageRegex.exec(content)) !== null) {
    images.push({
      fullMatch: match[0],
      alt: match[1],
      url: match[2]
    });
  }

  // Download all images and replace URLs
  for (const image of images) {
    const localPath = await downloadImage(image.url);
    content = content.replace(image.url, localPath);
  }

  return content;
}

async function processMarkdown(mdString) {
  if (typeof mdString === 'object' && mdString.parent) {
    mdString = mdString.parent;
  }
  
  // Process images first before splitting into lines
  mdString = await processImagesInMarkdown(mdString);
  
  const lines = mdString.split('\n');
  const headings = [];
  let currentH1 = null;
  let currentH2 = null;
  let currentContent = '';
  let navigation = [];
  let currentSection = null;
  
  const cleanMarkdown = (text) => {
    return text.replace(/\*\*/g, '').replace(/\n/g, ' ').trim();
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('# ')) {
      if (currentH2) {
        await saveContent(currentH2.title, currentH2.content);
      } else if (currentH1) {
        await saveContent(currentH1.title, currentH1.content + currentContent);
      }
      
      if (currentSection) navigation.push(currentSection);
      
      const h1Title = line.substring(2).trim();
      currentSection = {
        title: cleanMarkdown(h1Title),
        links: []
      };
      
      currentH1 = {
        title: h1Title,
        content: line + '\n\n'
      };
      currentH2 = null;
      currentContent = '';
      headings.push({ level: 1, title: currentH1.title });
    } else if (line.startsWith('## ')) {
      if (currentH2) {
        await saveContent(currentH2.title, currentH2.content);
      }
      
      const h2Title = line.substring(3).trim();
      if (currentSection) {
        currentSection.links.push({
          title: cleanMarkdown(h2Title),
          href: '/docs/' + slugify(cleanMarkdown(h2Title))
        });
      }
      
      currentH2 = {
        title: h2Title,
        content: (currentH1 ? currentH1.content : '') + line + '\n\n'
      };
      currentContent = '';
      headings.push({ level: 2, title: currentH2.title });
    } else {
      if (currentH2) {
        currentH2.content += line + '\n';
      } else if (currentH1) {
        currentContent += line + '\n';
      }
    }
  }
  
  if (currentH2) {
    await saveContent(currentH2.title, currentH2.content);
  } else if (currentH1) {
    await saveContent(currentH1.title, currentH1.content + currentContent);
  }
  
  if (currentSection) navigation.push(currentSection);
  
  const headingsSummary = headings.map(h => 
    `${h.level === 1 ? '#' : '##'} ${h.title}`
  ).join('\n');
  
  const navigationContent = `export const navigation = ${JSON.stringify(navigation, null, 2)}\n`;
  await fs.writeFile(
    path.join(process.cwd(), 'src/lib/navigation.js'),
    navigationContent
  );
}

async function saveContent(title, content) {
  if (!title || !content) return;
  
  // Process images in the content before saving
  content = await processImagesInMarkdown(content);
  
  const slug = slugify(title);
  const filePath = path.join(process.cwd(), 'src/app/docs', slug, 'page.md');
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);
}

async function main() {
  try {
    console.log('Fetching Notion data...');
    const n2m = new NotionToMarkdown({ notionClient: notion });
    const mdblocks = await n2m.pageToMarkdown(process.env.NOTION_PAGE_ID);
    const mdString = n2m.toMarkdownString(mdblocks).parent;
    
    console.log('Processing markdown and creating files...');
    
    // Clean up old images directory before downloading new ones
    const imagesDir = path.join(process.cwd(), 'public/images/docs');
    try {
      await fs.rm(imagesDir, { recursive: true, force: true });
      console.log('Cleaned up old images directory');
    } catch (error) {
      // Directory might not exist, which is fine
    }
    
    await processMarkdown(mdString);
    
    console.log(`Done! Files have been created and ${imageCache.size} images downloaded.`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();