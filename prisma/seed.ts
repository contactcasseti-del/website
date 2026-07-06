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
    // 9:16 Vertical Reels
    { type: 'VIDEO_9_16', title: 'Short Motion Edit', url: 'https://res.cloudinary.com/a5qhiejq/video/upload/v1783324347/lv_0_20241001223047_vwpdlq.mp4', category: 'Reels' },
    { type: 'VIDEO_9_16', title: 'Brand Edit', url: 'https://res.cloudinary.com/a5qhiejq/video/upload/v1783325352/lv_0_20260606113802_xrcuoc.mp4', category: 'Reels' },
    // 16:9 Landscape Videos
    { type: 'VIDEO_16_9', title: 'Documentary Edit', url: 'https://res.cloudinary.com/a5qhiejq/video/upload/v1783283145/lv_0_20241003115246_tzxzkv.mp4', category: 'Cinematic' },
    { type: 'VIDEO_16_9', title: 'Long Form Edit', url: 'https://res.cloudinary.com/a5qhiejq/video/upload/v1783281945/lv_0_20240724151606_uiuykt.mp4', category: 'Cinematic' },
    { type: 'VIDEO_16_9', title: 'Anime Edit', url: 'https://res.cloudinary.com/a5qhiejq/video/upload/v1783329642/VID_20240812235325_1_vogirp.mp4', category: 'Cinematic' },
    // Graphic Design Items
    { type: 'GRAPHIC', title: 'Movie Poster', url: 'https://res.cloudinary.com/a5qhiejq/image/upload/v1783326360/Picsart_24-07-24_00-57-22-467_skis7g.jpg', category: 'Poster' },
    { type: 'GRAPHIC', title: 'YT Thumbnail', url: 'https://res.cloudinary.com/a5qhiejq/image/upload/v1783328836/IMG-20240722-WA0009_doa2rz.jpg', category: 'Thumbnail' },
    { type: 'GRAPHIC', title: 'Matchday Posters', url: 'https://res.cloudinary.com/a5qhiejq/image/upload/v1783328836/IMG-20240722-WA0005_tqpmx1.jpg', category: 'Poster' },
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
