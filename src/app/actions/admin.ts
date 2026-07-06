'use server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { writeFileSync, mkdirSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

import { put, del } from '@vercel/blob';

export async function deleteInquiry(id: string) {
  await requireSession();
  await prisma.inquiry.delete({ where: { id } });
  revalidatePath('/admin');
}

export async function updateInquiryStatus(id: string, status: string) {
  await requireSession();
  await prisma.inquiry.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin');
}

export async function updateStat(id: string, value: string) {
  await requireSession();
  await prisma.stat.update({
    where: { id },
    data: { value },
  });
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteReview(id: string) {
  await requireSession();
  await prisma.review.delete({ where: { id } });
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function addReview(formData: FormData) {
  await requireSession();
  const name = formData.get('name') as string;
  const location = formData.get('location') as string;
  const content = formData.get('content') as string;
  const stars = parseInt(formData.get('stars') as string || '5', 10);

  if (!name || !location || !content) {
    throw new Error('All fields are required');
  }

  await prisma.review.create({
    data: { name, location, content, stars },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function uploadPortfolioItem(formData: FormData) {
  await requireSession();
  
  const title = formData.get('title') as string;
  const type = formData.get('type') as string; // VIDEO_9_16, VIDEO_16_9, GRAPHIC
  const category = formData.get('category') as string;
  const file = formData.get('file') as File | null;
  const manualUrl = formData.get('manualUrl') as string;
  const thumbnailFile = formData.get('thumbnailFile') as File | null;
  const thumbnailUrl = formData.get('thumbnailUrl') as string;

  if (!title || !type) {
    throw new Error('Title and Type are required.');
  }

  let finalUrl = '';

  // Process video/graphic file upload if selected and has bytes
  if (file && file.size > 0) {
    if (process.env.VERCEL) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error('Vercel Blob storage is not connected to this project. Please create and connect a Blob database in your Vercel Project Settings under "Storage" to enable direct file uploads, or use the Manual URL instead.');
      }
      const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      const blob = await put(safeFileName, file, { access: 'public' });
      finalUrl = blob.url;
    } else {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), 'public', 'uploads');
      mkdirSync(uploadDir, { recursive: true });

      const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      const filePath = join(uploadDir, safeFileName);
      writeFileSync(filePath, new Uint8Array(buffer));
      
      finalUrl = `/uploads/${safeFileName}`;
    }
  } else if (manualUrl) {
    finalUrl = manualUrl;
  } else {
    throw new Error('You must either upload a video file or enter an external URL.');
  }

  let finalThumbnailUrl = '';

  // Process thumbnail file upload if selected and has bytes
  if (thumbnailFile && thumbnailFile.size > 0) {
    if (process.env.VERCEL) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error('Vercel Blob storage is not connected to this project. Connect Blob storage in your Vercel Dashboard, or use the Thumbnail Image URL instead.');
      }
      const safeFileName = `thumb-${Date.now()}-${thumbnailFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      const blob = await put(safeFileName, thumbnailFile, { access: 'public' });
      finalThumbnailUrl = blob.url;
    } else {
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), 'public', 'uploads');
      mkdirSync(uploadDir, { recursive: true });

      const safeFileName = `thumb-${Date.now()}-${thumbnailFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      const filePath = join(uploadDir, safeFileName);
      writeFileSync(filePath, new Uint8Array(buffer));
      
      finalThumbnailUrl = `/uploads/${safeFileName}`;
    }
  } else if (thumbnailUrl) {
    finalThumbnailUrl = thumbnailUrl;
  }


  await prisma.portfolioItem.create({
    data: {
      type,
      title,
      url: finalUrl,
      thumbnail: finalThumbnailUrl || null,
      category: category || null,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deletePortfolioItem(id: string) {
  await requireSession();

  const item = await prisma.portfolioItem.findUnique({
    where: { id },
  });

  if (!item) return;

  // Delete from Vercel Blob if stored in the cloud
  if (item.url.startsWith('https://') && item.url.includes('.public.blob.vercel-storage.com')) {
    try {
      await del(item.url);
    } catch (err) {
      console.error('Failed to delete video blob:', err);
    }
  } else if (item.url.startsWith('/uploads/')) {
    const filePath = join(process.cwd(), 'public', item.url);
    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    } catch (err) {
      console.error('Failed to delete physical file:', err);
    }
  }

  // Delete local/blob thumbnail file
  if (item.thumbnail) {
    if (item.thumbnail.startsWith('https://') && item.thumbnail.includes('.public.blob.vercel-storage.com')) {
      try {
        await del(item.thumbnail);
      } catch (err) {
        console.error('Failed to delete thumbnail blob:', err);
      }
    } else if (item.thumbnail.startsWith('/uploads/')) {
      const thumbPath = join(process.cwd(), 'public', item.thumbnail);
      try {
        if (existsSync(thumbPath)) {
          unlinkSync(thumbPath);
        }
      } catch (err) {
        console.error('Failed to delete physical thumbnail file:', err);
      }
    }
  }

  await prisma.portfolioItem.delete({
    where: { id },
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function updateSettings(formData: FormData) {
  await requireSession();

  const keys = ['whatsapp_number', 'contact_email', 'instagram_url', 'instagram_username', 'linkedin_url'];

  for (const key of keys) {
    const value = formData.get(key) as string;
    if (value !== null && value !== undefined) {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
  }

  revalidatePath('/admin');
  revalidatePath('/');
}
