'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export type InquiryState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitInquiry(
  _prevState: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  
  // Extract all selected services
  const servicesList: string[] = [];
  if (formData.get('service-editing') === 'on') servicesList.push('Video Editing');
  if (formData.get('service-design') === 'on') servicesList.push('Graphic Design');
  if (formData.get('service-scripts') === 'on') servicesList.push('Script Writing');
  if (formData.get('service-marketing') === 'on') servicesList.push('Page & Content Management');

  if (!name || name.trim() === '') {
    return { error: 'Please enter your name.' };
  }
  if (!email || email.trim() === '') {
    return { error: 'Please enter your email address.' };
  }
  if (!message || message.trim() === '') {
    return { error: 'Please enter your message details.' };
  }
  if (servicesList.length === 0) {
    return { error: 'Please select at least one service.' };
  }

  try {
    await prisma.inquiry.create({
      data: {
        name,
        email,
        message,
        services: servicesList.join(', '),
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('Error submitting inquiry:', err);
    return { error: 'Something went wrong. Please try again.' };
  }
}
