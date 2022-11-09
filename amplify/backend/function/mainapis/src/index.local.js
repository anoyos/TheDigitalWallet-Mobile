const logger = require("./logger");
const createApp = require("./app");

const app = createApp();
app.listen(3000, function () {
  logger.debug({
    type: "http",
    message: `HTTP server started`,
    address: this.address(),
  });
});
