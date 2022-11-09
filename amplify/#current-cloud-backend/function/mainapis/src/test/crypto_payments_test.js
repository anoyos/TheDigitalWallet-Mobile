const {
  chai: { expect, request },
  app,
  login,
  factories: {
    User,
  }
} = require("./test_helper");

describe("/pay/crypto", function () {
  it("creates crypto charge", async function () {
    const user = await User.create();
    login(user);
    const response = await request(app)
      .post("/pay/crypto")
      .send({
        amount: "1",
        currency: "USD",
      });
    expect(response).to.have.status(200);
    expect(response.body).to.nested.include({
        "charge.aws_user_id": user.aws_user_id,
        "charge.amount": "1",
        "charge.bal_amount": 10000,
    });
  });
});

