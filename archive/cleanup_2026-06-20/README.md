# Cleanup archive - 2026-06-20

This archive keeps files that were moved out of the active project tree during the cleanup.
Nothing here was deleted; these files are retained for comparison or recovery.

## Active Exp01 sources left in place

- `src/content/EELab1/Exp01/moodle_book_import_v2`
- `src/content/EELab1/Exp01/01_PreLab/Moodle Quix _XML/Exp01_PreLab_Quiz.xml`
- `src/content/EELab1/Exp01/tool_links/external_links.json`
- `src/content/EELab1/Exp01/tool_links/Link_Manager.html`
- `src/content/EELab1/Exp01/build_exp01_zip_ordered.ps1`

## Moved here

- `src_content/EELab1/Exp01/old_structured_pages` - old Exp01 page tree replaced by `moodle_book_import_v2`.
- `src_content/EELab1/Exp01/old_moodle_book_import` - older Moodle import package replaced by `moodle_book_import_v2`.
- `src_content/EELab1/Exp01/misplaced_exp02_snapshots` - Exp02 snapshot files that were sitting under Exp01.
- `src_content/EELab1/Exp02/snapshots` - rollback/snapshot HTML files from Exp02.
- `src_content/EELab1/Exp01/old_manuals` and `src_content/EELab1/old_manuals` - duplicate old lab manual copies.
- `src_content/EELab1/Exp01/old_tool_links` - superseded Exp01 link files.
- `src_content/Temp.html` - temporary file.
- `dist_before_rebuild/EELab1/Exp01` - previous Exp01 distribution output, archived before rebuilding a clean `dist`.

## Notes

- `src` keeps local equipment links for editing.
- `dist` and `release` are built with Moodle equipment links from `src/content/EELab1/Moodle_Measuring_equipment_links.txt`.
- The current Exp01 release is rebuilt under `release/Exp01_2026-06-20`.
