import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, file } from "@prisma/client";
const prisma = new PrismaClient();
import { unlink } from "fs/promises";
import { existsSync } from "fs";

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
 * /api/file/{id}:
 *  get:
 *     summary: download a file
 *     providers:
 *       "application/json"
 *     responses:
 *      '200':
 *        description: File entity
 *        content:

 */
const handleGet = async (_req: NextApiRequest, res: NextApiResponse) => {
  res.send("ok");
};

/**
 * @swagger
 * /api/file/{id}:
 *  delete:
 *     summary: Delete a file
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

  try {
    const id: string = req.query.id as string;
    const fileId: number = parseInt(id);

    const file: file = await prisma.file.findFirst({
      where: {
        id: fileId,
      },
    });

    if (file === null) return res.status(404).send("File not found");
    if (file.userId !== user.id) return res.status(403).send("forbidden");

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

    const deleteCount = await prisma.file.delete({
      where: { id: fileId },
    });

    res.send("OK");
  } catch (e) {
    console.error(e);
    res.status(500).send("server error");
  }
};
