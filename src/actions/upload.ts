'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function uploadImage(formData: FormData): Promise<string | null> {
  const file = formData.get('file') as File;
  
  if (!file || file.size === 0) {
    return null;
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const extension = file.name.split('.').pop() || 'png';
    const filename = `${randomUUID()}.${extension}`;
    
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Directory exists
    }

    const path = join(uploadDir, filename);
    await writeFile(path, buffer);
    
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Failed to upload file:", error);
    return null;
  }
}
