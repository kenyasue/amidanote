import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, project } from "@prisma/client";
const prisma = new PrismaClient();

import utils from "../../../lib/util";
import checkAuth from "../../../lib/api/checkAuth";

export default async function documentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      await handleGet(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

/**
 * @swagger
 * /api/project/default:
 *  get:
 *     summary: Get default project of the user
 *     providers:
 *       "application/json"
 *     responses:
 *      '403':
 *        forbidden
 *      '200':
 *        description: Get default project of the user, creates if not exists
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Document'
 */
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  // check accesstoken
  if (!req.headers.acceesstoken) return res.status(403).send("Forbidden");
  const user = await checkAuth(req.headers.acceesstoken as string);
  if (!user) return res.status(403).send("Forbidden");

  const projectResult = await prisma.project.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: [
      {
        id: "asc",
      },
    ],
    include: {
      collaborators: { include: { User: true } },
    },
  });

  // create new project if not exists

  if (projectResult) return res.send(projectResult);
  else {
    const newProject = await prisma.project.create({
      data: {
        name: "Default project",
        isPrivate: true,
        user: {
          connect: { id: user.id },
        },
      },
    });

    const initialNote = `
Welcome to the amidanote. We hope we can help you to make your life a bit better !
Please check this doc to help you to start using amidanote.

### Online Manual
https://app.amidanote.com/u/1/18

### Sample notes
[React cheatsheet](https://app.amidanote.com/u/4/14)
[My Astrophoto Gallarey](https://app.amidanote.com/u/4/15)

### Learn how to write markdown
[Markddown cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

### Github repository
Please help us to improve our product !
https://github.com/kenyasue/amidanote

If you have any problem or any feature request post to github issue.
https://github.com/kenyasue/amidanote/issues

![Thanks](https://media.giphy.com/media/fVtcfEXWQJQUbsF1sH/giphy-downsized-large.gif "Thank you so much")

### Ooops one more think
We are development agaancy located in Croatia. 
Please [contact us](https://clover.studio) is you need to develop mobile app or modern web based on React or nodejs.

If you get used to amidanote you can delete this note :)

`;
    // create default document too
    const initialDocument = await prisma.document.create({
      data: {
        title: "Welcome to amidanote",
        markdown: initialNote,
        user: {
          connect: { id: user.id },
        },
        project: {
          connect: { id: newProject.id },
        },
      },
    });

    return res.send(newProject);
  }
};
