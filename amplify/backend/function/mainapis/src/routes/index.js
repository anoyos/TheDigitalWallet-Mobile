const { Router } = require("express");

const router = Router();

/**
 * GET /status
 */
router.use("/", require("./status"));

/**
 * GET   /user
 * POST  /user
 * PUT   /user
 * GET   /user/businesses
 */
router.use("/", require("./users"));

/**
 * GET   /gift-cards
 * POST  /gift-cards
 * POST  /gift-cards/accept
 */
router.use("/", require("./gift-cards"));

/**
 * GET /transactions/:user_id
 */
router.use("/", require("./transactions"));


/**
 * GET  /business
 */
router.use("/", require("./business"));

/**
 * GET /promotions
 * GET /promotions/:id
 * POST /promotions
 * PATCH /promotions/:id
 * POST /promotions/:id/redeem
 */
router.use("/", require("./promotions"));

/**
 * GET /presigned_link
 */
router.use("/", require("./upload"));

/**
 * POST /pay/key
 * POST /pay/stripe-webhook
 */
router.use("/", require("./payments"));

/**
 * POST /pay/coinbase/charge
 * POST /pay/coinbase/webhook
 */
router.use("/", require("./coinbase"));

/**
 * POST /pay/crypto
 */
router.use("/", require("./crypto_payments"));

/**
 * POST /notifications
 * GET /user/notifications
 * PUT /user/notifications
 */
router.use("/", require("./notifications"));

/**
 * GET /exchange
 */
router.use("/", require("./exchange"));

/**
 * GET /qr
 */
router.use("/", require("./qr"));

/**
 * GET /referrals/pending
 * GET /referrals/accepted
 * POST /referrals/create
 */
router.use("/", require("./referrals"));


module.exports = router;
