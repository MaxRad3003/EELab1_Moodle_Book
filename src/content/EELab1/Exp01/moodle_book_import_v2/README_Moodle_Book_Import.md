# Exp01 Moodle Book Import Package

This folder is prepared for Moodle Book chapter import.

Moodle Book import rule used here:

- HTML files without `_sub` are main chapters.
- HTML files ending with `_sub.html` are subchapters.
- Files are named so each parent chapter appears before its subchapters in filename order.

Recommended structure:

1. `00_Intro.html`
2. `01_PreLab.html`
   - `01_PreLab_00_Safety_sub.html`
   - `01_PreLab_00_Units_sub.html`
   - `01_PreLab_01_ColorCode_sub.html`
   - `01_PreLab_02_Equipment_sub.html`
   - `01_PreLab_03_Breadboard_sub.html`
   - `01_PreLab_04_Tinkercad_sub.html`
3. `02_InLab.html`
   - `02_InLab_00_PartA_sub.html`
   - `02_InLab_01_PartB_sub.html`
   - `02_InLab_02_PartC_sub.html`
4. `03_PostLab.html`

All chapter files keep inline CSS for Moodle compatibility.

LaTeX expressions use Moodle TeX inline notation:

`\(...\)`

External links are maintained separately in:

`../tool_links/external_links.json`
