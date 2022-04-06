const { expect } = require("chai");
const { cyan } = require("chalk");
const {
  db,
  models: { User, Transaction },
} = require("../src/db");

const _app = require("../src/app");
const app = require("supertest")(_app);

beforeEach(async () => {
  await db.sync({ force: true });
  const _users = await Promise.all([
    User.create({
      payer: "DANNON",
      points: 10000,
    }),
    User.create({
      payer: "COMMANDERS PALACE",
      points: 0,
    }),
  ]);
  const _transactions = await Promise.all([
    Transaction.create({
      payer: "DANNON",
      points: 10000,
      type: "pay",
      timestamp: "2022-02-31 09:00:00-05",
    }),
    Transaction.create({
      points: 5000,
      type: "spend",
    }),
  ]);
});

describe("GET", () => {
  it("responds with all users", async () => {
    const response = await app.get("/api/users");
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    const payer = response.body.map((user) => user.payer);
    expect(payer).to.include("DANNON");
  });

  describe("GET /api/transactions", () => {
    it("responds with all transactions", async () => {
      const response = await app.get("/api/transactions");
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      const points = response.body.map((user) => user.points);
      expect(points).to.include(10000);
    });

    describe("POST /api/transactions/pay", () => {
      it("responds with the newly created transaction", async () => {
        const response = await app
          .post("/api/transactions/pay")
          .send({ payer: "DANNON", points: 3005, type: "pay" });
        expect(response.body).to.be.an("object");
        expect(response.body.points).to.equal(3005);
        const transactionAfterPost = await Transaction.findAll();
        expect(transactionAfterPost).to.include({ points: np3005 });
      });

      it('responds with "Wrong type of transaction" if type is not pay', async () => {
        const response = await app
          .post("/api/transactions/pay")
          .send({ payer: "DANNON", points: 3005, type: "spend" });
        expect(response.status).to.equal(409);
        expect(response.body).to.include("Wrong type of transaction");
      });
    });

    describe("POST /api/transactions/spend", () => {
      it("responds with payers and points", async () => {
        const response = await app
          .post("/api/transactions/spend")
          .send({ points: 250, type: "spend" });
        expect(response.body).to.be.an("object");
        expect(response.body).to.include("payer");
      });

      it('responds with "Wrong type of transaction" if type is not spend', async () => {
        const response = await app
          .post("/api/transactions/spend")
          .send({ payer: "DANNON", points: 3005, type: "pay" });
        expect(response.body).to.be("string");
      });
    });
  });
});
