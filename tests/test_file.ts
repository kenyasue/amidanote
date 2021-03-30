import {
  testClient,
  testClientNoAccessToken,
  testClientInvalidUser,
} from "./testClient";
import * as handler from "../pages/api/file";

import { expect } from "chai";
import global from "./global";

describe("/api/file [GET]", () => {
  it("Get all files of the document", async () => {
    const client = await testClient(handler, {});
    const response = await client.get(`/api/file`);
    expect(response.text).to.eqls("OK");
  });

  it("Get all files of the project", async () => {
    const client = await testClient(handler, {});
    const response = await client.get(`/api/file`);
    expect(response.text).to.eqls("OK");
  });
});

describe("/api/file[POST]", () => {
  it("responds 200 as success", async () => {
    const client = await testClient(handler);

    const response = await client
      .post("/api/file")
      .field("documentId", global.documentIdForFile)
      .attach("file", __dirname + "/files/picture.jpg");

    expect(response.status).to.eqls(200);
  });

  it("responds 400 documentId needs", async () => {
    const client = await testClient(handler);
    const response = await client
      .post("/api/file")
      .attach("file", __dirname + "/files/picture.jpg");
    expect(response.status).to.eqls(400);
  });

  it("responds 400 file needs", async () => {
    const client = await testClient(handler);
    const response = await client.post("/api/file").field("documentId", "test");
    expect(response.status).to.eqls(400);
  });

  it("responds 404", async () => {
    const client = await testClient(handler);

    const response = await client
      .post("/api/file")
      .field("documentId", "123123123")
      .attach("file", __dirname + "/files/picture.jpg");

    expect(response.status).to.eqls(404);
  });

  it("responds 404", async () => {
    const client = await testClient(handler);

    const response = await client
      .post("/api/file")
      .field("documentId", global.documentIdNoAccess)
      .attach("file", __dirname + "/files/picture.jpg");

    expect(response.status).to.eqls(403);
  });
});
