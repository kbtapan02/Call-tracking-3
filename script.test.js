/**
 * Automated tests for the pure logic in script.js.
 * Runs on Node's built-in test runner — no external dependencies required.
 *
 * Usage: node --test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  validateCall,
  loadCallData,
  searchCalls,
  filterByDirection,
  filterByOutcome,
  applyFilters,
  getDefaultFilters,
  calculateTotalCalls,
  calculateIncomingCalls,
  calculateOutgoingCalls,
  calculateAnsweredCalls,
  calculateMissedCalls,
  calculateTotalDuration,
  calculateDashboardStats,
  formatDuration,
  formatTotalDuration,
  formatDateTime,
  formatOutcomeLabel,
  formatDirectionLabel
} from "../script.js";

const validCall = {
  name: "Test Caller",
  phone: "+1 555-000-1111",
  datetime: "2026-08-31T09:00",
  duration: 120,
  direction: "incoming",
  outcome: "answered"
};

describe("validateCall", () => {
  test("accepts a well-formed call", () => {
    assert.equal(validateCall(validCall), true);
  });

  test("rejects null and non-object input", () => {
    assert.equal(validateCall(null), false);
    assert.equal(validateCall(undefined), false);
    assert.equal(validateCall("not a call"), false);
  });

  test("rejects a missing or empty name", () => {
    assert.equal(validateCall({ ...validCall, name: "" }), false);
    assert.equal(validateCall({ ...validCall, name: undefined }), false);
  });

  test("rejects an invalid datetime", () => {
    assert.equal(validateCall({ ...validCall, datetime: "not-a-date" }), false);
  });

  test("rejects a negative or non-numeric duration", () => {
    assert.equal(validateCall({ ...validCall, duration: -5 }), false);
    assert.equal(validateCall({ ...validCall, duration: "120" }), false);
  });

  test("rejects an invalid direction or outcome", () => {
    assert.equal(validateCall({ ...validCall, direction: "sideways" }), false);
    assert.equal(validateCall({ ...validCall, outcome: "ringing" }), false);
  });
});

describe("loadCallData", () => {
  test("returns the built-in sample data when no source is given", () => {
    const { calls, errors } = loadCallData();
    assert.ok(Array.isArray(calls));
    assert.ok(calls.length > 0);
    assert.ok(calls.every(validateCall));
    assert.ok(Array.isArray(errors));
  });

  test("filters out invalid records and reports errors for each", () => {
    const source = [validCall, { name: "" }, null, { ...validCall, duration: -1 }];
    const { calls, errors } = loadCallData(source);
    assert.equal(calls.length, 1);
    assert.equal(errors.length, 3);
  });

  test("returns an empty result with an error when source is not an array", () => {
    const { calls, errors } = loadCallData("not an array");
    assert.deepEqual(calls, []);
    assert.equal(errors.length, 1);
  });

  test("returns an empty array (no throw) for an empty source array", () => {
    const { calls, errors } = loadCallData([]);
    assert.deepEqual(calls, []);
    assert.deepEqual(errors, []);
  });
});

describe("searchCalls", () => {
  const calls = [
    { name: "Amelia Chen", phone: "+1 415-555-0132" },
    { name: "Rahim Uddin", phone: "+880 1712-345678" }
  ];

  test("matches by name, case-insensitively", () => {
    assert.equal(searchCalls(calls, "amelia").length, 1);
  });

  test("matches by phone number substring", () => {
    assert.equal(searchCalls(calls, "1712").length, 1);
  });

  test("returns everything when the query is empty or whitespace", () => {
    assert.equal(searchCalls(calls, "").length, 2);
    assert.equal(searchCalls(calls, "   ").length, 2);
  });

  test("returns an empty array for non-array input", () => {
    assert.deepEqual(searchCalls(null, "amelia"), []);
  });
});

describe("filterByDirection / filterByOutcome", () => {
  const calls = [
    { direction: "incoming", outcome: "answered" },
    { direction: "outgoing", outcome: "missed" }
  ];

  test("filterByDirection narrows to the matching direction", () => {
    assert.equal(filterByDirection(calls, "incoming").length, 1);
  });

  test("filterByDirection returns all records for 'all'", () => {
    assert.equal(filterByDirection(calls, "all").length, 2);
  });

  test("filterByOutcome narrows to the matching outcome", () => {
    assert.equal(filterByOutcome(calls, "missed").length, 1);
  });

  test("both return an empty array for non-array input", () => {
    assert.deepEqual(filterByDirection(undefined, "incoming"), []);
    assert.deepEqual(filterByOutcome(undefined, "missed"), []);
  });
});

describe("applyFilters / getDefaultFilters", () => {
  const calls = [
    { name: "Amelia Chen", phone: "+1 415-555-0132", direction: "incoming", outcome: "answered" },
    { name: "Rahim Uddin", phone: "+880 1712-345678", direction: "incoming", outcome: "missed" },
    { name: "Priya Sharma", phone: "+91 98200-11223", direction: "outgoing", outcome: "answered" }
  ];

  test("combines search, direction, and outcome", () => {
    const result = applyFilters(calls, { query: "a", direction: "incoming", outcome: "answered" });
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "Amelia Chen");
  });

  test("getDefaultFilters returns an all-inclusive filter state", () => {
    const defaults = getDefaultFilters();
    assert.deepEqual(applyFilters(calls, defaults), calls);
  });
});

describe("dashboard calculations", () => {
  const calls = [
    { direction: "incoming", outcome: "answered", duration: 100 },
    { direction: "incoming", outcome: "missed", duration: 0 },
    { direction: "outgoing", outcome: "answered", duration: 50 }
  ];

  test("calculateTotalCalls counts every record", () => {
    assert.equal(calculateTotalCalls(calls), 3);
  });

  test("calculateIncomingCalls / calculateOutgoingCalls split by direction", () => {
    assert.equal(calculateIncomingCalls(calls), 2);
    assert.equal(calculateOutgoingCalls(calls), 1);
  });

  test("calculateAnsweredCalls / calculateMissedCalls split by outcome", () => {
    assert.equal(calculateAnsweredCalls(calls), 2);
    assert.equal(calculateMissedCalls(calls), 1);
  });

  test("calculateTotalDuration sums valid durations only", () => {
    const withBadDuration = [...calls, { duration: -10 }, { duration: "oops" }];
    assert.equal(calculateTotalDuration(withBadDuration), 150);
  });

  test("all calculations return 0 for empty or invalid input", () => {
    assert.equal(calculateTotalCalls([]), 0);
    assert.equal(calculateTotalDuration(null), 0);
    assert.equal(calculateIncomingCalls(undefined), 0);
  });

  test("calculateDashboardStats returns every statistic together", () => {
    const stats = calculateDashboardStats(calls);
    assert.deepEqual(stats, {
      total: 3,
      incoming: 2,
      outgoing: 1,
      answered: 2,
      missed: 1,
      totalDurationSeconds: 150
    });
  });
});

describe("formatting helpers", () => {
  test("formatDuration formats seconds as minutes and seconds", () => {
    assert.equal(formatDuration(125), "2m 05s");
  });

  test("formatDuration returns an em dash for zero or invalid values", () => {
    assert.equal(formatDuration(0), "—");
    assert.equal(formatDuration(-5), "—");
    assert.equal(formatDuration(NaN), "—");
  });

  test("formatTotalDuration includes hours only when there are any", () => {
    assert.equal(formatTotalDuration(45 * 60), "45m");
    assert.equal(formatTotalDuration(90 * 60), "1h 30m");
  });

  test("formatTotalDuration falls back to '0m' for invalid input", () => {
    assert.equal(formatTotalDuration(-1), "0m");
    assert.equal(formatTotalDuration(undefined), "0m");
  });

  test("formatDateTime falls back to the raw string for an invalid date", () => {
    assert.equal(formatDateTime("not-a-date"), "not-a-date");
  });

  test("formatOutcomeLabel and formatDirectionLabel map known codes", () => {
    assert.equal(formatOutcomeLabel("voicemail"), "Voicemail");
    assert.equal(formatDirectionLabel("outgoing"), "Outgoing");
  });

  test("formatOutcomeLabel and formatDirectionLabel handle unknown codes safely", () => {
    assert.equal(formatOutcomeLabel("mystery"), "Mystery");
    assert.equal(formatDirectionLabel("sideways"), "Unknown");
  });
});
