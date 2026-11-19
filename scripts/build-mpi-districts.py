#!/usr/bin/env python3
"""Build data/mpiDistricts.json for the Multidimensional Poverty dashboard.

Inputs (all published by the Ghana Statistical Service; download them first):
  1. StatsBank table "Multidimensional Poverty Index (MPI) by Indicators, Year and District"
     (matrix MPI_Inidicator_Contribution), saved from
     https://statsbank.statsghana.gov.gh/pxweb/en/MPI/-/MPI_indicator_contribution.px/
     with every value selected, as "JSON-stat 2 file (json)".
  2. "Multidimensional Poverty National Ranking 2025" (statsghana.gov.gh > Publications >
     Administrative Data Reports), converted with `pdftotext -layout`.
  3. The file listing behind the Administrative Data Reports page (keys of the 261 district fact sheets).
  4. "Multi Dimensional Poverty Report" (2021 Population and Housing Census; same page), converted with
     `pdftotext -layout`: Table 7.18 gives each district's household population and number of
     multidimensionally poor persons in 2021.

Usage: python3 scripts/build-mpi-districts.py <statsbank.json> <ranking.txt> <reports_list.json> <census_report.txt>

No figure is computed here: values are copied, joined on district name and checked.
"""
import difflib, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
statsbank, ranking_txt, listing, census_txt = sys.argv[1:5]

REGIONS = ["Western North", "North East", "Upper East", "Upper West", "Greater Accra", "Bono East", "Ahafo", "Ashanti",
           "Bono", "Central", "Eastern", "Northern", "Oti", "Savannah", "Volta", "Western"]
# Spelling differences between the three sources; the StatsBank spelling is used for display.
RANKING_ALIAS = {"Kassena Nankana Municipal": "Kasena Nankana Municipal", "Kassena Nankana West": "Kasena Nankana West"}
FACTSHEET_ALIAS = {"Prestea-Huni Valley Municipal": "Prestea/Huni Valley Municipal"}
# The boundary file splits six metropolitan areas into sub-metros; they carry the metropolitan estimate.
GEO_PREFIX = {"AMA-": "Accra Metropolitan Area (AMA)", "CCMA-": "Cape Coast Metropolitan Area (CCMA)", "KMA-": "Kumasi Metropolitan Area (KMA)",
              "STMA-": "Sekondi Takoradi Metropolitan Area (STMA)", "TMA-Tamale": "Tamale Metropolitan Area (TMA)", "TMA-Tema": "Tema Metropolitan Area (TMA)"}
GEO_ALIAS = {"Nkwanta North (Kpassa)": "Nkwanta North"}

j = json.load(open(statsbank, encoding="utf-8-sig"))
assert j["id"] == ["Indicators", "Year", "District"] and j["size"] == [13, 5, 261], (j["id"], j["size"])
def labels(dim):
    cat = j["dimension"][dim]["category"]
    return [cat["label"][c] for c in sorted(cat["index"], key=cat["index"].get)]
indicators, years, districts = labels("Indicators"), labels("Year"), labels("District")
values = j["value"]
assert len(values) == 13 * 5 * 261 and all(v is not None for v in values)
def contribution(i, y, d): return values[(i * 5 + y) * 261 + d]

rank = {}
for line in open(ranking_txt, encoding="utf-8"):
    s = line.strip()
    pairs = re.findall(r"(\d+\.\d)%\s+(\d+)", s)
    if len(pairs) != 5: continue
    head = re.split(r"\s{2,}\d+\.\d%", s)[0]
    region = next(r for r in REGIONS if head.startswith(r + " "))
    name = head[len(region):].strip()
    name = RANKING_ALIAS.get(name, name)
    assert name not in rank, name
    rank[name] = (region, [float(a) for a, _ in pairs], [int(b) for _, b in pairs])
assert set(rank) == set(districts), (set(rank) ^ set(districts))
for y in range(5):
    assert sorted(r[2][y] for r in rank.values()) == list(range(1, 262)), f"ranks {years[y]}"

sheets = {}
for item in json.load(open(listing))["items"]:
    key = item["key"]
    if "MPI District Factsheets" not in key: continue
    name = re.sub(r"\.pdf$", "", key.split("/")[-1]).replace("District Multidimensional poverty 2025 ", "")
    name = FACTSHEET_ALIAS.get(name, name)
    assert key.split("/")[-2] == rank[name][0], (name, key)
    sheets[name] = key
assert set(sheets) == set(districts)

# 2021 census report, Table 7.18: household population and number of multidimensionally poor persons.
# District names are written differently there, so rows are joined on region + published 2021 incidence + closest name.
pages = open(census_txt, encoding="utf-8").read().split("\f")
start = max(i for i, p in enumerate(pages) if "TABLE 7.18" in p)
census_rows = []
for line in "\n".join(pages[start:]).splitlines():
    m = re.match(r"\s*(.+?)\s{2,}(.+?)\s{2,}([\d,]+)\s+([\d,]+)\s+(\d+\.\d)\s+(\d+)\s*$", line)
    if not m or m.group(1).strip() not in REGIONS: continue
    census_rows.append((m.group(1).strip(), m.group(2).strip(), int(m.group(3).replace(",", "")), int(m.group(4).replace(",", "")), float(m.group(5))))
assert len(census_rows) == 261, len(census_rows)
census, free = {}, set(districts)
norm = lambda n: re.sub(r"[^a-z]", "", n.lower().replace("metropolis", "").replace("metropolitan area", "").replace("municipal", ""))
for region, name, population, poor, pct in census_rows:
    options = [d for d in free if rank[d][0] == region and rank[d][1][0] == pct]
    assert options, (region, name, pct)
    best = max(options, key=lambda d: difflib.SequenceMatcher(None, norm(name), norm(re.sub(r"\(.*?\)", "", d))).ratio())
    assert difflib.SequenceMatcher(None, norm(name), norm(re.sub(r"\(.*?\)", "", best))).ratio() > 0.5, (name, best)
    assert abs(poor / population * 100 - pct) < 0.06, (name, poor, population, pct)
    census[best] = (population, poor); free.discard(best)
assert not free, free

geo = json.load(open(ROOT / "public/map/District.gh.json"))
shapes = {}
for feature in geo["features"]:
    label = feature["properties"]["label"]
    target = GEO_ALIAS.get(label) or next((v for k, v in GEO_PREFIX.items() if label.startswith(k)), label)
    assert target in rank, label
    shapes.setdefault(target, []).append(label)
assert set(shapes) == set(districts)

out = {
    "years": [int(y) for y in years],
    "indicators": indicators,
    "sources": {
        "contributions": "GSS StatsBank, Multidimensional Poverty Index (MPI) by Indicators, Year and District (matrix MPI_Inidicator_Contribution), last updated " + j["updated"][:10],
        "headcount": "GSS, District-Level Multidimensional Poverty Rankings, 2021-2025",
        "census2021": "GSS, Multidimensional Poverty Report (2021 Population and Housing Census), Table 7.18",
    },
    "districts": [
        {
            "name": d, "region": rank[d][0], "headcount": rank[d][1], "rank": rank[d][2],
            # contributions[year][indicator], percent of the district MPI
            "contributions": [[contribution(i, y, di) for i in range(13)] for y in range(5)],
            "census2021": {"population": census[d][0], "poor": census[d][1]},
            "factsheet": sheets[d],
            **({"shapes": shapes[d]} if shapes[d] != [d] else {}),
        }
        for di, d in enumerate(districts)
    ],
}
out["districts"].sort(key=lambda d: d["rank"][-1])
target = ROOT / "data/mpiDistricts.json"
target.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
# Names only, for the place search and the site search (small enough to ship on every page).
places = ROOT / "data/mpiPlaces.json"
places.write_text(json.dumps(sorted([d["name"], d["region"]] for d in out["districts"]), ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
print(f"wrote {target.relative_to(ROOT)}: {len(out['districts'])} districts, {target.stat().st_size:,} bytes")
