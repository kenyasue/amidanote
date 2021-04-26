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
    await oauthServer.token(request, response);
  } catch (e) {
    console.error(e);
  }

  if (response.status === 302) {
    var location = response.headers.location;
    delete response.headers.location;

    Object.keys(response.headers).map((key) => {
      res.setHeader(key, response.headers[key]);
    });

    res.redirect(303, location);
  } else {
    Object.keys(response.headers).map((key) => {
      res.setHeader(key, response.headers[key]);
    });
    res.status(response.status).send(response.body);
  }
};
