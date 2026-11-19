#!/usr/bin/env python3
"""Build the data files behind /adminmonitoring (MMDA administrative data quality monitor).

Input: the `data/` folder of the MMDA administrative data dashboard (districts.json, district_areas.json,
district_years.json, district_indicator_years.json, submissions.json).

Usage: python3 scripts/build-admin-monitoring.py <path-to-source-data-folder> [compiled-date YYYY-MM-DD]

Output:
  data/adminMonitoring.json        one compact row per district: totals, 11 years, 15 thematic areas
  data/adminMonitoringDetail.json  per district: records by thematic area and year, and its submissions
                                   (loaded only when a district profile is opened)

No figure is computed here. Values are copied, reshaped and cross-checked; rates and totals are derived
in lib/adminMonitoring.ts exactly as the source dashboard derived them.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = Path(sys.argv[1])
compiled = sys.argv[2] if len(sys.argv) > 2 else "2026-10-16"
load = lambda name: json.loads((src / f"{name}.json").read_text(encoding="utf-8"))
districts, areas, years, ind_years, subs = (load(n) for n in ["districts", "district_areas", "district_years", "district_indicator_years", "submissions"])

YEARS = list(range(2015, 2026))
AREAS = ["Agriculture", "Electricity", "Education", "Roads", "Crime", "Road accidents", "Improved sanitation", "Births", "Deaths",
         "Local economic development (LED)", "Health", "Forestry", "Water", "Assembly revenue", "SDGs Budget"]

# The boundary file and the MPI dashboard use StatsBank spellings; the administrative dataset uses assembly names.
# Names are joined after dropping the assembly type; these are the remaining spelling differences.
ALIAS = {
    "Atwima Nwabiagya Municipal": "Atwima Nwabiagya South Municipal", "Bosomtwe District": "Bosomtwi",
    "Ejura Sekyeredumase Municipal": "Ejura Sekyedumase Municipal", "Abura Asebu Kwamankesse District": "Abura Asebu Kwamankese",
    "Efutu Municipal": "Effutu Municipal", "Mfantseman Municipal": "Mfantsiman Municipal",
    "Twifo Hemang Lower Denkyira District": "Twifo Heman Lower Denkyira", "Denkyembour District": "Denkyembuor",
    "Korle Klotey Municipal": "Korle Klottey Municipal", "Okaikwei Municipal": "Okaikoi North Municipal",
    "Gushiegu Municipal": "Gushegu Municipal", "Sagnerigu Municipal": "Sagnarigu Municipal",
    "Kassena Nankana Municipal": "Kasena Nankana Municipal", "Kassena Nankana West District": "Kasena Nankana West",
    "Daffiama-Bissie-Issa District": "Daffiama Bussie Issa", "Lambussie District": "Lambussie Karni",
    "Efia Kwesimintsim Municipal": "Effia Kwesimintsim Municipal", "Ellembele District": "Ellembelle", "Juabeso District": "Juaboso",
}
def norm(s):
    s = re.sub(r"\(.*?\)", "", s.lower())
    s = re.sub(r"\b(district|municipal|metropolitan|area)\b", "", s)
    return re.sub(r"[^a-z]", "", s)

mpi = json.loads((ROOT / "data" / "mpiDistricts.json").read_text(encoding="utf-8"))["districts"]
by_norm = {}
for m in mpi: by_norm.setdefault((m["region"], norm(m["name"])), []).append(m)
geo_names = {f["properties"]["district"] for f in json.loads((ROOT / "public" / "map" / "District.gh.json").read_text(encoding="utf-8"))["features"]}

assert len(districts) == 261 and len({d["district"] for d in districts}) == 261
assert len(years) == 261 * len(YEARS) and len(areas) == 261 * len(AREAS)
year_rows = {(r["district"], int(r["year"])): r for r in years}
area_rows = {(r["district"], r["area"]): r for r in areas}
iy = {}
for r in ind_years:
    assert r["area"] in AREAS and int(r["year"]) in YEARS, r
    iy[(r["district"], r["area"], int(r["year"]))] = int(r["records"])

core, detail, used = [], {}, set()
for d in sorted(districts, key=lambda d: (d["region"], d["district"])):
    name, region = d["district"], d["region"]
    match = by_norm.get((region, norm(ALIAS.get(name, name))), [])
    assert len(match) == 1, f"no single map match for {name} ({region})"
    assert match[0]["name"] not in used; used.add(match[0]["name"])
    shapes = match[0].get("shapes") or [match[0]["name"]]
    assert all(s in geo_names for s in shapes), (name, shapes)

    y = [[int(year_rows[(name, yr)][k]) for yr in YEARS] for k in ["records", "expected", "repeats", "invalid", "outliers"]]
    a = []
    for area in AREAS:
        r = area_rows[(name, area)]
        assert r["invalid"] == r["invalid_small"] + r["invalid_pct"]
        a.append([int(r["records"]), float(r["coverage_pct"]), int(r["repeats"]), int(r["invalid_small"]), int(r["invalid_pct"]),
                  int(r["outliers"]), int(r["conflicts"]), r["missing_years"] or "", r["future_years"] or ""])
    grid = [[iy.get((name, area, yr), 0) for yr in YEARS] for area in AREAS]

    # Cross-checks: the four source files must agree with each other for every district.
    assert sum(y[0]) == d["records"] == sum(r[0] for r in a) == sum(map(sum, grid)), name
    assert sum(y[1]) == d["expected"] and sum(y[2]) == d["repeats"] and sum(y[3]) == d["invalid"] and sum(y[4]) == d["outliers"], name
    assert d["invalid"] == d["invalid_small"] + d["invalid_pct"] == sum(r[3] + r[4] for r in a), name
    assert sum(r[2] for r in a) == d["repeats"] and sum(r[5] for r in a) == d["outliers"] and sum(r[6] for r in a) == d["conflicts"], name
    # Area scores are stored to one decimal, so their mean can differ from the stored overall score by rounding.
    assert abs(sum(r[1] for r in a) / len(AREAS) - d["overall_completion"]) < 0.1, name
    assert abs(d["records"] / d["expected"] * 100 - d["pct_of_expected"]) < 0.06, name
    assert all(grid[i][j] == 0 for i, r in enumerate(a) for j, yr in enumerate(YEARS) if str(yr) in r[7].split(",")), name
    mine = [s for s in subs if s["district"] == name]
    assert sum(int(s["records"]) for s in mine) == d["records"], name
    assert sum(1 for s in mine if s["submitted"] != "No timestamp") == d["submissions"], name

    core.append({"n": name, "r": region, "shapes": shapes, "rec": d["records"], "exp": d["expected"], "comp": d["overall_completion"],
                 "sub": d["submissions"], "wb": d["workbooks"], "rep": d["repeats"], "invS": d["invalid_small"], "invP": d["invalid_pct"],
                 "out": d["outliers"], "conf": d["conflicts"], "first": d["first_submitted"], "last": d["last_submitted"], "y": y, "a": a})
    detail[name] = {"iy": grid, "subs": sorted(([s["submitted"], s["template"], int(s["workbooks"]), int(s["records"])] for s in mine), key=lambda s: s[0], reverse=True)}

assert len(used) == 261
dump = lambda path, obj: (ROOT / "data" / path).write_text(json.dumps(obj, separators=(",", ":"), ensure_ascii=False) + "\n", encoding="utf-8")
dump("adminMonitoring.json", {"compiled": compiled, "years": YEARS, "areas": AREAS, "districts": core})
dump("adminMonitoringDetail.json", detail)
print(f"261 districts, {sum(d['rec'] for d in core):,} records of {sum(d['exp'] for d in core):,} expected; all cross-checks passed")
