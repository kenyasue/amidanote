import type { NextApiRequest, NextApiResponse } from "next";
import {
  PrismaClient,
  file,
  project,
  Session as SessionModel,
} from "@prisma/client";
const prisma = new PrismaClient();
import { unlink } from "fs/promises";
import fs, { existsSync } from "fs";
import crypto from "crypto";

import utils from "../../../lib/util";
import checkAuth from "../../../lib/api/checkAuth";
import { Session } from "inspector";

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
 * /api/file/{name}:
 *  get:
 *     summary: download a file
 *     providers:
 *       "application/json"
 *     responses:
 *      '200':
 *        description: File entity
 *        content:

 */
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("req.headers.acceesstoken", req.headers.acceesstoken);
    const user = await checkAuth(req.headers.acceesstoken as string);
    const id: string = req.query.id as string;
    const fileName: string = id;

    const file: file = await prisma.file.findFirst({
      where: {
        OR: [
          {
            path: fileName,
          },
          {
            thumbnailPath: fileName,
          },
        ],
      },
    });

    if (file === null) return res.status(404).send("File not found");

    const project: project = await prisma.project.findFirst({
      where: {
        id: file.projectId,
      },
    });

    if (project.isPrivate && (!user || user.id !== file.userId)) {
      // check token
      const token: string = req.query.token as string;
      let tokenMatched = false;

      if (token) {
        // get session
        const session: SessionModel = await prisma.session.findFirst({
          where: {
            userId: file.userId,
          },
        });

        const shasum1 = crypto.createHash("sha1");

        shasum1.update(session.accessToken);
        const accessTokenInDB = shasum1.digest("hex");

        console.log("accessTokenInDB", session.accessToken);
        console.log("accessTokenInDB hashed", accessTokenInDB);
        console.log("token from url", token);

        tokenMatched = accessTokenInDB === token;
      }

      if (!tokenMatched) return res.status(403).send("Forbidden");
    }

    const filePath = `${process.env.UPLOADS_PATH}/${fileName}`;
    res.setHeader("Content-disposition", "attachment; filename=" + file.name);
    res.setHeader("Content-type", file.mimeType);
    const filestream = fs.createReadStream(filePath);
    filestream.pipe(res);
  } catch (e) {
    console.error(e);
    res.status(500).send("server error");
  }
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
