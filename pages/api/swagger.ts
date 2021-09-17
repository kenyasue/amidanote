import type { NextApiRequest, NextApiResponse } from "next";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

/**
 * @swagger
 *
 * definitions:
 *   Document:
 *     markdown: string
 *     modifiedAt: string
 *     createAt: string
 */

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       required:
 *         - userId
 *         - documentId
 *         - projectId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the document.
 *        userId
 *           type: integer
 *           description: The owner of the document
 *        documentId
 *           type: integer
 *           description: The document of the file belongs to
 *        projectId
 *           type: integer
 *           description: The project of the file belongs to
 *        modifiedAt:
 *            type: string
 *            format: datetime
 *        modifiedAt:
 *            type: string
 *            format: datetime
 *        modifiedAt:
 *            type: string
 *            format: datetime
 *        createAt:
 *           type: string
 *           format: datetime
 *     Document:
 *       type: object
 *       required:
 *         - title
 *         - markdown
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the document.
 *        userId
 *           type: integer
 *           description: The owner of the document
 *         title:
 *           type: string
 *           description: The title of the document
 *         markdown:
 *           type: string
 *           description: The markdown of the document
 *         folderId:
 *           type: number
 *         modifiedAt:
 *            type: string
 *            format: datetime
 *         createAt:
 *           type: string
 *           format: datetime
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - isPrivate
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the project.
 *        userId
 *           type: integer
 *           description: The owner of the project
 *         name:
 *           type: string
 *           description: The title of the document
 *         isPrivate:
 *           type: boolean
 *           description: The flag indicate the project is private or public
 *         modifiedAt:
 *            type: string
 *            format: datetime
 *         createAt:
 *           type: string
 *           format: datetime
 */

export default (_req: NextApiRequest, res: NextApiResponse) => {
  const projectTopPath = path.resolve(process.cwd());

  const options = {
    swaggerDefinition: {
      openapi: "3.0.1",
      info: {
        title: "clover.md",
        version: "1.0.0",
      },
      host: `app.amidanote.com`, // Host (optional)
      basePath: "/", // Base path (optional)
    },
    apis: [projectTopPath + "/pages/api/**/*.ts"],
  };

  const swaggerSpecification = swaggerJsdoc(options);

  res.status(200).send(swaggerSpecification);
};
