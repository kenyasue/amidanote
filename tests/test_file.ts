import {
  testClient,
  testClientNoAccessToken,
  testClientInvalidUser,
} from "./testClient";
import * as handler from "../pages/api/file";
import handler2 from "../pages/api/file/[id]";

import { expect } from "chai";
import global from "./global";
var crypto = require("crypto");

let fileId1: number = null;
let fileId2: number = null;

let fileName1: string = null;
let fileName2: string = null;

describe("/api/file[POST]", () => {
  it("responds 200 as success private document", async () => {
    const client = await testClient(handler);

    const response = await client
      .post("/api/file")
      .field("documentId", global.documentIdForFile)
      .attach("file", __dirname + "/files/picture.jpg");

    expect(response.status).to.eqls(200);

    fileId1 = response.body.id;
    fileName1 = response.body.path;
  });

  it("responds 200 as success public document", async () => {
    const client = await testClient(handler);

    const response = await client
      .post("/api/file")
      .field("documentId", global.documentIdPublic)
      .attach("file", __dirname + "/files/doc.pdf");

    expect(response.status).to.eqls(200);
    fileId2 = response.body.id;
    fileName2 = response.body.path;
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

describe("/api/file [GET]", () => {
  it("Get all files of the document", async () => {
    const client = await testClient(handler, {
      query: {
        document: global.documentIdForFile,
      },
    });

    const response = await client.get(`/api/file`);
    expect(response.status).to.eqls(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.eqls(1);
  });

  it("Get all files of the project", async () => {
    const client = await testClient(handler, {
      query: {
        project: global.projectId1,
      },
    });

    const response = await client.get(`/api/file`);
    expect(response.status).to.eqls(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.eqls(1);
  });

  it("Get files in public project without access token", async () => {
    const client = await testClientNoAccessToken(handler, {
      query: {
        document: global.documentIdPublic,
      },
    });

    const response = await client.get(`/api/file`);
    expect(response.status).to.eqls(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.eqls(1);
  });

  it("Get files in private project without access token", async () => {
    const client = await testClientNoAccessToken(handler, {
      query: {
        document: global.documentIdForFile,
      },
    });

    const response = await client.get(`/api/file`);
    expect(response.status).to.eqls(403);
  });

  it("Get files in public project without access token by project id", async () => {
    const client = await testClientNoAccessToken(handler, {
      query: {
        project: global.projectId3,
      },
    });

    const response = await client.get(`/api/file`);
    expect(response.status).to.eqls(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.eqls(1);
  });

  it("Get files in private project without access token by project id", async () => {
    const client = await testClientNoAccessToken(handler, {
      query: {
        project: global.projectId1,
      },
    });

    const response = await client.get(`/api/file`);
    expect(response.status).to.eqls(403);
  });

  it("Get all files of the document which is not belongs to me", async () => {
    const client = await testClient(handler, {
      query: {
        document: global.documentIdNoAccess,
      },
    });

    const response = await client.get(`/api/file`);
    expect(response.status).to.eqls(403);
  });

  it("Get all files of the document which is not belongs to me by projectid", async () => {
    const client = await testClient(handler, {
      query: {
        project: global.projectId2,
      },
    });

    const response = await client.get(`/api/file`);
    expect(response.status).to.eqls(403);
  });
});

describe("/api/file[GET]", () => {
  it("responds 200", async () => {
    const client = await testClient(handler2, {
      query: {
        id: fileName1,
      },
    });

    const response = await client.get(`/api/file/${fileName1}`);

    expect(response.status).to.eqls(200);
  });

  it("responds 200 with accessToken", async () => {
    const shasum = crypto.createHash("sha1");
    shasum.update(global.accessToken1);
    const accessToken = shasum.digest("hex");

    const client = await testClientInvalidUser(handler2, {
      query: {
        id: fileName1,
        token: accessToken,
      },
    });

    const response = await client.get(`/api/file/${fileName1}`);

    expect(response.status).to.eqls(200);
  });

  it("responds 403", async () => {
    const client = await testClientInvalidUser(handler2, {
      query: {
        id: fileName1,
      },
    });

    const response = await client.get(`/api/file/${fileName1}`);

    expect(response.status).to.eqls(403);
  });

  it("responds 200, access to public file", async () => {
    const client = await testClient(handler2, {
      query: {
        id: fileName2,
      },
    });

    const response = await client.get(`/api/file/${fileName2}`);

    expect(response.status).to.eqls(200);
  });

  /*
  it("responds 404", async () => {
    const client = await testClient(handler2, {
      query: {
        id: 100000000,
      },
    });

    const response = await client.get(`/api/file/100000000`);

    expect(response.status).to.eqls(404);
  });

  it("responds 403", async () => {
    const client = await testClientInvalidUser(handler2, {
      query: {
        id: fileId1,
      },
    });

    const response = await client.get(`/api/file/${fileId1}`);

    expect(response.status).to.eqls(403);
  });

  it("responds 200", async () => {
    const client = await testClient(handler2, {
      query: {
        id: fileId1,
      },
    });

    const response = await client.get(`/api/file/${fileId1}`);

    expect(response.status).to.eqls(200);
  });

  it("responds 200", async () => {
    const client = await testClient(handler2, {
      query: {
        id: fileId2,
      },
    });

    const response = await client.get(`/api/file/${fileId2}`);

    expect(response.status).to.eqls(200);
  });

  it("responds 404 after delete", async () => {
    const client = await testClient(handler2, {
      query: {
        id: fileId1,
      },
    });

    const response = await client.get(`/api/file/${fileId1}`);

    expect(response.status).to.eqls(404);
  });

  */
});

describe("/api/document[DELETE]", () => {
  it("responds 404", async () => {
    const client = await testClient(handler2, {
      query: {
        id: 100000000,
      },
    });

    const response = await client.delete(`/api/file/100000000`);

    expect(response.status).to.eqls(404);
  });

  it("responds 403", async () => {
    const client = await testClientInvalidUser(handler2, {
      query: {
        id: fileId1,
      },
    });

    const response = await client.delete(`/api/file/${fileId1}`);

    expect(response.status).to.eqls(403);
  });

  it("responds 200", async () => {
    const client = await testClient(handler2, {
      query: {
        id: fileId1,
      },
    });

    const response = await client.delete(`/api/file/${fileId1}`);

    expect(response.status).to.eqls(200);
  });

  it("responds 200", async () => {
    const client = await testClient(handler2, {
      query: {
        id: fileId2,
      },
    });

    const response = await client.delete(`/api/file/${fileId2}`);

    expect(response.status).to.eqls(200);
  });

  it("responds 404 after delete", async () => {
    const client = await testClient(handler2, {
      query: {
        id: fileId1,
      },
    });

    const response = await client.delete(`/api/file/${fileId1}`);

    expect(response.status).to.eqls(404);
  });
});
