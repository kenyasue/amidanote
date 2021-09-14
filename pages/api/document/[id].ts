import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, file } from "@prisma/client";
const prisma = new PrismaClient();
import fs, { existsSync } from "fs";
import { unlink } from "fs/promises";

import utils from "../../../lib/util";
import checkAuth from "../../../lib/api/checkAuth";
import { DeleteFilled } from "@ant-design/icons";
import { ProjectWithCollaborators } from "../../../lib/customModels";

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
 * /api/document/{id}:
 *  get:
 *     summary: Get a document
 *     providers:
 *       "application/json"
 *     responses:
 *      '200':
 *        description: One Document
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

  const id: string = req.query.id as string;
  const documentId: number = parseInt(id);

  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
    },
  });

  if (document === null) return res.status(404).send("Document not found");
  if (document.userId !== user.id) return res.status(403).send("forbidden");

  res.json(document);
};

/**
 * @swagger
 * /api/document/{id}:
 *  put:
 *     summary: Edit a document
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
 *               markdown:
 *                 type: string
 *               folderId:
 *                 type: integer
 *             example:   # Sample object
 *               title: "test"
 *               markdown: "test"
 *               folderId: 0
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Document'
 *       '400':
 *         description: Wrong paramter
 */
const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  // check accesstoken
  if (!req.headers.acceesstoken) return res.status(403).send("Forbidden");
  const user = await checkAuth(req.headers.acceesstoken as string);
  if (!user) return res.status(403).send("Forbidden");

  const id: string = req.query.id as string;
  const documentId: number = parseInt(id);

  const markdown: string = req.body.markdown;
  const title: string = req.body.title;
  const format: string = req.body.format;
  const folderId: number = req.body.folderId;

  if (utils.isEmpty(title)) return res.status(400).send("title is required");

  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
    },
  });

  const project: ProjectWithCollaborators = await prisma.project.findFirst({
    where: {
      id: document.projectId,
    },
    include: {
      collaborators: { include: { User: true } },
    },
  });

  if (document === null) return res.status(404).send("Document not found");
  if (
    document.userId !== user.id &&
    !project.collaborators.find((row) => row.userId === user.id)
  )
    return res.status(403).send("forbidden");

  const updatedDocument = await prisma.document.update({
    where: { id: documentId },
    data: {
      title: title,
      format: format,
      markdown: markdown,
    },
  });

  res.json(updatedDocument);
};

/**
 * @swagger
 * /api/document/{id}:
 *  delete:
 *     summary: Delete a document
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
  const documentId: number = parseInt(id);

  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
    },
  });

  if (document === null) return res.status(404).send("Document not found");
  if (document.userId !== user.id) return res.status(403).send("forbidden");

  // delete files
  const files: Array<file> = await prisma.file.findMany({
    where: { documentId: documentId },
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

  const deleteCount = await prisma.document.delete({
    where: { id: documentId },
  });

  res.send("OK");
};
