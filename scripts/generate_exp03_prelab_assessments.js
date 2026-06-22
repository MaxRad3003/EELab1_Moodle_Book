const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const templateSrc = path.join(root, 'h5p_src', 'Exp03_AC_Quiz_src');
const outRoot = path.join(root, 'h5p_src', 'Exp03_PreLab_H5P');
const packageOut = path.join(root, 'src', 'content', 'EELab1', 'Exp03', 'moodle_book_import_v2', 'H5P_Quiz');
const xmlOut = path.join(root, 'src', 'content', 'EELab1', 'Exp03', 'moodle_book_import_v2', 'Exp03_PreLab_Question_Bank.xml');
const bookDir = path.join(root, 'src', 'content', 'EELab1', 'Exp03', 'moodle_book_import_v2');

const dependencies = [
  'FontAwesome-4.5',
  'H5P.FontIcons-1.0',
  'H5P.JoubelUI-1.3',
  'H5P.MultiChoice-1.16',
  'H5P.Question-1.5',
  'H5P.QuestionSet-1.20',
  'H5P.Transition-1.0',
  'H5P.Video-1.6',
];

const behaviour = {
  enableRetry: true,
  enableSolutionsButton: true,
  enableCheckButton: true,
  type: 'auto',
  singlePoint: false,
  randomAnswers: true,
  showSolutionsRequiresInput: true,
  confirmCheckDialog: false,
  confirmRetryDialog: false,
  autoCheck: false,
  passPercentage: 100,
  showScorePoints: true,
};

const ui = {
  checkAnswerButton: 'בדוק',
  submitAnswerButton: 'הגש',
  showSolutionButton: 'הצג פתרון',
  tryAgainButton: 'נסה שוב',
  tipsLabel: 'הצג רמז',
  scoreBarLabel: 'קיבלת :num מתוך :total נקודות',
  tipAvailable: 'רמז זמין',
  feedbackAvailable: 'משוב זמין',
  readFeedback: 'קרא משוב',
  wrongAnswer: 'תשובה שגויה',
  correctAnswer: 'תשובה נכונה',
  shouldCheck: 'היה צריך לסמן',
  shouldNotCheck: 'לא היה צריך לסמן',
  noInput: 'אנא ענה לפני צפייה בפתרון',
  a11yCheck: 'בדוק את התשובות.',
  a11yShowSolution: 'הצג את הפתרון.',
  a11yRetry: 'נסה שוב.',
};

const texts = {
  prevButton: 'הקודם',
  nextButton: 'הבא',
  finishButton: 'סיים',
  submitButton: 'הגש',
  textualRepresentationOfProgress: 'שאלה :current מתוך :total',
  closeButtonLabel: 'סגור',
  cancelButtonLabel: 'ביטול',
  confirmButtonLabel: 'אישור',
  feedbackHeader: 'משוב',
  solutionHeader: 'פתרון',
  scoreBarLabel: 'הניקוד שלך: :num/:total',
};

const chapters = [
  chapter('01_definitions', 'Exp03_PreLab_01_Definitions_H5P', 'ניסוי 3 - PreLab 01: מושגי AC בסיסיים', 'חמש שאלות על גל מחזורי, זמן מחזור, תדר, שיא וערך שיא-לשיא.', [
    q('מהו זמן מחזור \\(T\\) של אות מחזורי?', [a('הזמן הדרוש להשלמת מחזור אחד של האות.', true, 'נכון. לאחר זמן מחזור אחד צורת הגל חוזרת על עצמה.'), a('המתח המרבי של האות.', false, 'זהו מתח שיא, לא זמן מחזור.'), a('מספר המחזורים בשנייה.', false, 'זהו תדר.'), a('הפרש המופע בין שני אותות.', false, 'הפרש מופע נמדד בזמן או במעלות.')]),
    q('מה הקשר בין תדר \\(f\\) לזמן מחזור \\(T\\)?', [a('\\(f=1/T\\)', true, 'נכון. כאשר T בשניות, f מתקבל בהרץ.'), a('\\(f=T\\)', false, 'תדר וזמן מחזור הם גדלים הופכיים.'), a('\\(f=V_p/T\\)', false, 'מתח השיא אינו חלק מהגדרת התדר.'), a('\\(T=R/f\\)', false, 'התנגדות אינה קשורה להגדרת התדר.')]),
    q('מהו \\(V_{pp}\\) בגל AC?', [a('ההפרש בין הערך המרבי לערך המזערי של המתח.', true, 'נכון. בגל סימטרי \\(V_{pp}=2V_p\\).'), a('הערך האפקטיבי של המתח.', false, 'זהו RMS.'), a('הממוצע של המתח לאורך מחזור.', false, 'בגל סימטרי הממוצע יכול להיות אפס.'), a('הזרם דרך הנגד.', false, 'זהו גודל אחר.')]),
    q('בגל סינוס סימטרי סביב אפס, מהו הממוצע של \\(v(t)\\) לאורך מחזור שלם?', [a('אפס.', true, 'נכון. החלק החיובי והחלק השלילי מתאזנים.'), a('\\(V_p\\)', false, 'זהו מתח שיא.'), a('\\(V_{RMS}\\)', false, 'RMS אינו ממוצע פשוט של המתח.'), a('\\(V_{pp}\\)', false, 'זהו שיא-לשיא.')]),
    q('מדוע חשוב להבדיל בין ערך רגעי לבין ערך אפקטיבי?', [a('כי הספק וחימום נקבעים לפי הערך האפקטיבי לאורך זמן.', true, 'נכון. ערך רגעי משתנה ואינו מספיק לחישובי הספק ממוצע.'), a('כי ערך רגעי תמיד גדול מ-RMS.', false, 'לא תמיד. הוא יכול להיות גם אפס או שלילי.'), a('כי RMS קיים רק ב-DC.', false, 'RMS חשוב במיוחד במדידות AC.'), a('כי תדר נמדד בוולט.', false, 'תדר נמדד בהרץ.')]),
  ]),
  chapter('02_oscilloscope', 'Exp03_PreLab_02_Oscilloscope_H5P', 'ניסוי 3 - PreLab 02: אוסצילוסקופ', 'חמש שאלות על מדידת מתח, זמן, תדר וכוונון תצוגה באוסצילוסקופ.', [
    q('איזה ציר באוסצילוסקופ מייצג זמן?', [a('הציר האופקי.', true, 'נכון. הציר האופקי הוא ציר הזמן.'), a('הציר האנכי.', false, 'הציר האנכי מייצג מתח.'), a('כפתור העוצמה.', false, 'זה אינו ציר מדידה.'), a('כניסת האדמה בלבד.', false, 'האדמה היא נקודת ייחוס.')]),
    q('מה מודד כיוון Volts/Div?', [a('כמה וולט מייצגת כל משבצת אנכית.', true, 'נכון. זה קובע את קנה המידה האנכי.'), a('כמה שניות מייצגת כל משבצת.', false, 'זהו Time/Div.'), a('את תדר האות ישירות.', false, 'תדר מחושב מהמחזור או נמדד בכלי מדידה.'), a('את התנגדות הגשש.', false, 'זה אינו תפקיד הכיוון הזה.')]),
    q('כיצד מחשבים תדר מתוך מדידת מחזור באוסצילוסקופ?', [a('מודדים \\(T\\) ומחשבים \\(f=1/T\\).', true, 'נכון. יש להקפיד על יחידות.'), a('מכפילים מתח בזמן.', false, 'זה אינו תדר.'), a('מחלקים \\(V_{pp}\\) ב-2.', false, 'זה נותן \\(V_p\\) בגל סימטרי.'), a('קוראים רק את מספר המשבצות האנכיות.', false, 'צריך את הציר האופקי.')]),
    q('מה מטרת חיבור האדמה של הגשש?', [a('לקבוע נקודת ייחוס משותפת למדידה.', true, 'נכון. האוסצילוסקופ מודד מתח ביחס לאדמה.'), a('להגדיל את התדר.', false, 'האדמה אינה משנה את התדר.'), a('לבטל את כל המתח במעגל.', false, 'חיבור שגוי עלול לגרום קצר, אך זו אינה המטרה.'), a('להפוך AC ל-DC.', false, 'זה אינו תפקיד האדמה.')]),
    q('מה חשוב לבדוק לפני חיבור גשש למעגל?', [a('שהאדמה אינה יוצרת קצר ושקנה המידה מתאים לאות.', true, 'נכון. זו בדיקה בטיחותית ומעשית.'), a('שה-Time/Div תמיד על מינימום.', false, 'קנה המידה תלוי באות.'), a('שהמתח תמיד 0V.', false, 'לא זו מטרת המדידה.'), a('שאין צורך באישור מדריך.', false, 'במעבדה יש לקבל אישור לפי הנהלים.')]),
  ]),
  chapter('03_rms', 'Exp03_PreLab_03_RMS_H5P', 'ניסוי 3 - PreLab 03: RMS והספק', 'חמש שאלות על ערך אפקטיבי, צורות גל והשוואת AC ל-DC.', [
    q('מה פירוש ערך RMS של מתח AC?', [a('מתח DC שקול שמפתח אותו הספק ממוצע על אותו נגד.', true, 'נכון. זו המשמעות הפיזיקלית של RMS.'), a('המתח המרבי של האות.', false, 'זהו \\(V_p\\).'), a('המתח שיא-לשיא.', false, 'זהו \\(V_{pp}\\).'), a('הממוצע הפשוט של המתח.', false, 'בגל סימטרי הממוצע הפשוט יכול להיות אפס.')]),
    q('מהו \\(V_{RMS}\\) של גל סינוס ללא offset?', [a('\\(V_p/\\sqrt{2}\\)', true, 'נכון.'), a('\\(V_p\\)', false, 'זה נכון לגל ריבועי סימטרי.'), a('\\(V_p/\\sqrt{3}\\)', false, 'זה מתאים לגל משולש סימטרי.'), a('\\(2V_p\\)', false, 'זהו \\(V_{pp}\\).')]),
    q('מהו \\(V_{RMS}\\) של גל ריבועי סימטרי שערכיו \\(+V_p\\) ו-\\(-V_p\\)?', [a('\\(V_p\\)', true, 'נכון. הריבוע של המתח קבוע.'), a('\\(V_p/\\sqrt{2}\\)', false, 'זה מתאים לסינוס.'), a('אפס', false, 'הממוצע של המתח אפס, אבל RMS אינו אפס.'), a('\\(V_{pp}\\)', false, 'זהו שיא-לשיא.')]),
    q('באיזו נוסחה משתמשים להספק ממוצע על נגד?', [a('\\(P_{avg}=V_{RMS}^2/R\\)', true, 'נכון.'), a('\\(P=V_{pp}/R\\)', false, 'שיא-לשיא אינו נכנס כך לחישוב הספק.'), a('\\(P=fT\\)', false, 'זהו קשר חסר יחידות להספק.'), a('\\(P=R/V\\)', false, 'זו אינה נוסחת הספק.')]),
    q('בשקע רשת של \\(230V\\), למה הכוונה בדרך כלל?', [a('230V RMS.', true, 'נכון. בשקע רשת הערך הנקוב הוא אפקטיבי.'), a('230V שיא.', false, 'השיא בסינוס הוא בערך 325V.'), a('230V שיא-לשיא.', false, 'שיא-לשיא בסינוס רשת הוא בערך 650V.'), a('230Hz.', false, 'זהו מתח, לא תדר.')]),
  ]),
  chapter('04_conversions', 'Exp03_PreLab_04_Conversions_H5P', 'ניסוי 3 - PreLab 04: המרות יחידות', 'חמש שאלות על המרות זמן, תדר ומתח במדידות AC.', [
    q('מהו תדר של אות שזמן המחזור שלו \\(T=2ms\\)?', [a('500Hz', true, 'נכון. \\(1/0.002=500\\).'), a('2Hz', false, 'יש להמיר מילישניות לשניות.'), a('0.5Hz', false, 'זה אינו החישוב הנכון.'), a('2000Hz', false, 'זה היה נכון ל-0.5ms.')]),
    q('אם \\(V_{pp}=10V\\) בגל סינוס סימטרי, מהו \\(V_p\\)?', [a('5V', true, 'נכון. \\(V_p=V_{pp}/2\\).'), a('10V', false, 'זהו שיא-לשיא.'), a('20V', false, 'כיוון ההמרה הפוך.'), a('7.07V', false, 'זהו ערך RMS עבור \\(V_p=10V\\), לא כאן.')]),
    q('מהו \\(V_{RMS}\\) בקירוב עבור גל סינוס עם \\(V_p=10V\\)?', [a('7.07V', true, 'נכון. \\(10/\\sqrt{2}\\).'), a('10V', false, 'זהו השיא.'), a('14.14V', false, 'זהו \\(10\\sqrt{2}\\).'), a('20V', false, 'זהו שיא-לשיא.')]),
    q('איזו המרה נכונה?', [a('1kHz = 1000Hz', true, 'נכון.'), a('1ms = 1s', false, '1ms הוא אלפית שנייה.'), a('1V = 1000kV', false, 'הכיוון הפוך.'), a('1MHz = 1000Hz', false, '1MHz הוא מיליון הרץ.')]),
    q('מה חשוב לעשות לפני הצבה בנוסחאות?', [a('להמיר יחידות לבסיס מתאים כמו שניות, הרץ, וולט ואוהם.', true, 'נכון. טעויות יחידות הן מקור נפוץ לשגיאות.'), a('להתעלם מיחידות.', false, 'יחידות הן חלק מהחישוב.'), a('להשתמש תמיד במילישניות.', false, 'תלוי בנוסחה.'), a('להציב \\(V_{pp}\\) במקום RMS.', false, 'זה ייתן הספק שגוי.')]),
  ]),
  chapter('05_dmm', 'Exp03_PreLab_05_DMM_H5P', 'ניסוי 3 - PreLab 05: רב-מודד ו-True RMS', 'חמש שאלות על מדידות AC ברב-מודד ומגבלות מכשיר.', [
    q('מה מודד רב-מודד במצב ACV בדרך כלל?', [a('ערך RMS של המתח בתחום התדרים שהמכשיר תומך בו.', true, 'נכון. יש לבדוק את מפרט המכשיר.'), a('תמיד מתח שיא.', false, 'מדידת ACV מוצגת לרוב כ-RMS.'), a('רק מתח DC.', false, 'מצב ACV מיועד ל-AC.'), a('התנגדות המעגל.', false, 'זה מצב מדידה אחר.')]),
    q('מה היתרון של מד True RMS?', [a('מדידה מדויקת יותר גם לצורות גל שאינן סינוס טהור, בתחום המכשיר.', true, 'נכון.'), a('הוא מבטל צורך ביחידות.', false, 'עדיין צריך יחידות.'), a('הוא מודד רק DC.', false, 'הוא שימושי במיוחד ב-AC.'), a('הוא הופך את התדר לאפס.', false, 'לא.')]),
    q('מדוע מד שאינו True RMS עלול לטעות בגל ריבועי?', [a('כי הוא מכויל לרוב להנחת גל סינוס.', true, 'נכון. צורת גל שונה משנה את היחס בין ממוצע, שיא ו-RMS.'), a('כי גל ריבועי אינו מתח.', false, 'גל ריבועי הוא צורת מתח אפשרית.'), a('כי אין לו תדר.', false, 'לגל ריבועי יש תדר.'), a('כי \\(V_{RMS}\\) תמיד אפס.', false, 'לא נכון.')]),
    q('מה יש לבדוק במפרט הרב-מודד לפני מדידת AC?', [a('תחום תדרים, תחום מתח, ויכולת True RMS.', true, 'נכון.'), a('צבע המכשיר.', false, 'לא רלוונטי למדידה.'), a('אורך הכבל בלבד.', false, 'לא מספיק.'), a('מספר הספרות בלוגו.', false, 'לא רלוונטי.')]),
    q('למה אסור למדוד התנגדות במעגל פעיל?', [a('כי מקור מתח פעיל עלול לפגוע במדידה ובמכשיר.', true, 'נכון. מודדים התנגדות כשהמעגל מנותק ממקור.'), a('כי התנגדות קיימת רק ב-AC.', false, 'התנגדות קיימת גם ב-DC.'), a('כי המד יראה תמיד 0.', false, 'לא בהכרח, אבל המדידה אינה תקינה.'), a('כי הדבר מגדיל את התדר.', false, 'לא.')]),
  ]),
  chapter('06_work_plan', 'Exp03_PreLab_06_WorkPlan_H5P', 'ניסוי 3 - PreLab 06: תוכנית עבודה, פונקציית תמסורת ואלגברה ליניארית', 'חמש שאלות על סדר עבודה, פונקציית תמסורת, פתרון פאזורי ורישום תוצאות.', [
    q('מה עושים לפני הפעלת מקור אות במעגל?', [a('בודקים חיבורים, תחומי מדידה ומקבלים אישור מדריך.', true, 'נכון.'), a('מעלים מיד למתח מקסימלי.', false, 'זה מסוכן ועלול לפגוע בציוד.'), a('מחברים אדמה לכל נקודה אקראית.', false, 'חיבור אדמה שגוי עלול לקצר.'), a('מתעלמים מהאוסצילוסקופ.', false, 'הוא כלי מרכזי בניסוי.')]),
    q('מה מייצגת פונקציית התמסורת \\(H(j\\omega)\\)?', [a('היחס הפאזורי בין מתח המוצא למתח הכניסה.', true, 'נכון. היא כוללת גם יחס משרעות וגם הפרש מופע.'), a('רק ההתנגדות של הנגד.', false, 'התנגדות היא רכיב אחד בלבד במעגל.'), a('רק תדר המקור ללא תלות במעגל.', false, 'התדר הוא המשתנה שבו בוחנים את תגובת המעגל.'), a('המתח שיא-לשיא של האוסצילוסקופ.', false, 'זהו גודל מדידה, לא פונקציית תמסורת.')]),
    q('בכתיבה ליניארית של מעגל בתחום הפאזורים, מה משמעות הצורה \\(A x=b\\)?', [a('\\(A\\) מכילה עכבות, \\(x\\) הוא וקטור הנעלמים, ו-\\(b\\) מייצג מקורות.', true, 'נכון. זו הדרך האלגברית לנסח את משוואות קירכהוף.'), a('\\(A\\) היא תמיד תדר בלבד.', false, 'המטריצה מכילה את מקדמי המערכת, בדרך כלל עכבות או מוליכויות.'), a('\\(x\\) הוא תמיד זמן המחזור.', false, 'הנעלמים הם לרוב זרמים או מתחים פאזוריים.'), a('\\(b\\) חייב להיות אפס בכל מעגל.', false, 'מקורות מתח או זרם מופיעים באגף הימני.')]),
    q('מהי פונקציית התמסורת של מתח הקבל במעגל RC טורי?', [a('\\(H_C(j\\omega)=1/(1+j\\omega RC)\\)', true, 'נכון. זו תמסורת מסנן מעביר נמוכים עבור מתח הקבל.'), a('\\(H_C(j\\omega)=1+j\\omega RC\\)', false, 'זהו ההופכי של התמסורת הנכונה.'), a('\\(H_C(j\\omega)=R/C\\)', false, 'ביטוי זה אינו חסר יחידות ואינו תלוי בתדר.'), a('\\(H_C(j\\omega)=V_{pp}\\)', false, 'תמסורת היא יחס בין מוצא לכניסה.')]),
    q('מה חשוב לרשום לצד כל מדידה כדי לחשב תמסורת ניסיונית?', [a('יחידות, תדר, \\(V_{in}\\), \\(V_{out}\\), והפרש זמן או מופע.', true, 'נכון. כך ניתן לחשב גם גודל תמסורת וגם מופע.'), a('רק מספר ללא יחידה.', false, 'מספר ללא יחידה אינו מספיק.'), a('רק שם הסטודנט.', false, 'לא מספיק לניתוח.'), a('רק צבע החוטים.', false, 'לא מספיק.')]),
  ]),
  chapter('07_simulation', 'Exp03_PreLab_07_Simulation_H5P', 'ניסוי 3 - PreLab 07: סימולציה', 'חמש שאלות על שימוש בסימולציה להכנה למדידות AC.', [
    q('מה היתרון של סימולציה לפני המעבדה?', [a('אפשר לבדוק ציפיות, תחומי ערכים ושגיאות חיבור בלי לסכן ציוד.', true, 'נכון.'), a('היא מחליפה את המדידה בפועל.', false, 'היא כלי הכנה, לא תחליף מלא.'), a('היא מבטלת צורך ביחידות.', false, 'גם בסימולציה צריך יחידות.'), a('היא תמיד מדויקת יותר מהמציאות.', false, 'מודלים מוגבלים.')]),
    q('מה כדאי להשוות בין סימולציה למדידה?', [a('צורת גל, תדר, \\(V_{pp}\\), \\(V_{RMS}\\) ומופע.', true, 'נכון.'), a('רק צבע הגרף.', false, 'לא רלוונטי פיזיקלית.'), a('רק שם הקובץ.', false, 'לא מספיק.'), a('רק זמן פתיחת התוכנה.', false, 'לא רלוונטי.')]),
    q('אם הסימולציה והמדידה שונות מאוד, מה בודקים קודם?', [a('חיבורים, יחידות, ערכי רכיבים והגדרות מקור/מדידה.', true, 'נכון.'), a('מוחקים את כל הנתונים.', false, 'קודם מאבחנים.'), a('מניחים שהמדידה תמיד שגויה.', false, 'גם הסימולציה יכולה להיות מוגדרת לא נכון.'), a('משנים תוצאה ידנית.', false, 'אסור.')]),
    q('מה מייצג ground בסימולציה?', [a('נקודת ייחוס למתחים במעגל.', true, 'נכון.'), a('נגד נוסף.', false, 'לא.'), a('תדר המקור.', false, 'לא.'), a('אמצעי להגדלת RMS.', false, 'לא.')]),
    q('למה חשוב להגדיר נכון amplitude בסימולציה?', [a('כי תוכנות שונות עשויות לבקש שיא, RMS או שיא-לשיא.', true, 'נכון. יש לקרוא את ההגדרה.'), a('כי amplitude תמיד שווה לתדר.', false, 'אלו גדלים שונים.'), a('כי RMS תמיד אפס.', false, 'לא נכון.'), a('כי הוא קובע את צבע החוט.', false, 'לא רלוונטי.')]),
  ]),
  chapter('08_mistakes', 'Exp03_PreLab_08_Mistakes_H5P', 'ניסוי 3 - PreLab 08: טעויות נפוצות ומוכנות', 'חמש שאלות מסכמות על טעויות נפוצות לפני תחילת המעבדה.', [
    q('מהי טעות נפוצה בחישוב הספק AC?', [a('להציב \\(V_p\\) או \\(V_{pp}\\) במקום \\(V_{RMS}\\).', true, 'נכון. זה משנה את ההספק באופן משמעותי.'), a('להשתמש ביחידות.', false, 'שימוש ביחידות הוא חובה.'), a('לחשב \\(f=1/T\\).', false, 'זה נכון כאשר היחידות תקינות.'), a('לבדוק חיבורים.', false, 'זו פעולה נכונה.')]),
    q('מהי טעות נפוצה בחיבור אוסצילוסקופ?', [a('חיבור אדמת הגשש לנקודה שאינה אדמה ויצירת קצר.', true, 'נכון. יש להבין את נקודת הייחוס.'), a('בחירת Time/Div מתאים.', false, 'זו פעולה נכונה.'), a('שימוש בגשש תקין.', false, 'זו פעולה נכונה.'), a('קריאת יחידות.', false, 'זו פעולה נכונה.')]),
    q('איזה סימן מצביע על בעיית trigger?', [a('הגל זז על המסך ואינו יציב.', true, 'נכון.'), a('הנגד משנה צבע בתרשים.', false, 'לא קשור.'), a('התדר הופך להתנגדות.', false, 'לא.'), a('היחידות נעלמות מהדוח.', false, 'זו בעיית רישום, לא trigger.')]),
    q('מה צריך לוודא לפני הגשת PreLab?', [a('שהסטודנט יודע לחשב RMS, למדוד תדר, ולזהות חיבורי מדידה בטוחים.', true, 'נכון.'), a('רק שהשם מופיע בדף.', false, 'לא מספיק.'), a('רק שהסימולציה נפתחה.', false, 'לא מספיק.'), a('שאין יחידות בטבלאות.', false, 'חייבות להיות יחידות.')]),
    q('מה עושים כאשר תוצאה אינה הגיונית?', [a('בודקים יחידות, תחום מדידה, חיבורים וחישוב לפני שמסיקים מסקנה.', true, 'נכון.'), a('משנים את הנתון כדי שיתאים לציפייה.', false, 'אסור.'), a('מתעלמים מהמדידה.', false, 'יש לאבחן.'), a('מכפילים תמיד פי 10.', false, 'אין כלל כזה.')]),
  ]),
  chapter('09_readiness', 'Exp03_PreLab_09_Readiness_H5P', 'ניסוי 3 - PreLab 09: בדיקת מוכנות', 'חמש שאלות סופיות לבדיקת מוכנות לפני תחילת ניסוי 3.', [
    q('איזה שילוב פעולות מצביע על מוכנות טובה לניסוי?', [a('חישוב RMS, בדיקת חיבורי מדידה, הגדרת אוסצילוסקופ ורישום יחידות.', true, 'נכון. אלו יכולות בסיסיות לניסוי 3.'), a('הפעלת מקור לפני בדיקת חיבורים.', false, 'זה אינו בטיחותי.'), a('מדידת התנגדות במעגל פעיל.', false, 'אסור למדוד התנגדות במעגל מוזן.'), a('שימוש ב-Vpp במקום RMS בכל חישוב.', false, 'זה יגרום לשגיאות הספק.')]),
    q('מה צריך לדעת לבצע עם אוסצילוסקופ לפני המעבדה?', [a('לכוון Time/Div ו-Volts/Div ולמדוד מחזור ומתח.', true, 'נכון.'), a('לחשב התנגדות ללא מעגל.', false, 'זה אינו תפקיד האוסצילוסקופ.'), a('להחליף את ספק הכוח.', false, 'לא.'), a('להגדיל את RMS דרך כפתור trigger.', false, 'Trigger לא משנה RMS.')]),
    q('איזו בדיקה מתאימה לסוף ההכנה?', [a('השוואת תוצאה צפויה מסימולציה למדידה צפויה וליחידות.', true, 'נכון.'), a('מחיקת כל חישובי ההכנה.', false, 'צריך לשמור אותם.'), a('השארת טבלאות בלי יחידות.', false, 'יחידות חובה.'), a('חיבור שקע רשת ישירות למעגל סטודנטים.', false, 'זה מסוכן ואסור ללא ציוד מתאים ואישור.')]),
    q('מהו סימן לכך שהסטודנט מבין RMS?', [a('הוא יודע להסביר מדוע 230V רשת הוא RMS ולא מתח שיא.', true, 'נכון.'), a('הוא מניח שכל גל עם אותו שיא מחמם באותה מידה.', false, 'צורת הגל משפיעה על RMS.'), a('הוא משתמש תמיד בממוצע פשוט של המתח.', false, 'זה אינו RMS.'), a('הוא מתעלם מצורת הגל.', false, 'צורת הגל חשובה.')]),
    q('מה הפעולה הנכונה כאשר יש ספק לגבי חיבור מדידה?', [a('לעצור, לקרוא למדריך, ולא להפעיל את המעגל עד לבדיקה.', true, 'נכון. בטיחות קודמת למדידה.'), a('להפעיל לזמן קצר בלבד.', false, 'גם זמן קצר עלול לגרום נזק.'), a('להחזיק את החוט ביד ולבדוק.', false, 'אסור.'), a('להגדיל את המתח כדי לראות מהר יותר.', false, 'מסוכן.')]),
  ]),
];

const htmlByChapterId = {
  '01_definitions': '01_PreLab_01_Definitions_sub.html',
  '02_oscilloscope': '01_PreLab_02_OscilloscopeGuide_sub.html',
  '03_rms': '01_PreLab_02_RMS_sub.html',
  '04_conversions': '01_PreLab_03_Conversions_sub.html',
  '05_dmm': '01_PreLab_04_DMM_sub.html',
  '06_work_plan': '01_PreLab_05_WorkPlan_sub.html',
  '07_simulation': '01_PreLab_06_Simulation_sub.html',
  '08_mistakes': '01_PreLab_07_Mistakes_sub.html',
  '09_readiness': '01_PreLab_08_Readiness_sub.html',
};

function chapter(id, file, title, intro, questions) {
  return { id, file, title, intro, questions };
}

function h(text) {
  return `<div dir="rtl">${text}</div>`;
}

function a(text, correct, feedback) {
  return {
    correct,
    tipsAndFeedback: { chosenFeedback: h(feedback) },
    text: h(text),
  };
}

function q(question, answers) {
  return { question, answers };
}

function questionSetContent(chapter) {
  return {
    introPage: {
      showIntroPage: true,
      startButtonText: 'התחל בוחן',
      introduction: h(chapter.intro),
    },
    progressType: 'dots',
    passPercentage: 60,
    questions: chapter.questions.map((item, index) => ({
      params: {
        media: { disableImageZooming: false },
        answers: item.answers,
        question: h(item.question),
        behaviour,
        UI: ui,
      },
      library: 'H5P.MultiChoice 1.16',
      subContentId: `exp03-${chapter.id}-q${index + 1}`,
    })),
    texts,
  };
}

function h5pJson(chapter) {
  return {
    embedTypes: ['iframe'],
    language: 'he',
    defaultLanguage: 'he',
    license: 'U',
    extraTitle: chapter.file,
    title: chapter.title,
    mainLibrary: 'H5P.QuestionSet',
    preloadedDependencies: [
      { machineName: 'H5P.MultiChoice', majorVersion: 1, minorVersion: 16 },
      { machineName: 'FontAwesome', majorVersion: 4, minorVersion: 5 },
      { machineName: 'H5P.JoubelUI', majorVersion: 1, minorVersion: 3 },
      { machineName: 'H5P.Transition', majorVersion: 1, minorVersion: 0 },
      { machineName: 'H5P.FontIcons', majorVersion: 1, minorVersion: 0 },
      { machineName: 'H5P.Question', majorVersion: 1, minorVersion: 5 },
      { machineName: 'H5P.Video', majorVersion: 1, minorVersion: 6 },
      { machineName: 'H5P.QuestionSet', majorVersion: 1, minorVersion: 20 },
    ],
  };
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.copyFileSync(src, dest);
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripMathSlashes(value) {
  return value.replace(/\\\(/g, '\\(').replace(/\\\)/g, '\\)');
}

function moodleXml() {
  const parts = ['<?xml version="1.0" encoding="UTF-8"?>', '<quiz>'];
  const rootCategory = '$course$/top/EELab1';
  const experimentCategory = `${rootCategory}/Exp03`;
  const prelabCategory = `${experimentCategory}/PreLab`;

  function addCategory(categoryPath) {
    parts.push('  <question type="category">');
    parts.push(`    <category><text>${xmlEscape(categoryPath)}</text></category>`);
    parts.push('  </question>');
  }

  addCategory(rootCategory);
  addCategory(experimentCategory);
  addCategory(prelabCategory);

  for (const chapter of chapters) {
    addCategory(`${prelabCategory}/${chapter.title}`);
    chapter.questions.forEach((item, index) => {
      const correctCount = item.answers.filter(answer => answer.correct).length || 1;
      parts.push('  <question type="multichoice">');
      parts.push(`    <name><text>${xmlEscape(`Exp03 ${chapter.id} Q${index + 1}`)}</text></name>`);
      parts.push(`    <questiontext format="html"><text><![CDATA[<div dir="rtl">${stripMathSlashes(item.question)}</div>]]></text></questiontext>`);
      parts.push('    <generalfeedback format="html"><text><![CDATA[<div dir="rtl">שאלת PreLab לניסוי 3.</div>]]></text></generalfeedback>');
      parts.push('    <defaultgrade>1.0000000</defaultgrade>');
      parts.push('    <penalty>0.3333333</penalty>');
      parts.push('    <hidden>0</hidden>');
      parts.push('    <single>true</single>');
      parts.push('    <shuffleanswers>true</shuffleanswers>');
      parts.push('    <answernumbering>abc</answernumbering>');
      for (const answer of item.answers) {
        const fraction = answer.correct ? 100 / correctCount : 0;
        parts.push(`    <answer fraction="${fraction}" format="html">`);
        parts.push(`      <text><![CDATA[<div dir="rtl">${stripMathSlashes(answer.text.replace(/^<div dir="rtl">|<\/div>$/g, ''))}</div>]]></text>`);
        parts.push(`      <feedback format="html"><text><![CDATA[${answer.tipsAndFeedback.chosenFeedback}]]></text></feedback>`);
        parts.push('    </answer>');
      }
      parts.push('  </question>');
    });
  }
  parts.push('</quiz>');
  return parts.join('\n') + '\n';
}

function compressH5p(sourceDir, destination) {
  fs.rmSync(destination, { force: true });
  const zipDestination = `${destination}.zip`;
  fs.rmSync(zipDestination, { force: true });
  execFileSync('powershell.exe', [
    '-NoProfile',
    '-Command',
    `
      Add-Type -AssemblyName System.IO.Compression;
      Add-Type -AssemblyName System.IO.Compression.FileSystem;
      $source = '${sourceDir.replace(/'/g, "''")}';
      $destination = '${zipDestination.replace(/'/g, "''")}';
      if (Test-Path -LiteralPath $destination) { Remove-Item -LiteralPath $destination -Force; }
      $zip = [System.IO.Compression.ZipFile]::Open($destination, [System.IO.Compression.ZipArchiveMode]::Create);
      try {
        Get-ChildItem -LiteralPath $source -Recurse -File | ForEach-Object {
          $relative = $_.FullName.Substring($source.Length + 1).Replace('\\', '/');
          [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relative, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null;
        }
      } finally {
        $zip.Dispose();
      }
    `,
  ], { stdio: 'inherit' });
  fs.renameSync(zipDestination, destination);
}

function h5pNotice(chapter) {
  return `
<!-- EXP03 PRELAB H5P QUIZ NOTICE: ${chapter.id} -->
<section class="card shadow-sm mb-4 border-start border-success border-4" style="box-sizing: border-box; background: #ffffff; border: 1px solid #e2e8f0; border-right-width: 5px; border-radius: 0.75rem; margin: 1rem 0; border-color: #10b981; border-width: 4px; border-right-style: solid; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); margin-bottom: 1rem;">
    <div class="card-body" style="box-sizing: border-box; padding: 1.25rem;">
        <h3 class="card-title text-success h5" style="box-sizing: border-box; font-weight: 700; line-height: 1.25; margin-top: 0; margin-bottom: 0.75rem; color: #047857;">שאלון H5P לפרק זה</h3>
        <p class="card-text" style="box-sizing: border-box; margin-top: 0; margin-bottom: 0.75rem;">לאחר קריאת הפרק, יש לענות על שאלון H5P בן 5 שאלות. השאלון מיועד לבדיקה עצמית ולהכנה לבדיקת PreLab הסופית.</p>
        <p class="card-text mb-0" style="box-sizing: border-box; margin-top: 0; margin-bottom: 0;"><strong style="box-sizing: border-box;">קובץ להעלאה ל-Moodle:</strong> <code style="box-sizing: border-box;">H5P_Quiz/${chapter.file}.h5p</code></p>
    </div>
</section>
<!-- /EXP03 PRELAB H5P QUIZ NOTICE -->
`;
}

function injectH5pNotices() {
  const noticeRegex = /\r?\n?<!-- EXP03 PRELAB H5P QUIZ NOTICE:[\s\S]*?<!-- \/EXP03 PRELAB H5P QUIZ NOTICE -->\r?\n?/g;
  for (const chapter of chapters) {
    const htmlFile = htmlByChapterId[chapter.id];
    if (!htmlFile) continue;
    const file = path.join(bookDir, htmlFile);
    let html = fs.readFileSync(file, 'utf8').replace(noticeRegex, '\n');
    const notice = h5pNotice(chapter);
    if (html.includes('<nav class="d-flex')) {
      html = html.replace(/\r?\n<nav class="d-flex/, `${notice}\n<nav class="d-flex`);
    } else {
      const beforeMain = html.replace(/\r?\n<\/main>/, `${notice}\n</main>`);
      html = beforeMain === html ? html.replace(/\r?\n<\/body>/, `${notice}\n</body>`) : beforeMain;
    }
    fs.writeFileSync(file, html, 'utf8');
  }
}

fs.mkdirSync(outRoot, { recursive: true });
fs.mkdirSync(packageOut, { recursive: true });

for (const chapter of chapters) {
  const dir = path.join(outRoot, chapter.file);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, 'content'), { recursive: true });
  writeJson(path.join(dir, 'h5p.json'), h5pJson(chapter));
  writeJson(path.join(dir, 'content', 'content.json'), questionSetContent(chapter));
  for (const dep of dependencies) {
    copyRecursive(path.join(templateSrc, dep), path.join(dir, dep));
  }
  compressH5p(dir, path.join(packageOut, `${chapter.file}.h5p`));
}

fs.writeFileSync(xmlOut, moodleXml(), 'utf8');
injectH5pNotices();

const readme = `# Exp03 PreLab H5P and Moodle Question Bank

Generated by \`node scripts/generate_exp03_prelab_assessments.js\`.

## H5P packages

Upload each H5P package as a separate H5P activity and link it from the matching Moodle Book PreLab chapter.

${chapters.map(chapter => `- \`${chapter.file}.h5p\` - ${chapter.title}`).join('\n')}

## Moodle Question Bank

Import this XML file into Moodle Question Bank:

\`Exp03_PreLab_Question_Bank.xml\`

It contains ${chapters.length * 5} multiple-choice questions: 5 questions for each PreLab subchapter.
`;

fs.writeFileSync(path.join(packageOut, 'README.md'), readme, 'utf8');

console.log(`Generated ${chapters.length} H5P packages and ${chapters.length * 5} XML questions for Exp03 PreLab.`);
