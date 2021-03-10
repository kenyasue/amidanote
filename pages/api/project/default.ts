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

    return res.send(newProject);
  }
};
