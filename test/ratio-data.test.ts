import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type Pair = [number, number];
type RecordRow = { p: string; a: Pair[]; f: Pair[]; t: Pair[] };
const root = process.cwd();
const index = JSON.parse(readFileSync(resolve(root, "public/data/index.json"), "utf8"));
const records = JSON.parse(
  readFileSync(resolve(root, "public/data/ratios.json"), "utf8"),
) as RecordRow[];
const find = (placeId: string) => records.find((item) => item.p === placeId)!;

describe("matched regional occupation-total ratios", () => {
  it("retains verified source metadata and dimensions", () => {
    expect(index).toMatchObject({
      schemaVersion: 1,
      asOf: "2026-08-02",
      edition: "2023〜2025年度（現行職業分類・職業計）",
      placeCount: 48,
      prefectureCount: 47,
      employmentCount: 3,
      recordCount: 48,
      pairCount: 432,
      sourceValueCount: 864,
    });
    expect(index.years).toEqual([2023, 2024, 2025]);
    expect(index.sources).toEqual([
      expect.objectContaining({
        kind: "openings",
        sha256: "4c740910e86217951ea7ccfe9f0ed32ff53b3f088c3c97e2328fd13c5d5070ce",
      }),
      expect.objectContaining({
        kind: "seekers",
        sha256: "0f2ce1388a319c36771e7e9115ab4562bf6d12d63f4289b0bc52a199c1381d55",
      }),
    ]);
  });
  it("contains one unique record per place and three employment series", () => {
    expect(records).toHaveLength(48);
    expect(new Set(records.map((item) => item.p)).size).toBe(48);
    expect(index.places).toHaveLength(48);
    expect(index.employments.map((item: { id: string }) => item.id)).toEqual(["a", "f", "t"]);
  });
  it("retains known nationwide 2025 values", () => {
    expect(find("JP-00").a[2]).toEqual([24_988_674, 22_698_922]);
    expect(find("JP-00").f[2]).toEqual([16_201_486, 13_585_956]);
    expect(find("JP-00").t[2]).toEqual([8_787_188, 9_112_966]);
  });
  it("retains known Tokyo and Okinawa values", () => {
    expect(find("JP-13").a[2]).toEqual([3_747_553, 2_456_025]);
    expect(find("JP-47").a[2]).toEqual([284_297, 326_900]);
  });
  it("keeps every source value integral and every denominator positive", () => {
    for (const record of records) {
      expect(Object.keys(record).sort()).toEqual(["a", "f", "p", "t"]);
      for (const employment of ["a", "f", "t"] as const) {
        expect(record[employment]).toHaveLength(3);
        for (const [opening, seeker] of record[employment]) {
          expect(Number.isInteger(opening)).toBe(true);
          expect(opening).toBeGreaterThanOrEqual(0);
          expect(Number.isInteger(seeker)).toBe(true);
          expect(seeker).toBeGreaterThan(0);
        }
      }
    }
    expect(statSync(resolve(root, "public/data/ratios.json")).size).toBeLessThan(25_000);
  });
  it("keeps all employment identities exact", () => {
    for (const record of records) {
      for (let yearIndex = 0; yearIndex < 3; yearIndex += 1) {
        expect(record.a[yearIndex][0]).toBe(record.f[yearIndex][0] + record.t[yearIndex][0]);
        expect(record.a[yearIndex][1]).toBe(record.f[yearIndex][1] + record.t[yearIndex][1]);
      }
    }
  });
  it("keeps nationwide values equal to all 47 labour bureaus", () => {
    const national = find("JP-00");
    const prefectures = records.filter((record) => record.p !== "JP-00");
    for (const employment of ["a", "f", "t"] as const) {
      for (let yearIndex = 0; yearIndex < 3; yearIndex += 1) {
        expect(prefectures.reduce((sum, record) => sum + record[employment][yearIndex][0], 0)).toBe(
          national[employment][yearIndex][0],
        );
        expect(prefectures.reduce((sum, record) => sum + record[employment][yearIndex][1], 0)).toBe(
          national[employment][yearIndex][1],
        );
      }
    }
  });
});
