import {
  testClient,
  testClientNoAccessToken,
  testClientInvalidUser,
} from "./testClient";
import handler from "../pages/api/project";
import handler2 from "../pages/api/project/default";
import handler3 from "../pages/api/project/[id]";

import { expect } from "chai";
import global from "./global";

describe("/api/project[POST]", () => {
  it("responds 200 as success", async () => {
    const client = await testClient(handler);

    const response = await client
      .post("/api/project")
      .send({ name: "test", isPrivate: false });

    expect(response.status).to.eqls(200);
  });
});

describe("/api/project[POST]", () => {
  it("responds 400", async () => {
    const client = await testClient(handler);

    const response = await client.post("/api/project").send({});

    expect(response.status).to.eqls(400);
  });

  it("responds 403 as success", async () => {
    const client = await testClientNoAccessToken(handler);

    const response = await client
      .post("/api/project")
      .send({ name: "test", isPrivate: false });

    expect(response.status).to.eqls(403);
  });
});

describe("/api/project [GET]", () => {
  it("responds 200 as success", async () => {
    const client = await testClient(handler, {});
    const response = await client.get(`/api/project`);
    expect(response.status).to.eqls(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).is.greaterThan(0);
  });

  it("responds 403 as forbidden", async () => {
    const client = await testClientNoAccessToken(handler, {});
    const response = await client.get(`/api/project`);
    expect(response.status).to.eqls(403);
  });

  it("responds 200 and 1 elements as success", async () => {
    const client = await testClientInvalidUser(handler, {});
    const response = await client.get(`/api/project`);
    expect(response.status).to.eqls(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.eqls(1);
  });
});

describe("/api/project/default [GET]", () => {
  it("responds 200 as success", async () => {
    const client = await testClient(handler2, {});
    const response = await client.get(`/api/project/default`);
    expect(response.status).to.eqls(200);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.own.property("id");
  });

  it("responds 403 as forbidden", async () => {
    const client = await testClientNoAccessToken(handler2, {});
    const response = await client.get(`/api/project/default`);
    expect(response.status).to.eqls(403);
  });

  it("create automatically new project if user has no project", async () => {
    const client = await testClientInvalidUser(handler2, {});
    const response = await client.get(`/api/project/default`);
    expect(response.status).to.eqls(200);
    expect(response.body).to.be.an("object");

    expect(response.body).to.have.own.property("id");
  });
});

describe("/api/project[PUT]", () => {
  it("responds 200 as success", async () => {
    const client = await testClient(handler3, {
      query: {
        id: global.projectId1,
      },
    });

    const response = await client
      .put(`/api/project/${global.projectId1}`)
      .send({ name: "test", isPrivate: false });

    expect(response.status).to.eqls(200);
  });
});

describe("/api/project[PUT]", () => {
  it("responds 403 as success", async () => {
    const client = await testClient(handler3, {
      query: {
        id: global.projectId2,
      },
    });

    const response = await client
      .put(`/api/project/${global.projectId2}`)
      .send({ name: "test", isPrivate: false });

    expect(response.status).to.eqls(403);
  });
});

describe("/api/project[DELETE]", () => {
  it("responds 200 as success", async () => {
    const client = await testClient(handler3, {
      query: {
        id: global.projectId1,
      },
    });

    const response = await client.delete(`/api/project/${global.projectId1}`);

    expect(response.status).to.eqls(200);
  });
});

describe("/api/project[DELETE]", () => {
  it("responds 404 as success", async () => {
    const client = await testClient(handler3, {
      query: {
        id: 123123123,
      },
    });

    const response = await client.delete(`/api/project/${global.projectId1}`);

    expect(response.status).to.eqls(404);
  });
});

describe("/api/project[DELETE]", () => {
  it("responds 403 as success", async () => {
    const client = await testClient(handler3, {
      query: {
        id: global.projectId2,
      },
    });

    const response = await client.delete(`/api/project/${global.projectId2}`);

    expect(response.status).to.eqls(403);
  });
});
