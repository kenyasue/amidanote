import { testClient } from "./testClient";
import handler from "../pages/api/test";
import { expect } from "chai";

describe("/ handler", () => {
  it("responds 200 to authed GET", async () => {
    const client = await testClient(handler);
    const response = await client.get("/");
    expect(response.status).to.eqls(200);
  });
});
