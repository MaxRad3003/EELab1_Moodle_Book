# סיכום עבודה - ניסוי 3: מכשירי מדידה בזרם חילופין (AC)

תאריך עבודה: 2026-06-11

## מטרת הניסוי
ניסוי 3 עוסק במעבר ממדידות DC למדידות AC בעזרת אוסצילוסקופ, מחולל אותות ורב-מודד. הניסוי מכסה מדידת מתח, RMS, תדר, זמן מחזור, הפרש מופע, עקומות ליסז'ו, מצב X-Y, אופיין I-V של LED, קופסה שחורה ושנאי בידוד.

## כלים רלוונטיים
- Moodle Book
- Moodle Question XML
- Tinkercad Circuits Class
- Falstad Circuit Simulator
- MATLAB Grader
- JSXGraph (אינטראקטיביות RMS)

## קבצים ותוצרים שנוצרו
- `moodle_book_import_v2/` - גרסת Moodle Book מלאה ומשופרת.
- `Exp03_Moodle_Book_Import.zip` - קובץ ZIP מוכן לייבוא ל-Moodle Book.
- `moodle_book_import_v2/Exp03_AC_Quiz.xml` - קובץ שאלות Moodle Question XML.

## שיפורים ושילוב תוכן (RMS)
- **שילוב פרק ה-RMS האינטראקטיבי:** התוכן מהקובץ `tests/Exp03_RMS/RMS_test.html` (גרסה 1) שולב לתוך `01_PreLab_01_Definitions_sub.html`.
- **הדמיות JSXGraph:** נוספו לוחות אינטראקטיביים המאפשרים לסטודנטים להשוות בין מקור AC למקור DC שקול מבחינת הספק וחימום נגד.
- **הסברים מתמטיים משופרים:** נוספה ההגדרה המדויקת של RMS (Root Mean Square) עם שלבי החילוץ הפיזיקליים.
- **איורים ווקטוריים (SVG):** שולב איור המציג את הקשר בין מתח שיא (\(V_p\)) לערך אפקטיבי (\(V_{RMS}\)).
- **פונקציית תמסורת מתוך אלגברה ליניארית:** בעמוד תוכנית העבודה נוסף הסבר על כתיבת מעגל RC כמערכת \(A x=b\), פתרון בתחום הפאזורים, וחילוץ \(H_C(j\omega)=V_C/V_{in}\).

## בדיקות שבוצעו
גרסת `moodle_book_import_v2` נבדקה ונמצאה תקינה:
- יש `DOCTYPE` ו-`html lang="he" dir="rtl"` בכל קובץ.
- כל קישורי הניווט אומתו ונוקו מכפילויות.
- סקריפטים חיצוניים (MathJax, JSXGraph) נטענים כראוי בפרק ההגדרות.
- ה-ZIP מכיל 18 קבצי HTML מעודכנים.

## ZIP לייבוא Moodle Book
קובץ הייבוא המעודכן:
`../Exp03/Exp03_Moodle_Book_Import.zip`

## מצב נוכחי
ניסוי 3 מוכן כגרסת Moodle Book אינטראקטיבית. בוטלו שינויי הסימון ההיררכי (H1/H2) והוחזרה גרסת ה-RMS המקורית (v1) לבקשת המשתמש.

## עדכון אחרון - PreLab H5P, Question Bank והפצה ל-Moodle

נשמר לאחר הכנת מערך הערכה מלא לפרקי ה-PreLab של ניסוי 3.

### פעולות שבוצעו

- נבנו 9 חבילות H5P, אחת לכל תת-פרק PreLab:
  - Definitions
  - Oscilloscope Guide
  - RMS
  - Conversions
  - DMM
  - Work Plan
  - Simulation
  - Mistakes
  - Readiness
- בכל חבילת H5P נבנו 5 שאלות רב-ברירה.
- נבנה מאגר שאלות Moodle XML סופי ל-PreLab:
  - `moodle_book_import_v2/Exp03_PreLab_Question_Bank.xml`
  - סך הכל 45 שאלות.
- נוספו בלוקים בכל עמוד PreLab שמציינים את קובץ ה-H5P המתאים להעלאה ל-Moodle.
- נוסף סקריפט יצירה:
  - `scripts/generate_exp03_prelab_assessments.js`
- נוסף סקריפט הפצה:
  - `scripts/package_exp03_moodle_release.ps1`
- נוצר ZIP לייבוא Moodle Book:
  - `Exp03_Moodle_Book_Import.zip`
- נוצרה חבילת הפצה מלאה:
  - `dist/release/Exp03_Moodle_Distribution`
  - `dist/release/Exp03_Moodle_Distribution.zip`

### הפעלה חוזרת

לאחר עריכת שאלות, יש להריץ:

```powershell
node scripts\generate_exp03_prelab_assessments.js
.\scripts\package_exp03_moodle_release.ps1
```

### קבצים להעלאה ל-Moodle

- Moodle Book:
  - `Exp03_Moodle_Book_Import.zip`
- H5P:
  - כל הקבצים בתיקיית `H5P_Quiz`
- Moodle Question Bank:
  - `Exp03_PreLab_Question_Bank.xml`
