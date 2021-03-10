const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
import global from "./global";

before(async () => {
  // create dummy data

  const user1 = await prisma.user.create({
    data: {
      name: "testuser",
      email: "test1@test.com",
    },
  });

  const session = await prisma.session.create({
    data: {
      userId: user1.id,
      sessionToken: "temp1",
      accessToken: global.accessToken1,
      expires: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "testuser",
      email: "test2@test.com",
    },
  });

  const session2 = await prisma.session.create({
    data: {
      userId: user2.id,
      sessionToken: "temp2",
      accessToken: global.accessToken2,
      expires: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
    },
  });

  // create project1
  const project1 = await prisma.project.create({
    data: {
      name: "project1",
      isPrivate: true,
      user: {
        connect: { id: user1.id },
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "project2",
      isPrivate: true,
      user: {
        connect: { id: user2.id },
      },
    },
  });

  global.projectId1 = project1.id;
  global.projectId2 = project2.id;

  for (let i = 0; i < 10; i++) {
    const doc = await prisma.document.create({
      data: {
        markdown: "test",
        user: {
          connect: { id: user1.id },
        },
        project: {
          connect: { id: project1.id },
        },
      },
    });

    if (i == 0) global.documentIdToDelete = doc.id;
  }

  for (let i = 0; i < 5; i++) {
    const doc = await prisma.document.create({
      data: {
        markdown: "test",
        user: {
          connect: { id: user2.id },
        },
        project: {
          connect: { id: project2.id },
        },
      },
    });

    if (i == 0) global.documentIdNoAccess = doc.id;
  }
});

after(async () => {
  // remove all documents and finish

  await prisma.document.deleteMany();
  await prisma.project.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  process.kill(0);
});
