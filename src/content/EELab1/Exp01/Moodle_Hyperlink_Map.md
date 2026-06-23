# Moodle Hyperlink Maintenance Directory - Experiment 01

This document centralizes all internal and external hyperlinks used in the Moodle book for Experiment 01. 
Update this list whenever IDs or external simulation links change.

## Link Management UI

Use `tool_links/Link_Manager.html` to edit external links through a local browser UI.

Source of truth for external activity links:

`tool_links/external_links.json`

Recommended workflow:

1. Open `tool_links/Link_Manager.html` in the browser.
2. Load `tool_links/external_links.json`.
3. Update Moodle, Tinkercad, Falstad, MATLAB Grader, or assignment URLs.
4. Save the JSON back as `external_links.json`.
5. Copy a ready Moodle Book hyperlink or inline-CSS button from the UI.
6. Use the generated Markdown table to update this document when needed.

## 🛠️ Global Equipment Links (DMM & Power Supply)
These links appear in almost every document. They point to the core equipment guide in the Moodle book.

*   **URL:** `https://moodle.sce.ac.il/mod/book/view.php?id=1215505`
*   **Target:** Chapter: Equipment Guide (DMM, Power Supply)
*   **Terms linked to this URL:**
    *   `רב-מודד`
    *   `DMM`
    *   `ספק כוח`
    *   `DC Power Supply`

## 🔗 Internal Navigation Links
Links that connect different pages within the Experiment 01 module.

| Target File | Link Text | Current href | Location |
| :--- | :--- | :--- | :--- |
| `00_Intro.html` | חזרה למבוא לניסוי | `../00_Intro.html` | PreLab/PostLab Index |
| `01_PreLab_index_sub.html` | חזרה לתוכן העניינים | `index_sub.html` | PreLab Chapters |
| `index_sub.html` | חזרה לתוכן העניינים | `index_sub.html` | InLab Chapters |
| `PreLab_Exp01_00_Safety_sub.html` | בטיחות ונהלים במעבדה | `PreLab_Exp01_00_Safety_sub.html` | PreLab Index |
| `PreLab_Exp01_01_ColorCode_sub.html` | נגדים וקוד צבעים | `PreLab_Exp01_01_ColorCode_sub.html` | PreLab Index |
| `PreLab_Exp01_02_Equipment_sub.html` | הכרת מכשירי המדידה | `PreLab_Exp01_02_Equipment_sub.html` | PreLab Index |
| `PreLab_Exp01_03_Breadboard_sub.html` | המטריצה (Breadboard) | `PreLab_Exp01_03_Breadboard_sub.html` | PreLab Index |
| `PreLab_Exp01_04_Tinkercad_sub.html` | התנסות וירטואלית (Tinkercad) | `PreLab_Exp01_04_Tinkercad_sub.html` | PreLab Index |

## 🌐 External Links & Simulations
Links pointing to external tools or simulations.

| Platform | Link Text | Current URL | Location |
| :--- | :--- | :--- | :--- |
| **Tinkercad** | פתיחת פעילות Tinkercad | `https://www.tinkercad.com/things/3Ehb7iogzWc-basic-` | `01_PreLab_Exp01_04_Tinkercad_sub.html` |
| **Tinkercad Embed** | הטמעת פעילות Tinkercad בפרק | `https://www.tinkercad.com/embed/3Ehb7iogzWc?editbtn=1` | `01_PreLab_Exp01_04_Tinkercad_sub.html` |
| **Moodle Quiz** | חידון ההכנה יופיע כפעילות נפרדת במודל | `TBD_IN_MOODLE` | `01_PreLab_index_sub.html` |
| **Moodle Question XML** | חידון הכנה: בטיחות, קוד צבעים וחיבורי מדידה | `01_PreLab/Moodle Quix _XML/Exp01_PreLab_Quiz.xml` | `01_PreLab_index_sub.html` |
| **Falstad** | סימולציות חיבור טורי/מקבילי, קצר ונתק | `TBD_IN_MOODLE` | `02_InLab_Exp01_02_PartC_sub.html` |
| **MATLAB Grader** | עיבוד מדידות, חישוב סטייה יחסית וארגון תוצאות | `TBD_IN_MOODLE` | `03_PostLab_Exp01_00_Report_sub.html` |
| **Moodle Assignment** | הגשת הדוח המסכם | `TBD_IN_MOODLE` | `03_PostLab_Exp01_00_Report_sub.html` |

---
*Last Updated: June 5, 2026*
