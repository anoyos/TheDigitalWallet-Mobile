const AWS = require("aws-sdk");
const logger = require("./logger")
const config = require("../config")

class Eth {
  constructor() {
    this.minting = new AWS.Lambda({ region: 'us-east-1' });
  }

  async mint({ aws_user_id, charge_id, to, amount, contract_address }) {
    const response = await this.minting.invoke({
      FunctionName: config.eth.mintingLambdaArn,
      InvocationType: "Event",
      Payload: JSON.stringify({ aws_user_id, charge_id, to, amount, contract_address }),
    }).promise();
    logger.info({ type: "eth", message: `Minted ${amount} tokens to ${to} using contract ${contract_address}`, response: response.StatusCode, success: response.StatusCode === 202 });
  }
}

const mockEth = {
  mint(args) {
    logger.debug({ type: "mint", message: `Minting ${args.amount} tokens to ${args.to}`, args });
    return Promise.resolve();
  }
};

module.exports = process.env.NODE_ENV === "test" ? mockEth : new Eth() // eslint-disable-line no-process-env, no-empty-function

