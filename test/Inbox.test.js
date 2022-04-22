// contract test code will go here
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

// class Car {
//   park() {
//     return "stopped";
//   }
//   drive() {
//     return "broom";
//   }
// }

// let car;

// beforeEach(() => {
//   car = new Car();
// });

// describe("Car can", () => {
//   it("it can park", () => {
//     assert.equal(car.park(), "stopped");
//   });
//   it("it can drive", () => {
//     assert.equal(car.drive(), "broom");
//   });
// });

let accounts;
let inbox;
const inicialMessage = "Hi bro!";

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [inicialMessage] })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("have a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, inicialMessage);
  });

  it("can change the message", async () => {
    await inbox.methods.setMessage("Bye!").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "Bye!");
  });
});
