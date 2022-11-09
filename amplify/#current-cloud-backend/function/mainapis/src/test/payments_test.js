const {
  chai: { expect, request },
  knex,
  app,
  login,
  factories: {
    User,
    CoinbaseCharge,
  }
} = require("./test_helper");
const coinbase = require("./factories/coinbase");

describe("Payments", function() {
  describe("stripe", function() {
    describe("POST /pay/charge", function () {
      it("returns 200", async function() {
        login(await User.create());
        const response = await request(app)
          .post("/pay/charge")
          .send({
            amount: 100000,
            currency: "eur",
            source: "tok_example",
          });
        expect(response).to.have.status(200);
        expect(response.body).to.deep.include({ charge: { id: "ch_mock_charge" }});
      });
    });

    describe("POST /pay/subscribe", function () {
      it("returns 200", async function() {
        login(await User.create());
        const response = await request(app)
          .post("/pay/subscribe")
          .send({
            plan: "gold",
            source: "tok_example",
          });
        expect(response).to.have.status(200);
        expect(response.body).to.deep.include({ subscription: { id: "ch_mock_subscription", plan: { currency: "usd", amount: 100 } }});
      });
    });

    describe("GET /pay/sources", function () {
      it("returns 200", async function() {
        login(await User.create());
        const response = await request(app).get("/pay/sources");
        expect(response).to.have.status(200);
        expect(response.body).to.deep.include({ sources: [{ id: "src_listed_card" }]});
      });
    });

    describe("GET /pay/plans", function () {
      it("returns 200", async function() {
        login(await User.create());
        const response = await request(app).get("/pay/plans");
        expect(response).to.have.status(200);
        expect(response.body).to.deep.include({ plans: [{ id: "plan_active_plan" }]});
      });
    });

    describe("POST /pay/sources", function () {
      it("returns 200", async function() {
        login(await User.create());
        const response = await request(app).post("/pay/sources").send({ source: "tok_example" });
        expect(response).to.have.status(200);
        expect(response.body).to.deep.include({ sources: { id: "src_created_card" }});
      });
    });

    describe("PATCH /pay/sources", function () {
      it("returns 200", async function() {
        login(await User.create());
        const response = await request(app).patch("/pay/sources").send({ source: "tok_example", name: "test" });
        expect(response).to.have.status(200);
        expect(response.body).to.deep.include({ sources: { id: "src_updated_card" }});
      });
    });

    describe("DELETE /pay/sources", function () {
      it("returns 200", async function() {
        login(await User.create());
        const response = await request(app).delete("/pay/sources").send({ source: "tok_example", name: "test" });
        expect(response).to.have.status(200);
        expect(response.body).to.deep.include({ sources: { id: "src_deleted_card", deleted: true }});
      });
    });

    describe("POST /pay/stripe-webhook", function () {
      it("charge.succeeded returns 403", async function() {
        const { aws_user_id, wallet_address } = await User.create();
        const response = await request(app)
          .post("/pay/stripe-webhook")
          .send({
            id: "test_event_id",
            type: "charge.succeeded",
            created: 123123,
            data: {
              object: {
                id: "ch_charge_test",
                amount: 100,
                customer: "mock_created_customer",
                currency: "usd",
                metadata: {
                  aws_user_id,
                  wallet_address,
                }
              }
            }
          });
        expect(response).to.have.status(403);
      });
    });

  });

  describe("coinbase", function () {
    describe("POST /pay/coinbase/charge", function () {
      it("returns 200", async function() {
        login(await User.create());
        const response = await request(app)
          .post("/pay/coinbase/charge")
          .send({
            amount: "1",
            currency: "USD",
          });
        expect(response).to.have.status(200);
        expect(response.body).to.deep.include({
          name: "Buy BAL",
          description: "Buy some tokens \\o/",
          expires_at: "2019-08-27T19:57:37Z",
          hosted_url: "https://commerce.coinbase.com/charges/YHGDEFVE",
          payments: [
            {
              name: "ethereum",
              amount: "0.005341000",
              currency: "ETH",
              address: "0x3242ed06df500a2395ec8c5a877e91dd94daab2f",
            },
            {
              name: "bitcoin",
              amount: "0.00009822",
              currency: "BTC",
              address: "167Kxdh6e6cWHipLh3jo9UG9Y4ATSHUF1V",
            },
            {
              name: "litecoin",
              amount: "0.01372966",
              currency: "LTC",
              address: "LQEnrfYR5B8UjPgS695cbbapdv1FpeoqGp",
            },
            {
              name: "bitcoincash",
              amount: "0.00321048",
              currency: "BCH",
              address: "qpvk7la4mzkqrcwcvj9jcxvpef53qrw9t50uc839n2",
            },
            {
              name: "usdc",
              amount: "1.000000",
              currency: "USDC",
              address: "0x4a8d4437912a444bf424968380fc9735863a8a24",
            }
          ]
        });
      });
    });

    describe("webhook", function () {
      it("returns 200", async function () {
        const user = await User.create();
        await CoinbaseCharge.create(user, { code: "YK7PWYN4" });
        const event = coinbase.confirmed(user);
        const response = await request(app)
          .post("/pay/coinbase/webhook")
          .send(event);

        expect(response).to.have.status(200);
        const charge = await knex("coinbase_charges").first();
        expect(charge).to.include({
          aws_user_id: user.aws_user_id,
          code: "YK7PWYN4",
          name: "Test Charge",
          amount: 1,
          currency: "USD",
          state: "charge:confirmed",
        });
      });

      it.skip("charge:confirmed creates minting", async function () {
        const user = await User.create();
        await CoinbaseCharge.create(user);
        const event = coinbase.confirmed(user);
        await request(app)
          .post("/pay/coinbase/webhook")
          .send(event);

        const charge = await knex("mintings").first();
        expect(charge.state).to.include({
          aws_user_id: user.aws_user_id,
          coinbase_charge_id: charge.id,
          mint_amount: 1,
        });
      });
    });
  });

});
