import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, file } from "@prisma/client";
const prisma = new PrismaClient();
import fs, { existsSync } from "fs";
import { unlink } from "fs/promises";

import utils from "../../../lib/util";
import checkAuth from "../../../lib/api/checkAuth";
import { parse } from "path";

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
  const id: string = req.query.id as string;
  const userIdRes: string = req.query.userId as string;
  let projectId: number = parseInt(id);

  let project = projectId
    ? await prisma.project.findFirst({
        where: {
          id: projectId,
        },
      })
    : null;

  if (project === null) return res.status(404).send("Project not found");

  if (project.isPrivate === true) {
    // check accesstoken
    if (!req.headers.acceesstoken) return res.status(403).send("Forbidden");
    const user = await checkAuth(req.headers.acceesstoken as string);
    if (!user) return res.status(403).send("Forbidden");

    if (
      project.userId !== user.id
      // && project.collaborators.indexOf(user.email) === -1
    )
      return res.status(403).send("forbidden");
  }

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
  const collaborators: string = req.body.collaborators;
  const isPrivate: boolean = req.body.isPrivate ? req.body.isPrivate : false;

  if (utils.isEmpty(name)) return res.status(400).send("name is required");

  console.log("projectId", projectId);

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
  });

  if (project === null) return res.status(404).send("Document not found");
  if (project.userId !== user.id) return res.status(403).send("forbidden");

  const collaboratorsFilterd: Array<number> = collaborators
    .split(",")
    .filter((userId: string) => !!userId)
    .map((userId: string) => parseInt(userId));

  console.log("collaboratorsFilterd", collaboratorsFilterd);

  // delete all collaborators first
  await prisma.collaboratorsOnProjects.deleteMany({
    where: {
      projectId: projectId,
    },
  });

  console.log("collaboratorsFilterd", collaboratorsFilterd);

  const updatedProject = await prisma.project.update({
    where: { id: 1 },
    data: {
      name: name,
      isPrivate: isPrivate,
      collaborators: {
        connectOrCreate: collaboratorsFilterd.map((userId) => {
          console.log("userId", userId);
          return {
            where: { id: 5 },
            create: { User: { connect: { id: 5 } } },
          };
        }),
      },
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

  // delete files
  const files: Array<file> = await prisma.file.findMany({
    where: { projectId: projectId },
  });

  if (files) {
    await Promise.all(
      files.map(async (file) => {
        await prisma.file.delete({
          where: { id: file.id },
        });

        // delete file entity
        const filePath = `${process.env.UPLOADS_PATH}/${file.path}`;
        const thumbPath = `${process.env.UPLOADS_PATH}/${file.thumbnailPath}`;

        if (existsSync(filePath)) await unlink(filePath);
        if (
          file.thumbnailPath &&
          file.thumbnailPath !== "" &&
          existsSync(thumbPath)
        )
          await unlink(thumbPath);

        console.log("deleted", filePath, thumbPath);
      })
    );
  }

  // delete all documents
  await prisma.document.deleteMany({
    where: { projectId: projectId },
  });

  const deleteCount = await prisma.project.delete({
    where: { id: projectId },
  });

  res.send("OK");
};
