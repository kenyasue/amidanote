import {
  testClient,
  testClientNoAccessToken,
  testClientInvalidUser,
} from "./testClient";
import handler from "../pages/api/document";
import handler2 from "../pages/api/document/[id]";

import { expect } from "chai";
import global from "./global";

describe("/api/document [GET]", () => {
  it("responds 200 as success", async () => {
    const client = await testClient(handler, {});
    const response = await client.get(`/api/document`);
    expect(response.status).to.eqls(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.eqls(10);
  });

  it("responds 403 as forbidden", async () => {
    const client = await testClientNoAccessToken(handler, {});
    const response = await client.get(`/api/document`);
    expect(response.status).to.eqls(403);
  });

  it("responds 200 and 5 elements as success", async () => {
    const client = await testClientInvalidUser(handler, {});
    const response = await client.get(`/api/document`);
    expect(response.status).to.eqls(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.eqls(5);
  });
});

describe("/api/document/{id}[GET]", () => {
  it("responds 200 as success", async () => {
    const client = await testClient(handler2, {
      query: {
        id: global.documentIdToDelete,
      },
    });

    const response = await client.get(
      `/api/document/${global.documentIdToDelete}`
    );

    expect(response.status).to.eqls(200);
  });

  it("responds 403 as forbidden", async () => {
    const client = await testClientNoAccessToken(handler2, {
      query: {
        id: global.documentIdToDelete,
      },
    });

    const response = await client.get(
      `/api/document/${global.documentIdToDelete}`
    );

    expect(response.status).to.eqls(403);
  });

  it("responds 403 as forbidden", async () => {
    const client = await testClientNoAccessToken(handler2, {
      query: {
        id: global.documentIdToDelete,
      },
    });

    const response = await client.get(
      `/api/document/${global.documentIdToDelete}`
    );

    expect(response.status).to.eqls(403);
  });
});

describe("/api/document[POST]", () => {
  it("responds 200 as success", async () => {
    const client = await testClient(handler);

    const response = await client
      .post("/api/document")
      .send({ markdown: "test", title: "test" });

    expect(response.status).to.eqls(200);
  });
});

describe("/api/document[POST]", () => {
  it("responds 400", async () => {
    const client = await testClient(handler);

    const response = await client.post("/api/document").send({});

    expect(response.status).to.eqls(400);
  });

  it("responds 403 as success", async () => {
    const client = await testClientNoAccessToken(handler);

    const response = await client
      .post("/api/document")
      .send({ markdown: "test", title: "test" });

    expect(response.status).to.eqls(403);
  });
});

describe("/api/document[PUT]", () => {
  it("responds 200 as success", async () => {
    const client = await testClient(handler2, {
      query: {
        id: global.documentIdToDelete,
      },
    });

    const response = await client
      .put(`/api/document/${global.documentIdToDelete}`)
      .send({ markdown: "test", title: "test" });

    expect(response.status).to.eqls(200);
  });

  it("responds 403 as forbidden", async () => {
    const client = await testClientNoAccessToken(handler2, {
      query: {
        id: global.documentIdToDelete,
      },
    });

    const response = await client
      .put(`/api/document/${global.documentIdToDelete}`)
      .send({ markdown: "test", title: "test" });

    expect(response.status).to.eqls(403);
  });

  it("responds 403 as forbidden", async () => {
    const client = await testClientNoAccessToken(handler2, {
      query: {
        id: global.documentIdToDelete,
      },
    });

    const response = await client
      .put(`/api/document/${global.documentIdToDelete}`)
      .send({ markdown: "test", title: "test" });

    expect(response.status).to.eqls(403);
  });
});

describe("/api/document[PUT]", () => {
  it("responds 404", async () => {
    const client = await testClient(handler2, {
      query: {
        id: 100000000,
      },
    });

    const response = await client
      .put(`/api/document/aaaa`)
      .send({ markdown: "test", title: "test" });

    expect(response.status).to.eqls(404);
  });
});

describe("/api/document[PUT]", () => {
  it("responds 400 as success", async () => {
    const client = await testClient(handler2, {
      query: {
        id: global.documentIdToDelete,
      },
    });

    const response = await client
      .put(`/api/document/${global.documentIdToDelete}`)
      .send({});

    expect(response.status).to.eqls(400);
  });
});

describe("/api/document[DELETE]", () => {
  it("responds 404", async () => {
    const client = await testClient(handler2, {
      query: {
        id: 100000000,
      },
    });

    const response = await client.delete(`/api/document/aaaa`);

    expect(response.status).to.eqls(404);
  });

  it("responds 403 as forbidden", async () => {
    const client = await testClientNoAccessToken(handler2, {
      query: {
        id: global.documentIdToDelete,
      },
    });

    const response = await client.delete(
      `/api/document/${global.documentIdToDelete}`
    );

    expect(response.status).to.eqls(403);
  });

  it("responds 403 as forbidden", async () => {
    const client = await testClientNoAccessToken(handler2, {
      query: {
        id: global.documentIdToDelete,
      },
    });

    const response = await client.delete(
      `/api/document/${global.documentIdToDelete}`
    );

    expect(response.status).to.eqls(403);
  });

  it("responds 200 as success", async () => {
    const client = await testClient(handler2, {
      query: {
        id: global.documentIdToDelete,
      },
    });

    const response = await client.delete(
      `/api/document/${global.documentIdToDelete}`
    );

    expect(response.status).to.eqls(200);
  });
});
