const { expect } = require("chai");
const { cyan } = require("chalk");
const {
  db,
  models: { User, Transaction },
} = require("../src/db");

const _app = require("../src/app");
const app = require("supertest")(_app);

describe("POST /api/transaction/pay", () => {
  it("responds with the newly created transaction", async () => {
    const response = await app
      .post("/api/transaction/pay")
      .send({ payer: "DANNON", points: 3005, type: "pay" });
    expect(response.body).to.be.an("object");
    console.log(response.body.points);
    expect(response.body.points).to.equal(3005);
    const transactionAfterPost = (await Transaction.findAll()).map(
      (transaction) => transaction.points
    );
    expect(transactionAfterPost).to.include(
      3005,
      "Make sure transaction is being created"
    );
  });

  it('responds with "Wrong type of transaction" if type is not spend', async () => {
    const response = await app
      .post("/api/transaction/pay")
      .send({ payer: "DANNON", points: 3005, type: "spend" });
    expect(response.body).to.be.an("string");
    expect(response.body).to.equal("Wrong type of transaction");
  });
});
