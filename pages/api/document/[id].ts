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
  const folderId: number = req.body.folderId;

  if (utils.isEmpty(title)) return res.status(400).send("title is required");

  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
    },
  });

  if (document === null) return res.status(404).send("Document not found");
  if (document.userId !== user.id) return res.status(403).send("forbidden");

  console.log("title", title);
  console.log("markdown", markdown);

  const updatedDocument = await prisma.document.update({
    where: { id: documentId },
    data: {
      title: title,
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

  const deleteCount = await prisma.document.delete({
    where: { id: documentId },
  });

  res.send("OK");
};
