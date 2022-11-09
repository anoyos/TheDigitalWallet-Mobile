const knex = require("../../lib/db");
const coinbase = require("./coinbase");

let userIdCounter = 0;

function uuid() {
  const r = (new Date()).getTime()
    .toString(16) + Math.random().toString(16)
    .substring(2) + "0".repeat(16);
  const guid = `${r.substr(0, 8)}-${r.substr(8, 4)}-4000-8${r.substr(12, 3)}-${r.substr(15, 12)}`;
  return guid;
}

function referralCode() {
  return Math.random().toString(36).slice(-6).toUpperCase();
}

const User = {
  users: [],
  build({ used_referral_code = null } = {}) {
    userIdCounter++;
    const params = {
      aws_user_id: uuid(),
      email: `user${userIdCounter}@example.com`,
      given_name: "Anon",
      family_name: "Pečlivý",
      stripe_customer_id: "mock_created_customer",
      available_referrals: "0",
      encrypted_key: "d3a13615d5aac49f47526cb89408d23ae758ef489403c69b21cac1efad2b08df767fedad77a2210e0bb069dd527208f8d6955d371edaf46aee9135f796d3b8dc631b2768494aaa0bdca93dbaa3885a",
      wallet_address: "0x0000000000000000000000000000000000000000",
      referral_code: "XXXXX",
      jwtToken: "no-token",
      claims: [],
    };
    if (used_referral_code) params.used_referral_code = used_referral_code;
    return params;
  },
  async create({ referral_code = null, ...args } = {}) {
    // eslint-disable-next-line no-unused-vars
    const { used_referral_code, ...params } = User.build(args);
    const exchange_contract = await knex("exchange_contracts").first();
    if (!exchange_contract) await knex("exchange_contracts").insert({ symbol: "USD", address: "0x0000000000000000000000000000000000000000" });
    params.referral_code = referral_code || referralCode();
    User.users.push(params);
    return params;
  }
};

let businessIdCounter = 0;
const Business = {
  build({ aws_user_id }, { name, description } = {}) {
    businessIdCounter++;
    return {
      aws_user_id,
      name: name || `Test Business ${businessIdCounter}`,
      description: description || `Testing business description ${businessIdCounter}`,
      latitude: Math.round(Math.random() * 100) - 0.5,
      longitude: Math.round(Math.random() * 100) - 0.5,
      category_id: 2,
    };
  },
  async create(...args) {
    const params = Business.build(...args);
    const lastId = await knex("businesses").insert(params, "id");
    params.id = lastId[0];
    return params;
  }
};

let promotionIdCounter = 0;
const Promotion = {
  build(business, { name, type, description, active = true, required_spent_amount, image_url, amount_original, amount_facevalue, amount_discount, use_count_remaining, expire_at, sku } = {}) {
    promotionIdCounter++;
    return {
      business_id: business.id,
      name: name || `Test promotion #${promotionIdCounter}`,
      description: description || `test promotion description ${promotionIdCounter}`,
      image_url: image_url || "https://picsum.photos/300/200/?random",
      amount_original: amount_original || Math.floor(Math.random() * 100),
      amount_discount: amount_discount || 0,
      amount_facevalue: amount_facevalue || 0,
      use_count_remaining: use_count_remaining || -1,
      type: type || "offer",
      required_spent_amount: required_spent_amount || 0,
      expire_at,
      active,
      sku,
    };
  },
  async create(...args) {
    const params = Promotion.build(...args);
    const lastId = await knex("promotions").insert(params, "id");
    params.id = lastId[0];
    return params;
  }
};

const Redemption = {
  build(promotion, user, { referral_code = null, transaction_id = null } = {}) {
    promotionIdCounter++;
    return {
      promotion_id: promotion.id,
      aws_user_id: user.aws_user_id,
      referral_code,
      transaction_id,
    };
  },
  async create(...args) {
    const params = Redemption.build(...args);
    const lastId = await knex("redemptions").insert(params, "id");
    params.id = lastId[0];
    return params;
  }
};

const Charge = {
  build(user, { amount = 1, bal_amount } = {}) {
    return {
      aws_user_id: user.aws_user_id,
      charge_id: "ch_charge_test",
      amount,
      bal_amount: bal_amount || amount * 100,
      currency: "USD",
      success: false,
      event_id: null,
      event_created: null,
    };
  },

  async create(...args) {
    const params = Charge.build(...args);
    const lastId = await knex("charges").insert(params, "id");
    params.id = lastId[0];
    return params;
  }
};

const CoinbaseCharge = {
  build(user) {
    return {
      aws_user_id: user.aws_user_id,
      code: "YK7PWYN4",
      name: "Test Charge",
      description: "Test",
      amount: 1,
      currency: "USD",
      json_response: JSON.stringify(coinbase.created(user)),
    };
  },
  async create(...args) {
    const params = CoinbaseCharge.build(...args);
    const lastId = await knex("coinbase_charges").insert(params, "id");
    params.id = lastId[0];
    return params;
  }
};

const Notification = {
  build({ aws_user_id, message, read = false }) {
    return {
      aws_user_id,
      message,
      read,
    };
  },
  async create(...args) {
    const params = Notification.build(...args);
    const lastId = await knex("notifications").insert(params, "id");
    params.id = lastId[0];
    return params;
  }
};

module.exports = {
  User,
  Business,
  Promotion,
  Redemption,
  Charge,
  CoinbaseCharge,
  Notification
};
