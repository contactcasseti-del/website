import { PrismaClient } from '../src/generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Clean database
  await prisma.portfolioItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.stat.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.setting.deleteMany({});

  // 2. Seed Admin User
  const passwordHash = await bcrypt.hash('casseti123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@casseti.co',
      passwordHash,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 3. Seed Stats
  const stats = [
    { label: 'Followers grown', value: '500K+' },
    { label: 'Accounts reached', value: 'Millions' },
    { label: 'Every delivery', value: 'On-Time' },
  ];

  for (const stat of stats) {
    await prisma.stat.create({ data: stat });
  }
  console.log('✅ Stats seeded');

  // 4. Seed Reviews
  const reviews = [
    {
      name: 'Jessica Miller',
      location: 'Austin, TX, USA',
      content: "CaSSeTI turned around our reels faster than any editor we've worked with, and never missed a delivery date. The pacing alone bumped our watch-time noticeably.",
      stars: 5,
    },
    {
      name: 'Michael Turner',
      location: 'Los Angeles, CA, USA',
      content: "They didn't just manage our page, they had an actual strategy behind every post. Communication was clear, deadlines were always met, and the content performed.",
      stars: 5,
    },
    {
      name: 'Rohan Mehta',
      location: 'Mumbai, India',
      content: "Great eye for design and always punctual with revisions. CaSSeTI understood our brand within one call and the graphics have stayed consistent ever since.",
      stars: 5,
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }
  console.log('✅ Reviews seeded');

  // 5. Seed Portfolio Items
  const items = [
    // 9:16 Video Items
    { type: 'VIDEO_9_16', title: 'EDIT_01', url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-futuristic-tunnel-41793-large.mp4', category: 'Reels' },
    { type: 'VIDEO_9_16', title: 'EDIT_02', url: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-neon-lights-41794-large.mp4', category: 'Reels' },
    { type: 'VIDEO_9_16', title: 'EDIT_03', url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-neon-makeup-in-dark-room-41785-large.mp4', category: 'Reels' },
    { type: 'VIDEO_9_16', title: 'EDIT_04', url: 'https://assets.mixkit.co/videos/preview/mixkit-dj-playing-music-at-a-neon-club-41796-large.mp4', category: 'Reels' },
    // 16:9 Video Items
    { type: 'VIDEO_16_9', title: 'Short Motion Edit', url: 'https://res.cloudinary.com/a5qhiejq/video/upload/v1783324347/lv_0_20241001223047_vwpdlq.mp4', category: 'Cinematic' },
    { type: 'VIDEO_16_9', title: 'Brand Edit', url: 'https://res.cloudinary.com/a5qhiejq/video/upload/v1783325352/lv_0_20260606113802_xrcuoc.mp4', category: 'Cinematic' },
    // Graphic Design Items
    { type: 'GRAPHIC', title: 'Feed Post', url: '/images/post.jpg', category: 'Post' },
    { type: 'GRAPHIC', title: 'Brand Cover', url: '/images/cover.jpg', category: 'Cover' },
    { type: 'GRAPHIC', title: 'Carousel Slide', url: '/images/carousel.jpg', category: 'Slide' },
    { type: 'GRAPHIC', title: 'Poster', url: '/images/poster.jpg', category: 'Poster' },
    { type: 'GRAPHIC', title: 'Story Highlight', url: '/images/story.jpg', category: 'Highlight' },
    { type: 'GRAPHIC', title: 'Logo Concept', url: '/images/logo.jpg', category: 'Logo' },
  ];

  for (const item of items) {
    await prisma.portfolioItem.create({ data: item });
  }
  console.log('✅ Portfolio items seeded');

  // 6. Seed Settings
  const settings = [
    { key: 'whatsapp_number', value: '+91 00000 00000' },
    { key: 'contact_email', value: 'hello@casseti.co' },
    { key: 'instagram_url', value: 'https://instagram.com' },
    { key: 'instagram_username', value: '@casseti.agency' },
    { key: 'linkedin_url', value: 'https://linkedin.com/company/casseti' },
  ];

  for (const setting of settings) {
    await prisma.setting.create({ data: setting });
  }
  console.log('✅ Settings seeded');
  console.log('🌱 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
