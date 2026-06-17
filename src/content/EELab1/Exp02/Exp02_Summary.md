# סיכום ניסוי 2

ניסוי 2 עוסק במשפטי רשת ורכיבים לא-ליניאריים. המטרה היא לחבר בין ניתוח תאורטי, סימולציה, מימוש מעשי, מדידות ועיבוד נתונים.

## נושאי הניסוי

- אלגברה ליניארית לפתרון מעגלים רב-חוגיים.
- משפט הסופרפוזיציה.
- משפט תבנין והעברת הספק מקסימלי.
- פונקציית תמסורת.
- אופיין מתח-זרם \(I-V\) של רכיבים שונים.
- הבחנה בין רכיב ליניארי לרכיב לא-ליניארי.

## מה הסטודנט עושה

בשלב ההכנה הסטודנט לומד את הרקע התאורטי, מבצע סימולציות Falstad/Tinkercad, ועונה על שאלות Moodle Question. בשלב המעבדה הוא בונה מעגלים, מודד מתחים וזרמים, מאמת את המשפטים, ובוחן אופיין \(I-V\). לאחר מכן הוא מעבד את הנתונים בדוח מסכם ומשווה בין תאוריה, סימולציה ומדידה.

## כלים משולבים

- Moodle Book לפרקי הלימוד.
- Moodle Question XML לשאלות.
- Falstad לסימולציות מהירות.
- Tinkercad לבניית וחיווט מעגלים.
- MATLAB Grader / MATLAB לעיבוד נתונים וניתוח.

## חלקי הניסוי

- חלק א: אימות משפט הסופרפוזיציה ומאזן הספקים.
- חלק ב: מציאת שקול תבנין, מדידת \(V_{TH}\), \(R_{TH}\), ובדיקת העברת הספק מקסימלי.
- חלק ג: מדידת אופיין \(I-V\) לנגד, נורת להט ותרמיסטור NTC, כולל חישוב התנגדות סטטית ודינמית.

## תוצרי הניסוי

- טבלאות מדידה.
- גרפים של \(I\) כפונקציה של \(V\).
- חישובי \(R_{static}\), \(R_{dynamic}\), \(V_{TH}\), \(R_{TH}\).
- השוואה בין תאוריה, סימולציה ומדידה.
- דוח מסכם עם מסקנות.
## עדכון אחרון - JSXGraph, הספקים ו-Tinkercad

נשמר בתאריך 2026-06-09 01:44 לאחר שיפור פרק ההכנה של ניסוי 2 והוספת המחשות אינטראקטיביות.

### קבצים מרכזיים שעודכנו

- `moodle_book_import_v2/01_PreLab.html` - נוסף פרק JSXGraph לתוכן העניינים כשלב 05; תוכנית העבודה הוזזה לשלב 06.
- `moodle_book_import_v2/01_PreLab_04_NonLinear_sub.html` - ניווט "הבא" עודכן לפרק JSXGraph.
- `moodle_book_import_v2/01_PreLab_05_JSXGraph_sub.html` - פרק חדש/מעודכן עם המחשות אינטראקטיביות.
- `moodle_book_import_v2/01_PreLab_05_WorkPlan_sub.html` - נוסף iframe של Tinkercad וקישור פתיחה ישיר.
- `moodle_book_import_v2/README_Moodle_Book_Import.md` - סדר הפרקים עודכן.
- `Exp02_Moodle_Book_Import.zip` - נבנה מחדש ומוכן להעלאה ל-Moodle Book.

### מה נוסף בפרק JSXGraph

- גרף קו עומס ונקודת עבודה באופיין \(I-V\).
- המחשת שטח כתום: הספק על העומס, \(P_L=V_Q\cdot I_Q\).
- המחשת שטח אדום: הספק שנופל על שקול המקור/\(R_{TH}\), לפי \(P_{RTH}=(V_{TH}-V_Q)\cdot I_Q\).
- הצגת \(P_{total}\) ב-readout.
- גרף העברת הספק מקסימלי לעומס.
- גרף נצילות ירוק באותו לוח, בסקאלה `eta [%] / 4`.
- סימון נקודת \(R_L=R_{TH}\), שבה מתקבל \(P_{max}\) אך הנצילות היא \(50\%\).
- הסבר פיזיקלי: הספק מקסימלי אינו נצילות מקסימלית.

### דגשי יחידות שנשמרו

- מתח בציר \(V\) נמדד ב-V.
- זרם בציר \(I\) מוצג ב-mA, אך לחישוב W יש להמיר ל-A.
- שטח בגרף \(V\cdot mA\) מתקבל ב-mW.
- נצילות \(\eta\) היא אחוזים וחסרת יחידות.
- \(R=\Delta V/\Delta I\) מתקבל ב-\(\Omega\).

### Tinkercad

נוסף ל"מדריך חיבורים ותוכנית עבודה ב-Tinkercad":

```html
<iframe width="450" height="280" src="https://www.tinkercad.com/embed/dsMkY079Oz3?editbtn=1" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>
```

נוסף גם קישור ישיר למקרה שהטמעה נחסמת ב-Moodle:

`https://www.tinkercad.com/things/dsMkY079Oz3`

### גיבויים שנוצרו סביב העבודה האחרונה

- `Exp02_before_jsxgraph_20260609_004019.zip`
- `Exp02_JSXGraph_before_power_area_20260609_010703.html`
- `Exp02_JSXGraph_before_source_power_area_20260609_011706.html`
- `Exp02_JSXGraph_before_efficiency_20260609_012324.html`
- `Exp02_WorkPlan_before_tinkercad_iframe_20260609_013623.html`

### מצב נוכחי

החבילה `Exp02_Moodle_Book_Import.zip` נבנתה מחדש לאחר כל השינויים. סדר הפרקים ב-ZIP נבדק ונמצא תקין:

1. `00_Intro.html`
2. `01_PreLab.html`
3. `01_PreLab_00_LinearAlgebra_sub.html`
4. `01_PreLab_01_Superposition_sub.html`
5. `01_PreLab_02_Thevenin_sub.html`
6. `01_PreLab_03_TransferFunction_sub.html`
7. `01_PreLab_04_NonLinear_sub.html`
8. `01_PreLab_05_JSXGraph_sub.html`
9. `01_PreLab_05_WorkPlan_sub.html`
10. `02_InLab.html`
11. `02_InLab_00_PartA_Superposition_sub.html`
12. `02_InLab_01_PartB_Thevenin_sub.html`
13. `02_InLab_02_PartC_IV_sub.html`
14. `03_PostLab.html`
15. `04_References.html`


### סימון קוד לתחזוקה

נוסף סימון קוד פנימי בקבצי HTML המרכזיים של Exp02:

- `CODE MAP` בתחילת גוף הקובץ לתיאור מבנה העמוד.
- `CHAPTER`, `PART`, `SECTION` לסימון פרק, חלק וסעיף.
- `PART JS` ו-`JS PART` לסימון אזורי JavaScript בפרק JSXGraph.

הסימון נוסף כ-comments בלבד ואינו משנה את תצוגת Moodle. הכלל תועד גם ב-`moodle_book_import_v2/README_Moodle_Book_Import.md`.
### בדיקה חשובה להמשך

צריך לבדוק במערכת Moodle בפועל האם Book מאפשר הרצת JavaScript וטעינת CDN של JSXGraph. אם Moodle חוסם זאת, אפשר לעבור לאחת משתי חלופות:

- העלאת קבצי JSXGraph מקומיים במקום CDN.
- קישור לפרק HTML חיצוני שמריץ את ההמחשות מחוץ ל-Moodle Book.
### תיקון טעינת JSXGraph ב-Moodle

לאחר העלאה ל-Moodle התקבלה ההודעה: "JSXGraph לא נטען. בדקו האם Moodle חסם script/CDN." המשמעות: ה-script הפנימי בעמוד רץ, אך טעינת הספרייה מה-CDN נחסמה.

בוצע תיקון:

- הוסרה התלות ב-`https://cdn.jsdelivr.net/npm/jsxgraph/...`.
- `jsxgraphcore.js` הוטמע ישירות בתוך `01_PreLab_05_JSXGraph_sub.html`.
- `jsxgraph.css` הוטמע בתוך `<style>` באותו קובץ.
- העמוד הפך ל-self-contained HTML ומתאים יותר לייבוא Moodle Book.

אם גם לאחר פתרון זה Moodle לא מציג את הגרפים, המשמעות היא שמערכת Moodle מסננת `<script>` מוטמעים באופן מלא. במקרה כזה יש לעבור לחלופה: קישור לקובץ HTML חיצוני או משאב נפרד שלא עובר דרך מסנן התוכן של Book.
