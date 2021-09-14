import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, project } from "@prisma/client";
const prisma = new PrismaClient();

import fs from "fs/promises";
import path from "path";

import oauthServer, { Request, Response } from "./OAuthServer";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  const request = new Request(req);
  const response = new Response(res);

  try {
    const token = await oauthServer.authenticate(request, response);
    if (!token) {
      return res.status(403).send("Invalid token");
    }
  } catch (e) {
    console.error(e);
  }

  res.json({
    id: "3",
    name: "Standalone3",
    email: "standalone3@clover.studio",
    image: "test",
  });
};
