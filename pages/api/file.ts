import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, document, User, project } from "@prisma/client";
const prisma = new PrismaClient();
import { copyFile, unlink, writeFile } from "fs/promises";
import { File } from "formidable";
import imageThumbnail from "image-thumbnail";

import utils from "../../lib/util";
import checkAuth from "../../lib/api/checkAuth";
import { write } from "fs";

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

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @swagger
 * /api/file:
 *  get:
 *     summary: Get all files belongs to project or document
 *     providers:
 *       "application/json"
 *     responses:
 *      '403':
 *        forbidden
 *      '200':
 *        description: A list of files belongs to project or document
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/File'
 */
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const user: User = req.headers.acceesstoken
    ? await checkAuth(req.headers.acceesstoken as string)
    : null;

  try {
    let projectId: number =
      req.query && req.query.project
        ? parseInt(req.query.project as string)
        : null;

    let documentId: number =
      req.query && req.query.document
        ? parseInt(req.query.document as string)
        : null;

    if (!projectId && !documentId)
      return res.status(400).send("projectId or documentId should declear");

    let project: project = null;
    let document: document = null;

    if (documentId) {
      document = await prisma.document.findFirst({
        where: {
          id: documentId,
        },
      });

      // check existance
      if (document === null) return res.status(404).send("Document not found");

      const documentProject: project = await prisma.project.findFirst({
        where: {
          id: document.projectId,
        },
      });

      // check existance of project
      if (documentProject === null)
        return res.status(404).send("Wrong document");

      // check priviledges
      if (!user && documentProject.isPrivate === true)
        return res.status(403).send("Forbidden");

      if (user && document.userId !== user.id)
        return res.status(403).send("Forbidden");

      const allFiles = await prisma.file.findMany({
        where: {
          documentId: documentId,
        },
        orderBy: [
          {
            createdAt: "asc",
          },
        ],
      });

      return res.send(allFiles);
    } else if (projectId) {
      project = await prisma.project.findFirst({
        where: {
          id: projectId,
        },
      });

      // check existance
      if (project === null) return res.status(404).send("Project not found");

      // check priviledges
      if (!user && project.isPrivate === true)
        return res.status(403).send("Forbidden");

      if (user && project.userId !== user.id)
        return res.status(403).send("Forbidden");

      const allFiles = await prisma.file.findMany({
        where: {
          projectId: projectId,
        },
        orderBy: [
          {
            createdAt: "asc",
          },
        ],
      });

      return res.send(allFiles);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("server error");
  }
};

/**
 * @swagger
 * /api/file:
 *  post:
 *     summary: Upload a file
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: file
 *               documentId:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/File'
 *       '400':
 *         description: Wrong paramter
 */
const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  // check accesstoken
  if (!req.headers.acceesstoken) return res.status(403).send("Forbidden");
  const user = await checkAuth(req.headers.acceesstoken as string);
  if (!user) return res.status(403).send("Forbidden");

  try {
    const requestBody = await utils.parseForm(req);

    if (utils.isEmpty(requestBody.fields.documentId))
      return res.status(400).send("documentId is required");

    if (utils.isEmpty(requestBody.files.file))
      return res.status(400).send("file is required");

    // check document exists
    const documentId: number = parseInt(requestBody.fields.documentId);
    const document: document = await prisma.document.findFirst({
      where: {
        id: documentId,
      },
    });

    if (!document) return res.status(404).send("the document doesnt exist");

    // check the user has access to the document
    if (document.userId !== user.id) return res.status(403).send("forbiddend");

    const originalFile: File = requestBody.files.file;

    const filenameChunks = originalFile.name.split(".");
    const extension = filenameChunks[filenameChunks.length - 1];

    const newFilename = `${utils.randomString(16)}.${extension}`;
    const newPath = `${process.env.UPLOADS_PATH}/${newFilename}`;

    await copyFile(originalFile.path, newPath);
    await unlink(originalFile.path);

    // generate thumbnail if file is the picture
    let thumbFileName = "";
    let thumbFilePath = "";

    if (/image/.test(originalFile.type)) {
      thumbFileName = `${utils.randomString(16)}.${extension}`;
      thumbFilePath = `${process.env.UPLOADS_PATH}/${thumbFileName}`;

      const thumbnailBuffer = await imageThumbnail(newPath, {
        width: 500,
        height: 500,
        responseType: "buffer",
        fit: "cover",
      });

      await writeFile(thumbFilePath, thumbnailBuffer);
    }

    const file = await prisma.file.create({
      data: {
        path: newFilename,
        thumbnailPath: thumbFileName,
        size: originalFile.size,
        name: originalFile.name,
        mimeType: originalFile.type,
        document: {
          connect: { id: document.id },
        },
        project: {
          connect: { id: document.projectId },
        },
        user: {
          connect: { id: user.id },
        },
      },
    });

    res.status(200).send(file);
  } catch (e) {
    console.error(e);
    res.status(500).send("server error");
  }
};
``;
