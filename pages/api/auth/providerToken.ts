import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, file } from "@prisma/client";
const prisma = new PrismaClient();

import OAuth2Server from "oauth2-server";
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const oauth = new OAuth2Server({
  model: require("./model.js"),
  accessTokenLifetime: 60 * 60,
  allowBearerTokensInQueryString: true,
});

export default async function documentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var request = new Request(req);
  var response = new Response(res);

  const oauthResult = await oauth.token(request, response);
  res.json(oauthResult);
}
