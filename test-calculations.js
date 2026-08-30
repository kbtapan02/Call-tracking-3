// tests/test-calculations.js
// Plain Node.js tests for Lineboard's stat calculations — no framework required.
// Run with: node tests/test-calculations.js

const assert = require("assert");

// --- Calculation helpers (mirrors the logic in script.js) ---

function countByStatus(calls, status) {
  return calls.filter(c => c.status === status).length;
}

function totalMinutes(calls) {
  return calls.reduce((sum, c) => sum + (c.duration || 0), 0);
}

function formatDuration(minutes) {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return `${hours}h ${remainder}m`;
  }
  return `${minutes}m`;
}

function filterCalls(calls, filter) {
  if (filter === "all") return calls;
  return calls.filter(c => c.status === filter);
}

// --- Fixtures ---

const sampleCalls = [
  { name: "Priya Shah", status: "connected", duration: 12 },
  { name: "Marcus Lee", status: "missed", duration: 0 },
  { name: "Dana Whitfield", status: "voicemail", duration: 0 },
  { name: "Omar Haddad", status: "connected", duration: 23 },
  { name: "Yui Tanaka", status: "connected", duration: 6 },
];

// --- Tests ---

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log("Lineboard — calculation tests\n");

test("counts connected calls correctly", () => {
  assert.strictEqual(countByStatus(sampleCalls, "connected"), 3);
});

test("counts missed calls correctly", () => {
  assert.strictEqual(countByStatus(sampleCalls, "missed"), 1);
});

test("counts voicemail calls correctly", () => {
  assert.strictEqual(countByStatus(sampleCalls, "voicemail"), 1);
});

test("returns 0 for a status with no matches", () => {
  assert.strictEqual(countByStatus([], "connected"), 0);
});

test("sums total minutes across all calls", () => {
  assert.strictEqual(totalMinutes(sampleCalls), 41);
});

test("total minutes is 0 for an empty call list", () => {
  assert.strictEqual(totalMinutes([]), 0);
});

test("treats missing duration as 0 minutes", () => {
  const calls = [{ status: "connected" }, { status: "connected", duration: 5 }];
  assert.strictEqual(totalMinutes(calls), 5);
});

test("formats duration under 60 minutes as Xm", () => {
  assert.strictEqual(formatDuration(41), "41m");
});

test("formats duration of exactly 60 minutes as 1h 0m", () => {
  assert.strictEqual(formatDuration(60), "1h 0m");
});

test("formats duration over 60 minutes as Xh Ym", () => {
  assert.strictEqual(formatDuration(125), "2h 5m");
});

test("filterCalls('all') returns every call", () => {
  assert.strictEqual(filterCalls(sampleCalls, "all").length, 5);
});

test("filterCalls('missed') returns only missed calls", () => {
  const result = filterCalls(sampleCalls, "missed");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].name, "Marcus Lee");
});

test("filterCalls returns an empty array when nothing matches", () => {
  assert.strictEqual(filterCalls([], "connected").length, 0);
});

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
