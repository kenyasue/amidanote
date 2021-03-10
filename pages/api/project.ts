import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import utils from "../../lib/util";
import checkAuth from "../../lib/api/checkAuth";

export default async function documentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      await handleGet(req, res);
      break;
    case "POST":
      await handlePost(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

/**
 * @swagger
 * /api/project:
 *  get:
 *     summary: Get all projects for a user
 *     providers:
 *       "application/json"
 *     responses:
 *      '403':
 *        forbidden
 *      '200':
 *        description: A list of projects depends on the user
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Project'
 */
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  // check accesstoken
  if (!req.headers.acceesstoken) return res.status(403).send("Forbidden");
  const user = await checkAuth(req.headers.acceesstoken as string);
  if (!user) return res.status(403).send("Forbidden");

  const allProjects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    orderBy: [
      {
        name: "asc",
      },
    ],
  });
  res.send(allProjects);
};

/**
 * @swagger
 * /api/project:
 *  post:
 *     summary: Create a new project
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               isPrivate:
 *                 type: boolean
 *             example:   # Sample object
 *               name: "test"
 *               isPrivate: true
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Project'
 *       '400':
 *         description: Wrong paramter
 */
const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  // check accesstoken
  if (!req.headers.acceesstoken) return res.status(403).send("Forbidden");
  const user = await checkAuth(req.headers.acceesstoken as string);
  if (!user) return res.status(403).send("Forbidden");

  const name: string = req.body.name;
  const isPrivate: boolean = req.body.isPrivate ? req.body.isPrivate : false;

  if (utils.isEmpty(name)) return res.status(400).send("name is required");

  const newProject = await prisma.project.create({
    data: {
      name: name,
      isPrivate: isPrivate,
      user: {
        connect: { id: user.id },
      },
    },
  });

  res.send(newProject);
};
