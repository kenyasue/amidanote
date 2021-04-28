import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, project } from "@prisma/client";
const prisma = new PrismaClient();

import fs from "fs/promises";
import path from "path";

import NodeOAuthServer from "oauth2-server";
const Request = NodeOAuthServer.Request;
const Response = NodeOAuthServer.Response;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  const filePath =
    path.resolve(process.env.BASE_PATH) +
    "/pages/api/auth/provider/oauthAuthenticate.html";
  const fileContent = await fs.readFile(filePath, "utf8");
  res.send(fileContent);
};
