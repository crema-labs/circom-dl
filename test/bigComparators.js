const { assert } = require("console");
const path = require("path");

const Scalar = require("ffjavascript").Scalar;
const wasm_tester = require("circom_tester").wasm;

function bigintToArray(n, k, x) {
  let mod = BigInt(1);
  for (let idx = 0; idx < n; idx++) {
    mod *= BigInt(2);
  }

  const ret = [];
  let xTemp = x;
  for (let idx = 0; idx < k; idx++) {
    ret.push(xTemp % mod);
    xTemp /= mod;
  }

  return ret;
}

async function testIsEqualDL(input1, input2, circuit) {
  let input = [bigintToArray(64, 4, input1), bigintToArray(64, 4, input2)];

  let real_result = 1n;

  if (input1 != input2) {
    real_result = 0n;
  }

  const w = await circuit.calculateWitness({ in: input }, true);

  let circuit_result = w[1];
  assert(circuit_result == real_result, `${input1} == ${input2}`);
}

async function testLessThanDL(input1, input2, circuit) {
  let input = [bigintToArray(64, 4, input1), bigintToArray(64, 4, input2)];

  let real_result = 1n;

  if (input1 >= input2) {
    real_result = 0n;
  }

  const w = await circuit.calculateWitness({ in: input }, true);

  let circuit_result = w[1];
  assert(circuit_result == real_result, `${input1} < ${input2}`);
}

async function testLessEqThanDL(input1, input2, circuit) {
  let input = [bigintToArray(64, 4, input1), bigintToArray(64, 4, input2)];

  let real_result = 1n;

  if (input1 > input2) {
    real_result = 0n;
  }

  const w = await circuit.calculateWitness({ in: input }, true);

  let circuit_result = w[1];
  assert(circuit_result == real_result, `${input1} <= ${input2}`);
}

async function testGreaterThanDL(input1, input2, circuit) {
  let input = [bigintToArray(64, 4, input1), bigintToArray(64, 4, input2)];

  let real_result = 1n;

  if (input1 <= input2) {
    real_result = 0n;
  }

  const w = await circuit.calculateWitness({ in: input }, true);

  let circuit_result = w[1];
  assert(circuit_result == real_result, `${input1} > ${input2}`);
}

async function testGreaterEqThanDL(input1, input2, circuit) {
  let input = [bigintToArray(64, 4, input1), bigintToArray(64, 4, input2)];

  let real_result = 1n;

  if (input1 < input2) {
    real_result = 0n;
  }

  const w = await circuit.calculateWitness({ in: input }, true);

  let circuit_result = w[1];
  assert(circuit_result == real_result, `${input1} >= ${input2}`);
}

describe("Comparators tests", function () {
  this.timeout(100000);
  let circuitEqual;
  let circuitLessThanDL;
  let circuitLessEqThanDL;
  let circuitGreaterThanDL;
  let circuitGreaterEqThanDL;

  before(async () => {
    circuitEqual = await wasm_tester(
      path.join(__dirname, "circuits", "bigInt", "bigIsEqual.circom")
    );
    circuitLessThanDL = await wasm_tester(
      path.join(__dirname, "circuits", "bigInt", "bigLessThan.circom")
    );
    circuitLessEqThanDL = await wasm_tester(
      path.join(__dirname, "circuits", "bigInt", "bigLessEqThan.circom")
    );
    circuitGreaterThanDL = await wasm_tester(
      path.join(__dirname, "circuits", "bigInt", "bigGreaterThan.circom")
    );
    circuitGreaterEqThanDL = await wasm_tester(
      path.join(__dirname, "circuits", "bigInt", "bigGreaterEqThan.circom")
    );
  });

  it("GreaterEqThanDL", async function () {
    await testIsEqualDL(15n, 15n, circuitEqual);
  });

  it("15 === 16", async function () {
    await testIsEqualDL(15n, 16n, circuitEqual);
  });

  it("109730872847609188478309451572148122150330802072000585050763249942403213063436 === 109730872847609188478309451572148122150330802072000585050763249942403213063436", async function () {
    await testIsEqualDL(
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      circuitEqual
    );
  });

  it("15 === 109730872847609188478309451572148122150330802072000585050763249942403213063436", async function () {
    await testIsEqualDL(
      15n,
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      circuitEqual
    );
  });

  it("ff...ff (256 bit) === ff...ff (256 bit)", async function () {
    await testIsEqualDL(
      115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      circuitEqual
    );
  });

  it("15 < 15", async function () {
    await testLessThanDL(15n, 15n, circuitLessThanDL);
  });

  it("15 < 16", async function () {
    await testLessThanDL(15n, 16n, circuitLessThanDL);
  });

  it("109730872847609188478309451572148122150330802072000585050763249942403213063436 < 109730872847609188478309451572148122150330802072000585050763249942403213063436", async function () {
    await testLessThanDL(
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      circuitLessThanDL
    );
  });

  it("109730872847609188478309451572148122150330802072000585050763249942403213063436 < 15", async function () {
    await testLessThanDL(
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      15n,
      circuitLessThanDL
    );
  });

  it("ff...fe (256 bit) < ff...ff (256 bit)", async function () {
    await testLessThanDL(
      115792089237316195423570985008687907853269984665640564039457584007913129639934n,
      115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      circuitLessThanDL
    );
  });

  it("15 <= 15", async function () {
    await testLessEqThanDL(15n, 15n, circuitLessEqThanDL);
  });

  it("15 <= 16", async function () {
    await testLessEqThanDL(15n, 16n, circuitLessEqThanDL);
  });

  it("109730872847609188478309451572148122150330802072000585050763249942403213063436 <= 109730872847609188478309451572148122150330802072000585050763249942403213063436", async function () {
    await testLessEqThanDL(
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      circuitLessEqThanDL
    );
  });

  it("109730872847609188478309451572148122150330802072000585050763249942403213063436 <= 15", async function () {
    await testLessEqThanDL(
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      15n,
      circuitLessEqThanDL
    );
  });

  it("ff...fe (256 bit) <= ff...ff (256 bit)", async function () {
    await testLessEqThanDL(
      115792089237316195423570985008687907853269984665640564039457584007913129639934n,
      115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      circuitLessEqThanDL
    );
  });

  it("15 > 15", async function () {
    await testGreaterThanDL(15n, 15n, circuitGreaterThanDL);
  });

  it("15 > 16", async function () {
    await testGreaterThanDL(15n, 16n, circuitGreaterThanDL);
  });

  it("109730872847609188478309451572148122150330802072000585050763249942403213063436 > 109730872847609188478309451572148122150330802072000585050763249942403213063436", async function () {
    await testGreaterThanDL(
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      circuitGreaterThanDL
    );
  });

  it("109730872847609188478309451572148122150330802072000585050763249942403213063436 > 15", async function () {
    await testGreaterThanDL(
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      15n,
      circuitGreaterThanDL
    );
  });

  it("ff...fe (256 bit) > ff...ff (256 bit)", async function () {
    await testGreaterThanDL(
      115792089237316195423570985008687907853269984665640564039457584007913129639934n,
      115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      circuitGreaterThanDL
    );
  });

  it("15 >= 15", async function () {
    await testGreaterEqThanDL(15n, 15n, circuitGreaterEqThanDL);
  });

  it("15 >= 16", async function () {
    await testGreaterEqThanDL(15n, 16n, circuitGreaterEqThanDL);
  });

  it("109730872847609188478309451572148122150330802072000585050763249942403213063436 >= 109730872847609188478309451572148122150330802072000585050763249942403213063436", async function () {
    await testGreaterEqThanDL(
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      circuitGreaterEqThanDL
    );
  });

  it("109730872847609188478309451572148122150330802072000585050763249942403213063436 >= 15", async function () {
    await testGreaterEqThanDL(
      109730872847609188478309451572148122150330802072000585050763249942403213063436n,
      15n,
      circuitGreaterEqThanDL
    );
  });

  it("ff...fe (256 bit) >= ff...ff (256 bit)", async function () {
    await testGreaterEqThanDL(
      115792089237316195423570985008687907853269984665640564039457584007913129639934n,
      115792089237316195423570985008687907853269984665640564039457584007913129639935n,
      circuitGreaterEqThanDL
    );
  });
});
