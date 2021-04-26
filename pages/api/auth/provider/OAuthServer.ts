import NodeOAuthServer, { ServerOptions } from "oauth2-server";

import model from "./model";

const oauthServer = new NodeOAuthServer({
  model: model as any,
  accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
});

export default oauthServer;
export const Request = NodeOAuthServer.Request;
export const Response = NodeOAuthServer.Response;
