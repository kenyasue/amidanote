import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

export default async (accessToken: string): Promise<User> => {
  const session = await prisma.session.findFirst({
    where: {
      accessToken: accessToken,
    },
  });

  if (!session) return null;

  // get user
  const user = await prisma.user.findFirst({
    where: {
      id: session.userId,
    },
  });

  if (!user) return null;

  return user;
};
