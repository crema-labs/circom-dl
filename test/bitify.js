const { assert, log } = require("console");
const path = require("path");

const Scalar = require("ffjavascript").Scalar;
const wasm_tester = require("circom_tester").wasm;

async function testNum2BitsDL(input, circuit) {
  let real_result = [];
  let inp_clone = input;
  for (var i = 0; i < 5; i++) {
    real_result.push(inp_clone % 2n);
    inp_clone = (inp_clone - (inp_clone % 2n)) / 2n;
  }

  const w = await circuit.calculateWitness({ in: input }, true);

  let circuit_result = w.slice(1, 1 + 5);

  for (var i = 0; i < 5; i++) {
    assert(circuit_result[i] == real_result[i], `n2b`);
  }
}

async function testBits2NumDL(input, circuit) {
  let real_result = 0n;
  for (var i = 0; i < 5; i++) {
    real_result += 2n ** BigInt(i) * input[i];
  }
  real_result = [real_result];

  const w = await circuit.calculateWitness({ in: input }, true);

  let circuit_result = w.slice(1, 1 + 1);

  for (var i = 0; i < 1; i++) {
    assert(circuit_result[i] == real_result[i], `b2n`);
  }
}

describe("Num2BitsDL test", function () {
  this.timeout(100000);
  let circuit;

  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "bitify", "num2bits.circom")
    );
  });

  it("0", async function () {
    await testNum2BitsDL(0n, circuit);
  });

  it("1", async function () {
    await testNum2BitsDL(1n, circuit);
  });

  it("13", async function () {
    await testNum2BitsDL(13n, circuit);
  });

  it("31", async function () {
    await testNum2BitsDL(31n, circuit);
  });
});

describe("Bits2NumDL test", function () {
  this.timeout(100000);
  let circuit;

  before(async () => {
    circuit = await wasm_tester(
      path.join(__dirname, "circuits", "bitify", "bits2num.circom")
    );
  });

  it("[0,0,0,0,0]", async function () {
    await testBits2NumDL([0n, 0n, 0n, 0n, 0n], circuit);
  });

  it("[1,0,0,0,0]", async function () {
    await testBits2NumDL([1n, 0n, 0n, 0n, 0n], circuit);
  });

  it("[1,0,1,1,0]", async function () {
    await testBits2NumDL([1n, 0n, 1n, 1n, 0n], circuit);
  });

  it("[1,1,1,1,1]", async function () {
    await testBits2NumDL([1n, 1n, 1n, 1n, 1n], circuit);
  });
});
