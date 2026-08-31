/**
 * Automated tests for the dashboard calculation functions in script.js.
 * Runs on Node's built-in test runner — no external dependencies required.
 *
 * These tests import the real functions used by the application (not
 * reimplementations of the logic), so they verify the actual calculation
 * code that powers the dashboard's summary cards.
 *
 * Usage: node --test
 * (or, from the project root: npm test)
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  calculateTotalCalls,
  calculateIncomingCalls,
  calculateOutgoingCalls,
  calculateAnsweredCalls,
  calculateMissedCalls,
  calculateTotalDuration,
  calculateDashboardStats
} from "../script.js";

// A realistic, mixed dataset: 3 incoming, 2 outgoing; 3 answered, 2 missed;
// durations chosen so the total is easy to hand-verify (100+0+50+0+30 = 180).
const mixedCalls = [
  { direction: "incoming", outcome: "answered", duration: 100 },
  { direction: "incoming", outcome: "missed", duration: 0 },
  { direction: "outgoing", outcome: "answered", duration: 50 },
  { direction: "outgoing", outcome: "missed", duration: 0 },
  { direction: "incoming", outcome: "answered", duration: 30 }
];

describe("calculateTotalCalls", () => {
  test("counts every record in a mixed dataset", () => {
    assert.equal(calculateTotalCalls(mixedCalls), 5);
  });

  test("returns 0 for an empty dataset", () => {
    assert.equal(calculateTotalCalls([]), 0);
  });

  test("returns 0 for invalid (non-array) input instead of throwing", () => {
    assert.equal(calculateTotalCalls(null), 0);
    assert.equal(calculateTotalCalls(undefined), 0);
    assert.equal(calculateTotalCalls("not an array"), 0);
  });
});

describe("calculateIncomingCalls", () => {
  test("counts only incoming records in a mixed dataset", () => {
    assert.equal(calculateIncomingCalls(mixedCalls), 3);
  });

  test("returns 0 when there are no incoming calls", () => {
    const allOutgoing = [
      { direction: "outgoing", outcome: "answered", duration: 10 },
      { direction: "outgoing", outcome: "missed", duration: 0 }
    ];
    assert.equal(calculateIncomingCalls(allOutgoing), 0);
  });

  test("returns 0 for an empty dataset", () => {
    assert.equal(calculateIncomingCalls([]), 0);
  });

  test("ignores records with a missing or invalid direction field", () => {
    const withMissingDirection = [
      { outcome: "answered", duration: 10 },       // no direction property
      { direction: "incoming", outcome: "answered", duration: 20 },
      { direction: "sideways", outcome: "answered", duration: 30 } // invalid value
    ];
    assert.equal(calculateIncomingCalls(withMissingDirection), 1);
  });

  test("returns 0 for invalid (non-array) input instead of throwing", () => {
    assert.equal(calculateIncomingCalls(null), 0);
  });
});

describe("calculateOutgoingCalls", () => {
  test("counts only outgoing records in a mixed dataset", () => {
    assert.equal(calculateOutgoingCalls(mixedCalls), 2);
  });

  test("returns 0 when there are no outgoing calls", () => {
    const allIncoming = [
      { direction: "incoming", outcome: "answered", duration: 10 },
      { direction: "incoming", outcome: "missed", duration: 0 }
    ];
    assert.equal(calculateOutgoingCalls(allIncoming), 0);
  });

  test("returns 0 for an empty dataset", () => {
    assert.equal(calculateOutgoingCalls([]), 0);
  });

  test("returns 0 for invalid (non-array) input instead of throwing", () => {
    assert.equal(calculateOutgoingCalls(undefined), 0);
  });
});

describe("calculateAnsweredCalls", () => {
  test("counts only answered records in a mixed dataset", () => {
    assert.equal(calculateAnsweredCalls(mixedCalls), 3);
  });

  test("returns 0 when nothing was answered", () => {
    const allMissed = [
      { outcome: "missed", duration: 0 },
      { outcome: "voicemail", duration: 0 }
    ];
    assert.equal(calculateAnsweredCalls(allMissed), 0);
  });

  test("returns 0 for an empty dataset", () => {
    assert.equal(calculateAnsweredCalls([]), 0);
  });

  test("ignores records with a missing or invalid outcome field", () => {
    const withMissingOutcome = [
      { direction: "incoming", duration: 10 },          // no outcome property
      { direction: "incoming", outcome: "answered", duration: 20 },
      { direction: "incoming", outcome: "ringing", duration: 30 } // invalid value
    ];
    assert.equal(calculateAnsweredCalls(withMissingOutcome), 1);
  });

  test("returns 0 for invalid (non-array) input instead of throwing", () => {
    assert.equal(calculateAnsweredCalls(null), 0);
  });
});

describe("calculateMissedCalls", () => {
  test("counts only missed records in a mixed dataset", () => {
    assert.equal(calculateMissedCalls(mixedCalls), 2);
  });

  test("returns 0 when nothing was missed", () => {
    const allAnswered = [
      { outcome: "answered", duration: 10 },
      { outcome: "answered", duration: 20 }
    ];
    assert.equal(calculateMissedCalls(allAnswered), 0);
  });

  test("returns 0 for an empty dataset", () => {
    assert.equal(calculateMissedCalls([]), 0);
  });

  test("returns 0 for invalid (non-array) input instead of throwing", () => {
    assert.equal(calculateMissedCalls(undefined), 0);
  });
});

describe("calculateTotalDuration", () => {
  test("sums duration across a mixed dataset", () => {
    assert.equal(calculateTotalDuration(mixedCalls), 180);
  });

  test("returns 0 for an empty dataset", () => {
    assert.equal(calculateTotalDuration([]), 0);
  });

  test("ignores negative, non-numeric, and missing duration values rather than corrupting the total", () => {
    const withBadDurations = [
      { duration: 60 },
      { duration: -30 },        // negative — should be ignored
      { duration: "90" },       // string, not a number — should be ignored
      { duration: NaN },        // not finite — should be ignored
      {},                        // missing duration entirely — should be ignored
      { duration: 40 }
    ];
    assert.equal(calculateTotalDuration(withBadDurations), 100);
  });

  test("returns 0 for invalid (non-array) input instead of throwing", () => {
    assert.equal(calculateTotalDuration(null), 0);
    assert.equal(calculateTotalDuration("not an array"), 0);
  });
});

describe("calculateDashboardStats (combined calculation)", () => {
  test("returns every statistic together, consistent with the individual functions", () => {
    const stats = calculateDashboardStats(mixedCalls);
    assert.deepEqual(stats, {
      total: 5,
      incoming: 3,
      outgoing: 2,
      answered: 3,
      missed: 2,
      totalDurationSeconds: 180
    });
  });

  test("returns all-zero stats for an empty dataset", () => {
    const stats = calculateDashboardStats([]);
    assert.deepEqual(stats, {
      total: 0,
      incoming: 0,
      outgoing: 0,
      answered: 0,
      missed: 0,
      totalDurationSeconds: 0
    });
  });

  test("does not throw on invalid (non-array) input, and returns all-zero stats", () => {
    const stats = calculateDashboardStats(null);
    assert.deepEqual(stats, {
      total: 0,
      incoming: 0,
      outgoing: 0,
      answered: 0,
      missed: 0,
      totalDurationSeconds: 0
    });
  });
});
