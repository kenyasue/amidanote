import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, project } from "@prisma/client";
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
 * /api/document:
 *  get:
 *     summary: Get all documents of the user
 *     providers:
 *       "application/json"
 *     responses:
 *      '403':
 *        forbidden
 *      '200':
 *        description: A list of Documents of the user
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Document'
 */
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  let user = null;

  if (req.headers.acceesstoken)
    user = await checkAuth(req.headers.acceesstoken as string);

  let projectId: number = 0;
  if (req.query && req.query.project)
    projectId = parseInt(req.query.project as string);

  // check permission in case projectId is specified
  const conditions: any = {
    userId: user ? user.id : 0,
  };

  let project: project = null;

  if (projectId !== 0) {
    project = await prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) return res.status(404).send("No Project");

    if (project.isPrivate === true) {
      if (
        !user ||
        (project.userId !== user.id &&
          project.collaborators.indexOf(user.email) === -1)
      )
        return res.status(403).send("Forbidden");
    }

    // switch owner use to project one in case project is public
    if (project.isPrivate === false) conditions.userId = project.userId;
  }

  if (projectId !== 0) conditions.projectId = projectId;

  // access denied if no projectid and no access token
  if (projectId === 0 && !user) return res.status(403).send("Forbidden");

  if (user && project.collaborators.indexOf(user.email) !== -1)
    delete conditions.userId;

  const allDocuments = await prisma.document.findMany({
    where: conditions,
    orderBy: [
      {
        title: "asc",
      },
    ],
  });

  res.send(allDocuments);
};

/**
 * @swagger
 * /api/document:
 *  post:
 *     summary: Adds a document
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
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
const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  // check accesstoken
  if (!req.headers.acceesstoken) return res.status(403).send("Forbidden");
  const user = await checkAuth(req.headers.acceesstoken as string);
  if (!user) return res.status(403).send("Forbidden");

  const markdown: string = req.body.markdown;
  const title: string = req.body.title;
  const format: string = req.body.format;
  const projectId: number = parseInt(req.body.projectId);

  if (utils.isEmpty(title)) return res.status(400).send("title is required");
  if (!projectId) return res.status(400).send("projectId is required");

  // check the user own the project
  const projectResult = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
    orderBy: [
      {
        id: "asc",
      },
    ],
  });

  if (!projectResult || projectResult.userId !== user.id)
    if (!projectId) return res.status(400).send("Wrong project id");

  const newDocument = await prisma.document.create({
    data: {
      title: title,
      format: format,
      markdown: markdown,
      user: {
        connect: { id: user.id },
      },
      project: {
        connect: { id: projectId },
      },
    },
  });

  res.send(newDocument);
};
