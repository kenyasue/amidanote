import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
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
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

/**
 * @swagger
 * /api/user:
 *  get:
 *     summary: Search user
 *     providers:
 *       "application/json"
 *     responses:
 *      '403':
 *        forbidden
 *      '200':
 *        description: A list of users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 */
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  // check accesstoken

  if (!req.headers.acceesstoken) return res.status(403).send("Forbidden");
  const user = await checkAuth(req.headers.acceesstoken as string);
  if (!user) return res.status(403).send("Forbidden");

  const email: string = req.query.email as string;

  if (email) {
    const allUsers = await prisma.user.findMany({
      where: {
        email: {
          startsWith: email,
        },
      },
      take: 5,
    });
    return res.send(allUsers);
  }

  const idStr: string = req.query.id as string;

  if (idStr) {
    console.log("idStr", idStr);
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(idStr),
      },
    });
    return res.send(user);
  }

  res.send([]);
};
