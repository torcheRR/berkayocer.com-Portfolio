import { test } from "node:test";
import assert from "node:assert/strict";
import { safeRedirectPath } from "../src/lib/preview/redirect";

test("aynı origin'deki yollar korunur", () => {
  assert.equal(safeRedirectPath("/"), "/");
  assert.equal(safeRedirectPath("/projeler/travelwise"), "/projeler/travelwise");
  assert.equal(safeRedirectPath("/ozgecmisim?x=1#egitim"), "/ozgecmisim?x=1#egitim");
});

test("dış adresler ve hileli yollar ana sayfaya döner", () => {
  const hostile = [
    "//evil.example",
    "/\\evil.example",
    "https://evil.example/",
    "evil",
    "",
    " /x",
    "/\n/evil.example",
    "javascript:alert(1)",
    // Nokta segmentleri ayrıştırıldıktan sonra "//host" üretenler
    "/.//evil.example",
    "/a/..//evil.example",
    "/%2e//evil.example",
    "/./\\evil.example",
  ];
  for (const raw of hostile) {
    assert.equal(safeRedirectPath(raw), "/", JSON.stringify(raw));
  }
});

test("metin olmayan değerler ana sayfaya döner", () => {
  for (const raw of [null, undefined, 42, {}, ["/x"]]) assert.equal(safeRedirectPath(raw), "/");
});
