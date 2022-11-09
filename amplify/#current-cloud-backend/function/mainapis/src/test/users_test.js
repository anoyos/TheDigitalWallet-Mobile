const {
  chai: { expect, request },
  app,
  login,
  seq,
  factories: {
    User,
    Business,
  }
} = require("./test_helper");

describe("Users", function() {
  describe("/user", function () {
    describe("GET /", function() {
      it("returns user info", async function() {
        const user = await User.create();
        login(user);
        const response = await request(app).get("/user");
        expect(response).to.have.status(200);
        expect(response.body).to.include({ email: user.email });
      });

      it("returns user businesses", async function() {
        const user = await User.create();
        const businesses = await Promise.all(seq(3).map(i => Business.create(user, { name: `B${i}` })));
        login(user);
        const response = await request(app).get("/user");
        expect(response).to.have.status(200);
        const businessNames = response.body.businesses.map(b => b.name);
        expect(businessNames).to.have.members(businesses.map(b => b.name));
      });
    });

    describe("/businesses", function() {
      it("returns my businesses", async function() {
        const user = await User.create();
        const businesses = await Promise.all(seq(2).map(() => Business.create(user)));
        await Business.create(User.create()); // not ours business

        login(user);
        const result = await request(app).get("/user/businesses");

        expect(result.body).to.have.lengthOf(2);
        expect(result.body.map(b => b.name)).to.include.members(businesses.map(b => b.name));
      });
    });
  });
});

