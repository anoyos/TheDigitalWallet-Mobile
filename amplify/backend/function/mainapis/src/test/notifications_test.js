const {
  chai: { expect, request },
  knex,
  app,
  login,
  factories: {
    User,
    Business,
    Notification,
  }
} = require("./test_helper");

describe("Notifications", function() {
  //describe("POST /notifications", function() {
  //  it("creates notification", async function() {
  //    const user = await User.create();
  //    const response = await request(app)
  //      .post("/notifications")
  //      .send({
  //        aws_user_id: user.aws_user_id,
  //        message: "test message",
  //        payload: JSON.stringify({ type: "exchange" }),
  //      });
  //    expect(response).to.have.status(200);

  //    const dbntf = await knex("notifications").first();
  //    expect(dbntf).to.include({
  //      aws_user_id: user.aws_user_id,
  //      message: "test message",
  //      payload: JSON.stringify({ type: "exchange" }),
  //    });
  //  });

  //  it("creates notification", async function() {
  //    const user = await User.create();
  //    login(user);
  //    const response = await request(app)
  //      .post("/notifications")
  //      .send({
  //        aws_user_id: user.aws_user_id,
  //        message: "test message",
  //        payload: JSON.stringify({ type: "exchange" }),
  //      });
  //    expect(response).to.have.status(403);
  //  });
  //});

  describe("GET /notifications/user", function() {
    it("returns notifications for user", async function() {
      const user = await User.create();
      login(user);

      await Notification.create({ aws_user_id: user.aws_user_id, message: "test message" });
      const response = await request(app).get("/notifications/user");
      expect(response).to.have.status(200);

      expect(response.body).to.have.lengthOf(1);
      expect(response.body[0]).to.include({ aws_user_id: user.aws_user_id, message: "test message" });
    });

    it("returns only unread", async function() {
      const user = await User.create();
      login(user);

      await Notification.create({ aws_user_id: user.aws_user_id, message: "test message" });
      await Notification.create({ aws_user_id: user.aws_user_id, message: "read message", read: true });
      const response = await request(app).get("/notifications/user");
      expect(response).to.have.status(200);

      expect(response.body).to.have.lengthOf(1);
    });
  });

  describe("PATCH /notifications/user", function() {
    it("set read status on notification", async function() {
      const user = await User.create();
      login(user);

      const createdNotif = await Notification.create({ aws_user_id: user.aws_user_id, message: "test message" });
      const response = await request(app)
        .patch(`/notifications/${createdNotif.id}`)
        .send({ read: true });
      expect(response).to.have.status(200);

      const notification = await knex("notifications").first();
      expect(notification).to.include({ read: 1 });
    });
  });
});
