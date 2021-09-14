import { User } from "@prisma/client";
import { Prisma } from "@prisma/client";

// 1: Define a type that includes the relation to `Post`
const projectWithCollaborators = Prisma.validator<Prisma.projectArgs>()({
  include: { collaborators: { include: { User: true } } },
});

// 3: This type will include a user and all their posts
export type ProjectWithCollaborators = Prisma.projectGetPayload<
  typeof projectWithCollaborators
>;
