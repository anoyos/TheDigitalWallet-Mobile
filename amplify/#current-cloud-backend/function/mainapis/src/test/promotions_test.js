/* global describe, it */
/* eslint-disable prefer-arrow-callback, max-nested-callbacks, newline-per-chained-call */
const {
  chai: { expect, request },
  knex,
  app,
  login,
  seq,
  factories: {
    User,
    Business,
    Promotion,
    Redemption,
  }
} = require("./test_helper");

describe("Promotions", function() {
  describe("POST /promotions", function() {
    it("creates promotion", async function() {
      const user = await User.create();
      const business = await Business.create(user);
      const promotionParams = Promotion.build(business);

      login(user);
      const response = await request(app)
        .post("/promotions")
        .send(promotionParams);

      expect(response).to.have.status(201);

      const promotion = await knex("promotions").first();
      expect(promotion).to.include({ name: promotionParams.name });
    });

    it("returns 422 on invalid data", async function() {
      const user = await User.create();
      await Business.create(user);

      login(user);
      const response = await request(app)
        .post("/promotions")
        .send({ name: "Invalid params" });

      expect(response).to.have.status(422);
    });
  });

  describe("PATCH /promotions/:id", function() {
    it("updates promotion", async function() {
      const user = await User.create();
      const business = await Business.create(user);
      const promotion = await Promotion.create(business);

      login(user);
      const response = await request(app)
        .patch(`/promotions/${promotion.id}`)
        .send({ name: "Updated name" });

      expect(response).to.have.status(200);

      const dbprom = await knex("promotions").first();
      expect(dbprom).to.include({ name: "Updated name" });
    });

    it("returns 404 when not owner", async function() {
      const someone = await User.create();
      const user = await User.create();
      const business = await Business.create(user);
      const promotion = await Promotion.create(business);

      login(someone);
      const response = await request(app)
        .patch(`/promotions/${promotion.id}`)
        .send({ name: "shouldnt update" });

      expect(response).to.have.status(404);
    });

    it("returns 422 when invalid data", async function() {
      const user = await User.create();
      const business = await Business.create(user);
      const promotion = await Promotion.create(business);

      login(user);
      const response = await request(app)
        .patch(`/promotions/${promotion.id}`)
        .send({ amount_original: 0 });

      expect(response).to.have.status(422);
    });
  });

  describe("DELETE /promotions/:id", function() {
    it("deletes promotion", async function() {
      const user = await User.create();
      const business = await Business.create(user);
      const promotion = await Promotion.create(business);

      login(user);
      const response = await request(app)
        .delete(`/promotions/${promotion.id}`);

      expect(response).to.have.status(201);

      const dbpromos = await knex("promotions").select();
      expect(dbpromos).to.be.empty;
    });

    it("returns 404 when not owner", async function() {
      const someone = await User.create();
      const user = await User.create();
      const business = await Business.create(user);
      const promotion = await Promotion.create(business);

      login(someone);
      const response = await request(app)
        .delete(`/promotions/${promotion.id}`);

      expect(response).to.have.status(404);
    });
  });

  describe("GET /promotions", function() {
    it("returns all promotions", async function() {
      const user = await User.create();
      const businesses = await seq(5, () => Business.create(user));
      const promotions = await Promise.all(businesses.map(b => Promotion.create(b)));

      login(user);
      const response = await request(app).get("/promotions");

      // add back assertion for lat and long 
      expect(response.body).to.have.lengthOf(5);
      expect(response.body.map(p => p.name)).to.have.members(promotions.map(p => p.name));
      expect(response.body.map(p => p.businessName)).to.have.members(businesses.map(p => p.name));
    });
  });

  describe("GET /promotions/business/:businessId", function() {
    it("returns all promotions for business", async function() {
      const user = await User.create();
      const business = await Business.create(user);
      const promotions = await seq(5, () => Promotion.create(business));
      const otherBusiness = await Business.create(user);
      await seq(5, () => Promotion.create(otherBusiness));

      login(user);
      const response = await request(app).get(`/promotions/business/${business.id}`);

      expect(response.body).to.have.lengthOf(5);
      expect(response.body.map(p => p.name)).to.have.members(promotions.map(p => p.name));
    });
  });

  xdescribe("POST /promotions/redeem/referral", function() {
    it("returns 403 if user does not have enough available referrals", async function() {
      const user = await User.create();
      const business = await Business.create(user);
      const promotion = await Promotion.create(business, { type: "referral", amount_facevalue: 1 });

      login(user);

      const response = await request(app)
        .post("/promotions/redeem/referral")
        .send({ promotion_id: promotion.id });

      expect(response).to.have.status(403);
    });

    it("returns 403 if promotion type is not referral", async function() {
      const user = await User.create();
      const business = await Business.create(user);
      const promotion = await Promotion.create(business, { amount_facevalue: 1 });
      const user2 = User.build({ used_referral_code: user.referral_code });
      await request(app)
        .post("/user")
        .send(user2);

      login(user);

      const response = await request(app)
        .post("/promotions/redeem/referral")
        .send({ promotion_id: promotion.id });

      expect(response).to.have.status(403);
    });

    it("creates redemption", async function() {
      const user = await User.create();
      const business = await Business.create(user);
      const promotion = await Promotion.create(business, { type: "referral", amount_facevalue: 1 });
      const user2 = User.build({ used_referral_code: user.referral_code });
      await request(app)
        .post("/user")
        .send(user2);

      login(user);

      const response = await request(app)
        .post("/promotions/redeem/referral")
        .send({ promotion_id: promotion.id });

      expect(response).to.have.status(200);

      const dbRedemption = await knex("redemptions").first();
      expect(dbRedemption).to.include({ aws_user_id: user.aws_user_id, promotion_id: promotion.id });
    });

    it("increases amount used by 1", async function() {
      const user = await User.create();
      const business = await Business.create(user);
      const promotion = await Promotion.create(business, { type: "referral", amount_facevalue: 1 });
      const user2 = User.build({ used_referral_code: user.referral_code });
      await request(app)
        .post("/user")
        .send(user2);

      login(user);

      const response = await request(app)
        .post("/promotions/redeem/referral")
        .send({ promotion_id: promotion.id });

      expect(response).to.have.status(200);

      const dbPromotion = await knex("promotions").first();
      expect(dbPromotion).to.include({ amount_used: 1 });
    });
  });

  describe("POST /promotions/redeem/offer", function() {
    it("creates redemption", async function() {
      const user = await User.create();
      const business = await Business.create(user);
      const promotion = await Promotion.create(business);

      login(user);
      const response = await request(app)
        .post("/promotions/redeem/offer")
        .send({ promotion_id: promotion.id });

      expect(response).to.have.status(200);
      const dbprom = await knex("redemptions").first();
      expect(dbprom).to.include({ promotion_id: promotion.id });
    });
  });

  describe("POST /promotions/:id/confirm_redeem", function() {
    it("confirms redemption", async function() {
      const user = await User.create();
      const owner = await User.create();
      const business = await Business.create(owner);
      const promotion = await Promotion.create(business);
      await Redemption.create(promotion, user);

      login(user);
      const response = await request(app)
        .post(`/promotions/${promotion.id}/confirm_redeem`)
        .send({ transaction_id: "0x0" });

      expect(response).to.have.status(200);

      const dbprom = await knex("redemptions").first();
      expect(dbprom).to.include({ aws_user_id: user.aws_user_id, promotion_id: promotion.id });
    });

    it("changes promotion", async function() {
      const user = await User.create();
      const owner = await User.create();
      const business = await Business.create(owner);
      const promotion = await Promotion.create(business, { use_count_remaining: 10 });
      await Redemption.create(promotion, user);

      login(user);
      const response = await request(app)
        .post(`/promotions/${promotion.id}/confirm_redeem`)
        .send({ transaction_id: "0x0" });

      expect(response).to.have.status(200);

      const dbprom = await knex("promotions").first();
      expect(dbprom).to.include({ use_count_remaining: 9 });
    });
  });
});
