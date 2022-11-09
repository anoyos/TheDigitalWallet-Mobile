/* global describe, it */
/* eslint-disable prefer-arrow-callback, max-nested-callbacks */
const {
  chai: { expect, request },
  app,
  login,
  knex,
  factories: {
    User,
  }
} = require("./test_helper");
const timeout = require("../lib/timeout");

const future = (minutes = 15) => new Date(new Date().getTime() + (minutes * 60000));
const ago = (minutes = 15) => future(-minutes);

describe("Timeout", function() {
  describe("checkTimeout", function () {
    it("updates last_activity_at", async function() {
      const lastActivityTime = ago(5);
      const user = await User.create();
      await knex("sessions").insert({
        aws_user_id: user.aws_user_id,
        last_activity_at: lastActivityTime
      });

      login(user);
      const response = await request(app).get("/pay/sources");

      expect(response).to.have.status(200);

      const updatedUser = await knex("sessions")
        .where({ aws_user_id: user.aws_user_id  })
        .first();
      const now = new Date();
      // getTime() returns miliseconds * 1000 = seconds, then why closeTo 10000?
      // test itself takes around 150ms ...
      expect(updatedUser.last_activity_at.getTime() / 1000).to.be.closeTo(now.getTime() / 1000, 30000, `${now} close to ${updatedUser.last_activity_at}`);
    });

    it("doesnt update activity when timeouted", async function() {
      const lastActivityTime = ago(20);
      const user = await User.create();
      await knex("sessions").insert({
        aws_user_id: user.aws_user_id,
        last_activity_at: lastActivityTime
      });
      login(user);

      await request(app).get("/pay/sources");

      const updatedUser = await knex("sessions")
        .where({ aws_user_id: user.aws_user_id  })
        .first();
      expect(updatedUser.last_activity_at.getTime()).to.be.closeTo(lastActivityTime.getTime(), 1000);
    });

    it("returns 200 for except paths", async function() {
      const lastActivityTime = ago(20);
      const user = await User.create();
      await knex("sessions").insert({
        aws_user_id: user.aws_user_id,
        last_activity_at: lastActivityTime
      });
      login(user);

      const response = await request(app).get("/user");

      expect(response).to.have.status(200);
    });
  });
});

