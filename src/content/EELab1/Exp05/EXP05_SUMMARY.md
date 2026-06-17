# סיכום עבודה - ניסוי 5: מדידות במעגלי תהודה

תאריך עבודה: 2026-06-08

## מקור
נבנה על סמך `מעבדה לחשמל 1 חוברת ישנה.pdf`, פרק 5: מדידות במעגלי תהודה, ובעזרת מבנה Moodle Book שפותח בניסויים 1-3.

## נושא הניסוי
מדידות במעגלי RLC: תהודה טורית ומקבילית, תדר תהודה, תדרי חצי הספק, רוחב פס, גורם טיב, תגובת תדר והפרש מופע.

## מבנה Moodle Book
1. `00_Intro.html` - פתיחה ומטרות.
2. `01_PreLab.html` - אינדקס הכנה.
3. `01_PreLab_01_ResonanceBasics_sub.html` - מושגי תהודה, `f0`, רוחב פס ו-Q.
4. `01_PreLab_02_SeriesRLC_sub.html` - מעגל RLC טורי.
5. `01_PreLab_03_ParallelRLC_sub.html` - מעגל RLC מקבילי.
6. `01_PreLab_04_Simulation_sub.html` - פעילות סימולציה.
7. `01_PreLab_05_Readiness_sub.html` - בדיקת מוכנות.
8. `02_InLab.html` - אינדקס המעבדה.
9. `02_InLab_01_SeriesResonance_sub.html` - מדידות במעגל תהודה טורי.
10. `02_InLab_02_HalfPower_sub.html` - תדרי חצי הספק ורוחב פס.
11. `02_InLab_03_PhaseResponse_sub.html` - תגובת תדר והפרש מופע.
12. `02_InLab_04_XYSweep_sub.html` - סריקת תדר ב-X-Y.
13. `03_PostLab.html` - סיכום והגשת דו"ח.
14. `04_References.html` - מקורות.

## תוצרים
- `moodle_book_import_v2/` - קבצי HTML מלאים ל-Moodle Book.
- `Exp05_Moodle_Book_Import.zip` - ZIP לייבוא Moodle Book.
- `00_PreLab/Moodle Quix _XML/Exp05_Resonance_Quiz.xml` - שאלות Moodle Question XML.
- `moodle_book_import_v2/Exp05_Resonance_Quiz.xml` - עותק נוח של קובץ השאלות, לא כלול ב-ZIP.

## בדיקות
- HTML מלא עם `DOCTYPE`, `lang="he"`, `dir="rtl"`.
- אין `h1/h2`.
- אין CSS variables מסוג `var(--...)`.
- אין קישורים פנימיים שבורים.
- ZIP כולל קבצי HTML בלבד ובסדר ייבוא נכון.

## המשך מומלץ
- להוסיף קישור Falstad ספציפי למעגל RLC טורי.
- להוסיף פעילות MATLAB Grader לחישוב `f0`, `fL`, `fH`, `Q` ושרטוט תגובת תדר.
- להוסיף המחשות גרפיות של עקומת תהודה ורוחב פס.

## עדכון שיפור - 2026-06-08
- חוזק inline CSS באלמנטים מרכזיים.
- נוספה המחשת SVG של עקומת תהודה, fL, f0, fH ורוחב פס.
- נוסף קוד MATLAB קצר לפעילות סימולציה של RLC טורי.
- נוסף הסבר חישוב מופע מתוך הפרש זמן.
- ZIP נבנה מחדש ונבדק.

## תיקון ניווט - 2026-06-08
- כפתורי הניווט הומרו מ-href/style במרכאות יחידות למרכאות כפולות, כדי לשפר תאימות ל-Moodle importer/editor.
- נבדקו כל הקישורים הפנימיים, כולל כפתורי קודם/הבא/תוכן עניינים.
- Exp05_Moodle_Book_Import.zip נבנה מחדש.
