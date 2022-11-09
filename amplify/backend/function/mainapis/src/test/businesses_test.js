/* global describe, it */
/* eslint-disable prefer-arrow-callback, max-nested-callbacks */
const {
  chai: { expect, request },
  app,
  knex,
  login,
  factories: {
    User,
    Business,
  }
} = require("./test_helper");

describe("/businesses", function() {
  describe("GET", function () {
    it("returns all businesses", async function() {
      const user = await User.create();
      await Business.create(user, { name: "Test Business" });
      login(user);
      const response = await request(app).get("/businesses");
      expect(response).to.have.status(200);
      expect(response.body[0]).to.include({ name: "Test Business" });
    });
  });
});

describe("PATCH /businesses/:id", function() {
  it("updates business", async function() {
    const user = await User.create();
    const business = await Business.create(user);

    login(user);
    const response = await request(app)
      .patch(`/businesses/${business.id}`)
      .send({ name: "Updated name" });

    expect(response).to.have.status(200);

    const dbprom = await knex("businesses").first();
    expect(dbprom).to.include({ name: "Updated name" });
  });

  it("returns 404 when not owner", async function() {
    const someone = await User.create();
    const user = await User.create();
    const business = await Business.create(user);

    login(someone);
    const response = await request(app)
      .patch(`/businesses/${business.id}`)
      .send({ name: "shouldnt update" });

    expect(response).to.have.status(404);
  });

  it("returns 422 when invalid data", async function() {
    const user = await User.create();
    const business = await Business.create(user);

    login(user);
    const response = await request(app)
      .patch(`/businesses/${business.id}`)
      .send({ category_id: 0.5 });

    expect(response).to.have.status(422);
  });
});

