# IMPerfect Gaming | Internal Session Report | Claude-assisted build sprint

---

# IMPerfect Gaming — Internal Session Report

**Date:** March 31, 2026
**Project:** IMPerfect Gaming — Document & Asset Creation Sprint
**Org:** IMPerfect Gaming | Puerto Rico Esports | OW2 + Marvel Rivals | Est. 2017
**Site:** imperfect-sage.vercel.app/en | Discord: discord.gg/VuTAEqPT | Brand: `#C8E400`
**Session type:** Document & asset creation sprint (openpyxl / HTML)

---

## 1. SESSION OVERVIEW

This session was a document build sprint focused on creating the four core internal management assets for IMPerfect Gaming. All four deliverables were completed successfully after a mid-session recovery cycle triggered by formula reference breakage and merged cell conflicts in the Excel outputs.

The session produced two branded `.xlsx` spreadsheets (Tournament Tracker, Sponsor CRM & Revenue Tracker) and two branded `.html` documents (Merch Store Launch Plan, Press Kit & Media One-Pager). All four documents include a standardized description banner section.

Three distinct technical mistakes occurred — all related to openpyxl behavior — and were resolved in-session. No deliverables were left incomplete.

---

## 2. DELIVERABLES LOG

| # | Asset | Format | Sheets / Sections | Key Features |
|---|-------|--------|-------------------|--------------|
| 1 | Tournament Tracker | `.xlsx` | 3 sheets | 10 tournament rows, Win% formula, season summary strip, status color-coding, dropdown validation for Game + Status |
| 2 | Sponsor CRM & Revenue Tracker | `.xlsx` | 3 sheets | 10 sponsors, tier color-coding, outstanding balance formula, 14 revenue entries, 5 categories, Net formula, summary strip, dropdown validation |
| 3 | Merch Store Launch Plan | `.html` | 8 sections | 4-phase launch timeline, 8-SKU catalog, platform comparison, revenue projections (3 scenarios), KPIs, pre-launch checklist, risk register |
| 4 | Press Kit & Media One-Pager | `.html` | 2 parts | Print-ready one-pager + extended press kit, approved boilerplate, founder quote, brand voice guide, asset inventory, media FAQ |

All four documents include a **description banner** at the top: "What this is" + "Purpose."

---

## 3. MISTAKES & POST-MORTEMS

---

### M-001 — Duplicate Script File Conflict

**Title:** Stale build script not checked before writing

**What happened:**
A Python build script (`build_crm.py`) already existed from a previous session attempt. A new script was written without checking for the existing file, causing a naming conflict. A second script (`build_crm_new.py`) had to be created as a workaround.

**Root cause:**
No pre-write existence check was performed before creating the new script file. The session assumed a clean working directory.

**Impact:** `Low` — resulted in a redundant file on disk, no data loss or output corruption.

**How it was fixed:**
Created `build_crm_new.py` as a workaround and continued. The duplicate file was left in place.

**Prevention rule:**
ALWAYS check if the target file exists before writing. Either overwrite explicitly with documented intent, or fail loudly and ask.

**Code pattern to use going forward:**
```python
import os

output_path = "build_crm.py"

if os.path.exists(output_path):
    raise FileExistsError(
        f"{output_path} already exists. Delete it or pass overwrite=True to proceed."
    )

# Safe to write
with open(output_path, "w") as f:
    f.write(script_content)
```

---

### M-002 — Formula Row References Broke After Inserting Description Rows

**Title:** Hardcoded row numbers invalidated by programmatic row insertion

**What happened:**
After all spreadsheet content was built with hardcoded formula references (e.g., `=SUM(L4:L13)`, `=IFERROR(H9/G9,0)`), three description rows were inserted at row 3 of each sheet using `insert_rows(3, 3)`. openpyxl did **not** update existing formula references — unlike interactive Excel. This caused `#VALUE!` and stale-reference errors in:
- `Tournament Tracker!N9` — Win% formula
- `Sponsor CRM!M9` — Outstanding balance formula
- `Revenue Tracker!G9`, `E26`, `I26` — Net and summary formulas

A full second fix pass was required to identify and rewrite every affected formula.

**Root cause:**
openpyxl is a low-level file writer. It does not implement Excel's formula reference recalculation engine. `insert_rows()` physically shifts cell data but does not parse or rewrite string formula values. Any formula containing a hardcoded row number becomes stale silently — no warning is raised.

**Impact:** `Medium` — required a second fix pass, formula unmerging, and a full re-verification cycle. No data was lost but significant time was spent on recovery.

**How it was fixed:**
Located all formula cells, manually recalculated the correct post-insert row numbers, and rewrote each formula string. Unmerged ranges before writing (see M-003).

**Prevention rule:**
NEVER hardcode row numbers in openpyxl formulas when rows may be inserted programmatically. ALWAYS build description/header rows first, then write data rows, so all row references are final at write time.

**Code pattern to use going forward:**
```python
# WRONG — hardcoded row numbers break if rows are inserted later
ws["N9"] = "=IFERROR(H6/G6, 0)"

# CORRECT — calculate the actual row at write time
HEADER_ROWS = 3      # description banner
DATA_START   = HEADER_ROWS + 2   # e.g. row 5
DATA_END     = DATA_START + 9    # 10 data rows

summary_row = DATA_END + 2

ws.cell(row=summary_row, column=14).value = (
    f"=IFERROR(H{DATA_START}/G{DATA_START}, 0)"
)

# Better yet: write description rows FIRST, then data rows
# so row numbers are always correct at the time formulas are written
```

---

### M-003 — Writing to MergedCell Objects Raised AttributeError

**Title:** Direct value assignment to non-anchor merged cells

**What happened:**
While fixing formula cells (M-002), the script threw:
```
AttributeError: 'MergedCell' object attribute 'value' is read-only
```
This occurred because the target cells were inside existing merged ranges in the summary block. openpyxl represents all cells in a merged range except the top-left anchor as read-only `MergedCell` shadow objects.

**Root cause:**
openpyxl's merged cell model: only the top-left cell of a merge is a writable `Cell`. All other positions in the range are `MergedCell` proxies with no writable `.value`. Writing to them raises `AttributeError` silently if not handled.

**Impact:** `Low` — raised a clear exception, caught immediately. Required an unmerge-before-write pattern.

**How it was fixed:**
Unmerged the affected ranges before writing new values, wrote the values to the correct anchor cells, then re-merged.

**Prevention rule:**
ALWAYS unmerge a range before writing to any cell within it. NEVER write to a merged range without first checking if the target cell is the anchor or a shadow.

**Code pattern to use going forward:**
```python
from openpyxl.utils import get_column_letter

def safe_write_cell(ws, row, col, value):
    """Write to a cell safely, unmerging its range first if needed."""
    cell_coord = f"{get_column_letter(col)}{row}"

    # Find and remove any merge range containing this cell
    ranges_to_remove = []
    for merge_range in list(ws.merged_cells.ranges):
        if cell_coord in merge_range:
            ranges_to_remove.append(str(merge_range))

    for r in ranges_to_remove:
        ws.unmerge_cells(r)

    ws.cell(row=row, column=col).value = value


# Usage
safe_write_cell(ws, row=9, col=13, value="=SUM(L5:L14)")
```

---

## 4. GOLDEN RULES — NEVER AGAIN LIST

1. **ALWAYS check for existing files before writing.** Use `os.path.exists()` and either raise an error or explicitly overwrite with intent. Never assume a clean working directory.

2. **NEVER hardcode row numbers in openpyxl formulas.** Calculate all row references dynamically from constants (`HEADER_ROWS`, `DATA_START`, `DATA_END`). If the layout changes, only the constants need updating.

3. **ALWAYS write description/header rows FIRST, then data rows and formulas.** This guarantees that all row numbers are final at the time formulas are written. Never insert rows into an already-populated sheet.

4. **NEVER write directly to a merged cell range without unmerging first.** Use a `safe_write_cell()` helper that checks for merge membership and unmerges before writing.

5. **ALWAYS verify every formula cell after a structural change.** After any `insert_rows()` or `delete_rows()` call, run a verification pass over all formula cells and assert their string values match expected patterns.

6. **NEVER use `insert_rows()` as a layout tool on a finished sheet.** If extra rows are needed, redesign the build order so those rows are created first, not injected after.

7. **ALWAYS name build scripts with the intent and version in the filename from the start.** e.g., `build_tournament_v1.py`. Never default to generic names that will conflict.

---

## 5. RECOMMENDED WORKFLOW FOR FUTURE SESSIONS

Use this checklist for every branded Excel file built with openpyxl:

```
[ ] 1. PLAN LAYOUT FIRST
        - Define HEADER_ROWS, DATA_START, DATA_END, SUMMARY_ROW as constants
        - Sketch the sheet structure before writing any code

[ ] 2. CHECK FOR EXISTING FILES
        - os.path.exists(output_path) before every file write
        - Raise or prompt — never silently overwrite

[ ] 3. BUILD TOP TO BOTTOM — NEVER INSERT ROWS
        - Write rows in this order: description banner → column headers → data rows → summary/formula rows
        - Never use insert_rows() on a populated sheet

[ ] 4. WRITE FORMULAS LAST
        - All structural rows must be in final position before any formula strings are written
        - Use dynamic row reference: f"=SUM(L{DATA_START}:L{DATA_END})"

[ ] 5. UNMERGE BEFORE WRITING
        - For any cell in the summary block, call safe_write_cell() or manually unmerge the range first

[ ] 6. RE-MERGE AFTER WRITING
        - Re-apply any merge ranges that were removed in step 5

[ ] 7. VERIFY ALL FORMULA CELLS
        - After the full sheet is built, iterate over all formula cells
        - Assert each formula string matches its expected pattern
        - Log any cell where the formula looks stale (wrong row numbers)

[ ] 8. SAVE AND SPOT-CHECK
        - Save the file
        - If possible, open in LibreOffice or Excel and manually check summary cells
```

---

## 6. SESSION HEALTH SCORE

| Dimension | Score | Notes |
|---|---|---|
| Delivery completeness | 10/10 | All 4 deliverables shipped, all with description banners |
| Technical execution | 6/10 | 3 avoidable openpyxl errors required a full fix pass |
| Error recovery speed | 8/10 | All 3 mistakes diagnosed and resolved in-session without data loss |
| Documentation quality | 9/10 | Strong post-mortems, actionable prevention rules, reusable code patterns |

**Overall: 8.25 / 10**

> Honest commentary: Every deliverable landed, and the error recovery was clean — but all three mistakes were preventable with basic pre-flight discipline. The root cause of M-002 and M-003 is the same: building structure after content instead of before. One hour of upfront layout planning would have eliminated both.

---

*Generated: 2026-03-31 | IMPerfect Gaming Internal Docs | Not for external distribution*
