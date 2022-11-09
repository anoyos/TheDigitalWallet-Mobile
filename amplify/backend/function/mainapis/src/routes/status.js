const { Router } = require("express");

const router = Router();

router.use("/status", (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
