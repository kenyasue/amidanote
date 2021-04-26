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

  const username = request.body.username;
  const password = request.body.password;

  if (username === "username" && password === "password") {
    req.body.user = { user: 1 };

    const code = await oauthServer.authorize(request, response, {
      authenticateHandler: {
        handle: (request: any) => {
          return request.body.user;
        },
      },
    });

    //res.locals.oauth = { code: code };

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
  } else {
    const params = [
      // Send params back down
      "client_id",
      "redirect_uri",
      "response_type",
      "grant_type",
      "state",
    ]
      .map((a) => `${a}=${req.body[a]}`)
      .join("&");
    return res.redirect(`/`);
  }
};
