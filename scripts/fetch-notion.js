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

// Initialize the Notion client with authentication token from environment variables
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Store for tracking downloaded images
const imageCache = new Map();
// Store for mapping image URLs to their block metadata
const imageBlockMetadata = new Map();
// Store for tracking filename usage to prevent duplicates
const filenameCounter = new Map();
// Store for tracking which directories have been cleaned
const cleanedDirectories = new Set();
// Store for tracking which images are currently in use (to keep)
const currentRunImages = new Map(); // key: directory path, value: Set of filenames

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Recursively fetch all blocks and store image block metadata
 * @param {string} blockId - The block ID to fetch children from
 */
async function fetchImageBlockMetadata(blockId) {
  try {
    let cursor = undefined;
    do {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
      });
      const { results, has_more, next_cursor } = response;

      for (const block of results) {
        // If it's an image block, store its metadata
        if (block.type === 'image') {
          const imageUrl = block.image.type === 'file' 
            ? block.image.file.url 
            : block.image.external?.url;
          
          if (imageUrl) {
            // Store with full URL as key for exact matching
            imageBlockMetadata.set(imageUrl, {
              lastEditedTime: block.last_edited_time,
              blockId: block.id
            });
            console.log(`Stored metadata for image: ${block.last_edited_time}`);
          }
        }

        // Recursively fetch children if the block has any
        if (block.has_children) {
          await fetchImageBlockMetadata(block.id);
        }
      }

      cursor = has_more ? next_cursor : undefined;
    } while (cursor);
  } catch (error) {
    console.error(`Error fetching block metadata for ${blockId}:`, error.message);
  }
}

/**
 * Get the last edited time for an image URL
 * @param {string} imageUrl - The image URL
 * @returns {string|null} - The last edited time or null if not found
 */
function getImageLastEditedTime(imageUrl) {
  // First try exact match with full URL
  if (imageBlockMetadata.has(imageUrl)) {
    return imageBlockMetadata.get(imageUrl).lastEditedTime;
  }
  
  // Try to match without query parameters
  const baseUrl = imageUrl.split('?')[0];
  
  // Try to find by matching base URL
  for (const [storedUrl, metadata] of imageBlockMetadata.entries()) {
    const storedBaseUrl = storedUrl.split('?')[0];
    if (storedBaseUrl === baseUrl) {
      return metadata.lastEditedTime;
    }
  }
  
  console.warn(`No metadata found for image URL: ${imageUrl.substring(0, 100)}...`);
  return null;
}

/**
 * Delete old images from a directory that are not in the current run
 * This ensures old/outdated images are removed when content is updated
 * @param {string} imagesDir - The directory path to clean
 */
async function cleanOldImagesFromDirectory(imagesDir) {
  try {
    // Check if directory exists
    await fs.access(imagesDir);
    
    // Read all files in the directory
    const files = await fs.readdir(imagesDir);
    
    // Get the set of current filenames for this directory
    const currentFilenames = currentRunImages.get(imagesDir) || new Set();
    
    // Delete image files that are NOT in the current run
    for (const file of files) {
      // Only check image files (png, jpg, jpeg, gif, webp, etc.)
      if (/\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(file)) {
        if (!currentFilenames.has(file)) {
          const filePath = path.join(imagesDir, file);
          await fs.unlink(filePath);
          console.log(`Deleted old image: ${file}`);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or is empty, which is fine
    if (error.code !== 'ENOENT') {
      console.warn(`Could not clean directory ${imagesDir}:`, error.message);
    }
  }
}

/**
 * Download an image from a URL and save it locally
 * @param {string} imageUrl - The URL of the image to download
 * @param {string} h1Slug - The slug of the heading 1 for folder organization
 * @param {string} h2Slug - The slug of the heading 2 for folder organization
 * @returns {Promise<string>} - The local path to the saved image
 */
async function downloadImage(imageUrl, h1Slug, h2Slug) {
  const cacheKey = `${h1Slug}-${h2Slug}-${imageUrl}`;
  // Check if we've already downloaded this image in this run
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
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

    // Get the last edited time from metadata
    const lastEditedTime = getImageLastEditedTime(imageUrl);
    let filename;
    
    if (lastEditedTime) {
      // Create a unique filename key for this folder
      const folderKey = `${h1Slug}/${h2Slug}`;
      const baseFilename = `${lastEditedTime}`;
      const filenameKey = `${folderKey}/${baseFilename}.${extension}`;
      
      // Check if this filename already exists in this folder
      if (filenameCounter.has(filenameKey)) {
        // Increment counter for duplicate timestamps
        const count = filenameCounter.get(filenameKey) + 1;
        filenameCounter.set(filenameKey, count);
        filename = `${baseFilename}-${count}.${extension}`;
        console.log(`Using timestamp filename with counter: ${filename}`);
      } else {
        // First use of this timestamp in this folder
        filenameCounter.set(filenameKey, 0);
        filename = `${baseFilename}.${extension}`;
        console.log(`Using timestamp filename: ${filename}`);
      }
    } else {
      // Fallback to original hash-based naming if metadata not found
      const crypto = await import('crypto');
      const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
      filename = `${hash}.${extension}`;
      console.warn(`Metadata not found for image, using hash: ${filename}`);
    }
    
    // Create the images directory if it doesn't exist
    const imagesDir = path.join(process.cwd(), 'public/images/docs', h1Slug, h2Slug);
    await fs.mkdir(imagesDir, { recursive: true });

    // Track this filename as part of current run
    if (!currentRunImages.has(imagesDir)) {
      currentRunImages.set(imagesDir, new Set());
    }
    currentRunImages.get(imagesDir).add(filename);

    // Check if file already exists with same name (up to date)
    const localPath = path.join(imagesDir, filename);
    try {
      await fs.access(localPath);
      console.log(`Image already exists and up to date: ${filename}`);
      
      // Store the local URL path (for use in markdown)
      const publicPath = `/images/docs/${h1Slug}/${h2Slug}/${filename}`;
      imageCache.set(cacheKey, publicPath);
      return publicPath;
    } catch {
      // File doesn't exist, proceed to download
    }

    // Save the image
    await fs.writeFile(localPath, buffer);

    // Store the local URL path (for use in markdown)
    const publicPath = `/images/docs/${h1Slug}/${h2Slug}/${filename}`;
    imageCache.set(cacheKey, publicPath);

    console.log(`Downloaded new image: ${filename}`);
    return publicPath;
  } catch (error) {
    console.error(`Error downloading image ${imageUrl}:`, error.message);
    return imageUrl; // Return original URL if error occurs
  }
}

/**
 * Process markdown content and download all images
 * @param {string} content - The markdown content
 * @param {string} h1Slug - The slug of the heading 1 for folder organization
 * @param {string} h2Slug - The slug of the heading 2 for folder organization
 * @returns {Promise<string>} - The processed markdown with local image paths
 */
async function processImagesInMarkdown(content, h1Slug, h2Slug) {
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
    const localPath = await downloadImage(image.url, h1Slug, h2Slug);
    content = content.replace(image.url, localPath);
  }

  return content;
}

async function processMarkdown(mdString) {
  if (typeof mdString === 'object' && mdString.parent) {
    mdString = mdString.parent;
  }
  
  const lines = mdString.split('\n');
  const headings = [];
  let currentH1 = null;
  let currentH1Slug = null;
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
        await saveContent(currentH2.title, currentH2.content, currentH1Slug);
      } else if (currentH1) {
        await saveContent(currentH1.title, currentH1.content + currentContent, currentH1Slug);
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
      currentH1Slug = slugify(cleanMarkdown(h1Title));
      currentH2 = null;
      currentContent = '';
      headings.push({ level: 1, title: currentH1.title });
    } else if (line.startsWith('## ')) {
      if (currentH2) {
        await saveContent(currentH2.title, currentH2.content, currentH1Slug);
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
    await saveContent(currentH2.title, currentH2.content, currentH1Slug);
  } else if (currentH1) {
    await saveContent(currentH1.title, currentH1.content + currentContent, currentH1Slug);
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



async function saveContent(title, content, h1Slug) {
  if (!title || !content) return;
  
  // Process images in the content before saving
  const h2Slug = slugify(title);
  content = await processImagesInMarkdown(content, h1Slug, h2Slug);
  
  const slug = slugify(title);
  const filePath = path.join(process.cwd(), 'src/app/docs', slug, 'page.md');
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);
}

async function main() {
  try {
    console.log('Fetching Notion data...');
    
    // First, fetch all image block metadata
    console.log('Fetching image block metadata...');
    await fetchImageBlockMetadata(process.env.NOTION_PAGE_ID);
    console.log(`Found ${imageBlockMetadata.size} image blocks`);
    
    const n2m = new NotionToMarkdown({ notionClient: notion });
    const mdblocks = await n2m.pageToMarkdown(process.env.NOTION_PAGE_ID);
    const mdString = n2m.toMarkdownString(mdblocks).parent;
    
    console.log('Processing markdown and creating files...');
    
    await processMarkdown(mdString);
    
    // After processing all images, clean up old images from each directory
    console.log('Cleaning up old images...');
    for (const [imagesDir, filenames] of currentRunImages.entries()) {
      await cleanOldImagesFromDirectory(imagesDir);
    }
    
    console.log(`Done! Files have been created and ${imageCache.size} images downloaded.`);
    console.log(`Cleaned ${currentRunImages.size} image directories.`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();