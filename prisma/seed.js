const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

const posts = [
  {
    slug: "my-first-post",
    title: "My First Post!",
    markdown: `
    # This is my first post!

    Isn't it great?
        `.trim(),
  },
  {
    slug: "trail-riding-with-onewheel",
    title: "Trail Riding with Onewheel",
    markdown: `
    # Floating the trails

    Have you ever tried riding a onewheel? It's an out-of-this-world _experience_!
    Imagine that, but in the beauty of nature and it's just amazing.
        `.trim(),
  },
];

for (const post of posts) {
  async function insertPost() {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  insertPost();
}

console.log(`Database has been seeded. 🌱`);

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
