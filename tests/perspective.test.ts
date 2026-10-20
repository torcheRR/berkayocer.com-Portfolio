import { test } from "node:test";
import assert from "node:assert/strict";
import { perspectiveFromCookie } from "../src/lib/preview/perspective";

test("çerez değeri okuma perspektifine çevrilir", () => {
  assert.equal(perspectiveFromCookie("published"), "published");
  assert.equal(perspectiveFromCookie("drafts"), "drafts");
  assert.equal(perspectiveFromCookie(undefined), "drafts");
  assert.equal(perspectiveFromCookie(""), "drafts");
  // Release yığınları desteklenmez; taslak olarak okunur.
  assert.equal(perspectiveFromCookie("rABC,drafts"), "drafts");
});
