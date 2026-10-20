import { test } from "node:test";
import assert from "node:assert/strict";
import { fieldKey, stegaFilter } from "../src/sanity/stega";

type Props = Parameters<typeof stegaFilter>[0];
type Segment = Props["sourcePath"][number];

// filterDefault'u true döndüren bir taklitle yalnızca izin listesini sınar.
function encodes(type: string, sourcePath: Segment[], value = "metin", filterDefault: Props["filterDefault"] = () => true) {
  return stegaFilter({ sourcePath, resultPath: sourcePath, sourceDocument: { _id: "x", _type: type } as Props["sourceDocument"], value, filterDefault });
}

test("fieldKey dizi indekslerini ve _key parçalarını atar", () => {
  assert.equal(fieldKey(["status", { _key: "s0", _index: 0 }, "title", "tr"] as Segment[]), "status.title.tr");
  assert.equal(fieldKey(["workflow", "steps", 2]), "workflow.steps");
  assert.equal(fieldKey(["body", { _key: "b1", _index: 1 }, "children", { _key: "c", _index: 0 }, "text"] as Segment[]), "body.children.text");
});

test("ekranda düz metin olan alanlar işaretlenir", () => {
  const cases: Array<[string, Segment[]]> = [
    ["profile", ["name"]],
    ["profile", ["role"]],
    ["profile", ["tagline", "tr"]],
    ["profile", ["bio", "tr"]],
    ["profile", ["location", "tr"]],
    ["profile", ["availability", "tr"]],
    ["profile", ["status", { _key: "a", _index: 0 } as Segment, "detail", "tr"]],
    ["profile", ["workflow", "steps", 0]],
    ["profile", ["portrait", "alt"]],
    ["project", ["title"]],
    ["project", ["summary", "tr"]],
    ["project", ["description", "tr"]],
    ["project", ["cover", "image", "alt"]],
    ["project", ["body", { _key: "b", _index: 0 } as Segment, "children", { _key: "c", _index: 0 } as Segment, "text"]],
    ["project", ["body", { _key: "b", _index: 1 } as Segment, "caption"]],
    ["technology", ["name"]],
    ["experience", ["company"]],
    ["experience", ["role", "tr"]],
    ["experience", ["tags", 1]],
    ["education", ["school"]],
    ["education", ["gpa"]],
  ];
  for (const [type, path] of cases) assert.equal(encodes(type, path), true, `${type}.${fieldKey(path)}`);
});

test("kodun kullandığı alanlar hiçbir zaman işaretlenmez", () => {
  const cases: Array<[string, Segment[]]> = [
    ["profile", ["timeZone"]],
    ["profile", ["email"]],
    ["profile", ["githubUser"]],
    ["profile", ["socials", { _key: "s", _index: 0 } as Segment, "label"]],
    ["profile", ["socials", { _key: "s", _index: 0 } as Segment, "platform"]],
    ["profile", ["socials", { _key: "s", _index: 0 } as Segment, "url"]],
    ["profile", ["status", { _key: "a", _index: 0 } as Segment, "tone"]],
    ["project", ["slug", "current"]],
    ["project", ["kind"]],
    ["project", ["status"]],
    ["project", ["cover", "mark"]],
    ["project", ["cover", "brand"]],
    ["project", ["links", "repo"]],
    ["project", ["body", { _key: "b", _index: 0 } as Segment, "markDefs", { _key: "m", _index: 0 } as Segment, "href"]],
    ["technology", ["slug", "current"]],
    ["technology", ["color"]],
    ["technology", ["categories", 0]],
    ["experience", ["type"]],
    ["experience", ["start"]],
    ["experience", ["end"]],
    ["profile", ["name", "en"]],
    ["unknownType", ["name"]],
  ];
  for (const [type, path] of cases) assert.equal(encodes(type, path), false, `${type}.${fieldKey(path)}`);
});

test("boş değerler işaretlenmez (yayımlanmış içerikteki gibi boş kalır)", () => {
  assert.equal(encodes("project", ["title"], ""), false);
  assert.equal(encodes("project", ["title"], "   "), false);
});

test("Sanity'nin varsayılan filtresi reddederse işaretlenmez", () => {
  assert.equal(encodes("project", ["title"], "https://ornek.com", () => false), false);
});
