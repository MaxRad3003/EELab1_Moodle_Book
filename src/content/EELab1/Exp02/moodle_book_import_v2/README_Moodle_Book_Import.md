# Exp02 Moodle Book Import Package

This folder is prepared for Moodle Book chapter import.

Moodle Book import rule used here:

- HTML files without `_sub` are main chapters.
- HTML files ending with `_sub.html` are subchapters.
- Files are ordered so each parent chapter appears before its subchapters in the ZIP.

Recommended structure:

1. `00_Intro.html`
2. `01_PreLab.html`
   - `01_PreLab_00_LinearAlgebra_sub.html`
   - `01_PreLab_01_Superposition_sub.html`
   - `01_PreLab_02_Thevenin_sub.html`
   - `01_PreLab_03_TransferFunction_sub.html`
   - `01_PreLab_04_NonLinear_sub.html`
   - `01_PreLab_05_JSXGraph_sub.html`
   - `01_PreLab_05_WorkPlan_sub.html`
3. `02_InLab.html`
   - `02_InLab_00_PartA_Superposition_sub.html`
   - `02_InLab_01_PartB_Thevenin_sub.html`
   - `02_InLab_02_PartC_IV_sub.html`
4. `03_PostLab.html`
5. `04_References.html`

LaTeX expressions should use Moodle TeX inline notation:

`\(...\)`

External links are maintained separately in:

`../tool_links/external_links.json`
## Code marker convention

For maintainability, complex HTML pages may include non-rendered HTML comments that mark the internal structure:

- `CODE MAP` near the beginning of `<body>` summarizes the page structure.
- `CHAPTER` marks the Moodle Book chapter/subchapter page.
- `PART 00`, `PART 01`, etc. mark major content blocks.
- `SECTION 01.01`, `SECTION 01.02`, etc. mark smaller maintainable sections.
- `PART JS` and `JS PART 00`, `JS PART 01`, etc. mark JavaScript logic blocks when a page uses interactive code.

These comments are intentionally kept as HTML/JS comments and should not affect Moodle rendering.
## JSXGraph Moodle loading note

The JSXGraph chapter is self-contained. CDN loading was removed because Moodle Book may block external JS/CSS.

- `jsxgraphcore.js` is embedded inline in `01_PreLab_05_JSXGraph_sub.html`.
- `jsxgraph.css` is embedded inline in the page `<style>` block.
- If Moodle still does not render the graph, the site is likely filtering inline `<script>` tags completely. Use an external HTML resource/link in that case.
