# Exp01 Moodle Book Import Package

This folder is prepared for Moodle Book chapter import.

Moodle Book import rule used here:

- HTML files without `_sub` are main chapters.
- HTML files ending with `_sub.html` are subchapters.
- Chapters are ordered by filename prefix.

Recommended import order:

1. `00_Intro.html`
2. `01_PreLab.html`
   - `01_00_Safety_sub.html`
   - `01_01_ColorCode_sub.html`
   - `01_02_Equipment_sub.html`
   - `01_03_Breadboard_sub.html`
   - `01_04_Tinkercad_sub.html`
3. `02_InLab.html`
   - `02_00_PartA_sub.html`
   - `02_01_PartB_sub.html`
   - `02_02_PartC_sub.html`
4. `03_PostLab.html`

All chapter files keep inline CSS for Moodle compatibility.

External links are maintained separately in:

`../tool_links/external_links.json`

