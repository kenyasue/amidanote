import {
  testClient,
  testClientNoAccessToken,
  testClientInvalidUser,
} from "./testClient";
import handler from "../pages/api/user";

import { expect } from "chai";
import global from "./global";

describe("/api/user[GET]", () => {
  it("Search user", async () => {
    const client = await testClient(handler);
    const response = await client.get("/api/user");
    expect(response.status).to.eqls(200);
  });

  it("Search user invalid access token", async () => {
    const client = await testClientNoAccessToken(handler);
    const response = await client.get("/api/user");
    expect(response.status).to.eqls(403);
  });

  it("Search user by query", async () => {
    const client = await testClient(handler, {
      query: {
        email: "t",
      },
    });
    const response = await client.get("/api/user");
    expect(response.status).to.eqls(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).greaterThan(1);
  });
});
