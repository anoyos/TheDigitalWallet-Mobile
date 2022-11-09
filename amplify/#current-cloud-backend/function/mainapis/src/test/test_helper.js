/* eslint-disable prefer-arrow-callback, newline-per-chained-call */
/* global afterEach */
require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const createApp = require("../app");
const knex = require("../lib/db");
const createGatewayEvent = require("./support/gatewayApiEvent");
const factories = require("./factories");

chai.use(chaiHttp);

let loggedInUser = null;

const app = createApp(app => {
  app.use((req, res, next) => {
    if (loggedInUser) {
      const { method, path } = req;
      req.apiGateway = createGatewayEvent({ method, path, user: loggedInUser });
    }
    next();
  });
});

function login(user) {
  loggedInUser = user;
}

function logout() {
  loggedInUser = null;
}

function currentUser() {
  return loggedInUser;
}

function seq(n, cb = null) {
  const ary = Array(n).fill(0).map((_, i) => i);
  if (cb === null) return ary;
  return Promise.all(ary.map(i => Promise.resolve(cb(i))));
}

afterEach(logout);

afterEach(async () => {
  factories.User.users = [];
  await knex.transaction(async function(tx) {
    await knex.raw("SET FOREIGN_KEY_CHECKS=0").transacting(tx);
    await knex("notifications").truncate().transacting(tx);
    await knex("mintings").truncate().transacting(tx);
    await knex("charges").truncate().transacting(tx);
    await knex("coinbase_charges").truncate().transacting(tx);
    await knex("redemptions").truncate().transacting(tx);
    await knex("promotions").truncate().transacting(tx);
    await knex("businesses").truncate().transacting(tx);
    await knex("users").truncate().transacting(tx);
    await knex("sessions").truncate().transacting(tx);
    await knex.raw("SET FOREIGN_KEY_CHECKS=1").transacting(tx);
    await tx.commit();
  });
});

module.exports = {
  chai,
  knex,
  app,
  login,
  logout,
  currentUser,
  seq,
  factories,
};
