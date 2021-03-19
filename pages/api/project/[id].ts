import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
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
    case "PUT":
      await handlePut(req, res);
      break;
    case "DELETE":
      await handleDelete(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

/**
 * @swagger
 * /api/project/{id}:
 *  get:
 *     summary: Get a project
 *     providers:
 *       "application/json"
 *     responses:
 *      '200':
 *        description: One Project
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Project'
 */
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  // check accesstoken
  if (!req.headers.acceesstoken) return res.status(403).send("Forbidden");
  const user = await checkAuth(req.headers.acceesstoken as string);
  if (!user) return res.status(403).send("Forbidden");

  const id: string = req.query.id as string;
  const projectId: number = parseInt(id);

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
  });

  if (project === null) return res.status(404).send("Project not found");

  // handle access permission
  if (project.isPrivate === true && project.userId !== user.id)
    return res.status(403).send("forbidden");

  res.json(project);
};

/**
 * @swagger
 * /api/project/{id}:
 *  put:
 *     summary: Edit a project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  // check accesstoken
  if (!req.headers.acceesstoken) return res.status(403).send("Forbidden");
  const user = await checkAuth(req.headers.acceesstoken as string);
  if (!user) return res.status(403).send("Forbidden");

  const id: string = req.query.id as string;
  const projectId: number = parseInt(id);

  const name: string = req.body.name;
  const isPrivate: boolean = req.body.isPrivate ? req.body.isPrivate : false;

  if (utils.isEmpty(name)) return res.status(400).send("name is required");

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
  });

  if (project === null) return res.status(404).send("Document not found");
  if (project.userId !== user.id) return res.status(403).send("forbidden");

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: name,
      isPrivate: isPrivate,
    },
  });

  res.json(updatedProject);
};

/**
 * @swagger
 * /api/project/{id}:
 *  delete:
 *     summary: Delete a project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Wrong paramter
 */
const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  // check accesstoken
  if (!req.headers.acceesstoken) return res.status(403).send("Forbidden");
  const user = await checkAuth(req.headers.acceesstoken as string);
  if (!user) return res.status(403).send("Forbidden");

  const id: string = req.query.id as string;
  const projectId: number = parseInt(id);

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
  });

  if (project === null) return res.status(404).send("Project not found");
  if (project.userId !== user.id) return res.status(403).send("forbidden");

  // delete all documents first
  await prisma.document.deleteMany({
    where: { projectId: projectId },
  });

  const deleteCount = await prisma.project.delete({
    where: { id: projectId },
  });

  res.send("OK");
};
