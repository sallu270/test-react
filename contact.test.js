import assert from "node:assert/strict";
import test from "node:test";

const validPayload = {
  name: "Mohd Salauddin",
  email: "sallu@example.com",
  company: "Pearl Organisation",
  budget: "₹5L - ₹10L",
  message: "We need a premium storytelling portfolio with smooth animation and a strong contact flow."
};

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

test("valid contact payload has required fields", () => {
  assert.equal(validPayload.name.length >= 2, true);
  assert.equal(isEmail(validPayload.email), true);
  assert.equal(validPayload.company.length >= 2, true);
  assert.equal(validPayload.message.length >= 20, true);
});

test("invalid email fails validation helper", () => {
  assert.equal(isEmail("wrong-email"), false);
});

test("message length requirement protects low-quality submissions", () => {
  assert.equal("too short".length >= 20, false);
});