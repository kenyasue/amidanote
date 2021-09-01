import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, file } from "@prisma/client";
const prisma = new PrismaClient();
import fs, { existsSync } from "fs";
import { unlink } from "fs/promises";

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
 * /api/document/warContent/{id}:
 *  get:
 *     summary: Get a content of the document
 *     providers:
 *       "application/json"
 *     responses:
 *      '200':
 *        description: One Document
 *        content:
 *          application/text:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Document'
 */
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const id: string = req.query.id as string;
  const documentId: number = parseInt(id);

  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
    },
  });

  if (document === null) return res.status(404).send("Document not found");

  res.send(document.markdown);
};
