/**
 * @file generate_exp01_prelab_h5p.js
 * @description
 * סקריפט זה מייצר בחני H5P אינטראקטיביים עבור שלב ההכנה (PreLab)
 * של ניסוי 1 (Exp01).
 * הוא יוצר חבילות .h5p עבור כל פרק הכנה על בסיס תוכן מוגדר מראש,
 * ומוסיף קישורים לבחנים אלו בקובצי ה-HTML המתאימים של ספר ה-Moodle.
 *
 * קבצי פלט:
 * - חבילות .h5p בנתיב `src/content/EELab1/Exp01/moodle_book_import_v2/H5P_Quiz/`
 * - קובצי HTML מעודכנים בנתיב `src/content/EELab1/Exp01/moodle_book_import_v2/`
 */

// =================================================================
// 1. ייבוא מודולים והגדרת נתיבים
// =================================================================
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '../..');
const outRoot = path.join(root, 'h5p_src', 'Exp01_PreLab_H5P');
const packageOut = path.join(root, 'src', 'content', 'EELab1', 'Exp01', 'moodle_book_import_v2', 'H5P_Quiz');

const dependencies = [
  'FontAwesome-4.5',
  'H5P.FontIcons-1.0',
  'H5P.JoubelUI-1.3',
  'H5P.MultiChoice-1.16',
  'H5P.Question-1.5',
  'H5P.QuestionSet-1.20',
  'H5P.Transition-1.0',
  'H5P.Video-1.6',
  'H5P.MathDisplay-1.0',
];
const templateSrc = path.join(root, 'h5p_src', 'Exp03_AC_Quiz_src'); // שימוש בתבנית תלויות משותפת

// =================================================================
// 2. הגדרות H5P (התנהגות, ממשק משתמש וטקסטים)
// =================================================================

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

// =================================================================
// 3. פונקציות עזר ליצירת תוכן
// =================================================================

function chapter(id, file, title, intro, questions) {
  return { id, file, title, intro, questions };
}

function q(question, answers) {
  return { question, answers };
}

function h(text) {
  const fixedText = text.replace(/\\\((.*?)\\\)/g, '<span dir="ltr">\\($1\\)</span>');
  return `<div dir="rtl">${fixedText}</div>`;
}

function a(text, correct, feedback) {
  return {
    correct,
    tipsAndFeedback: { chosenFeedback: h(feedback) },
    text: h(text),
  };
}

// =================================================================
// 4. תוכן השאלונים (שאלות ותשובות)
// =================================================================

const chapters = [
  chapter('00_safety', 'Exp01_PreLab_00_Safety_H5P', 'ניסוי 1 - בטיחות במעבדה', 'קראו והבינו את נהלי הבטיחות לפני המעבדה.', [
    q('במקרה שממסר הפחת הופעל או מא"ז, מי רשאי להרים את הכפתור?', [
      a('מדריך מעבדה/ אחראי מעבדה.', true, 'נכון מאוד. חל איסור מוחלט על סטודנטים לגעת בלוח החשמל.'),
      a('סטודנט.', false, 'שגוי. יש לקרוא למדריך.'),
      a('כל אדם.', false, 'שגוי.'),
      a('חברת חשמל.', false, 'שגוי.')
    ]),
    q('מה הפעולה הראשונה בסיום הניסוי?', [
      a('ויסות המתח לאפס וניתוק מתח המקור.', true, 'תשובה נכונה. תמיד מורידים מתח לאפס ומכבים את הספק לפני פירוק המעגל.'),
      a('המשך לניסוי הבא.', false, 'יש לפרק ולסדר את העמדה קודם.'),
      a('לחיצה על לחצן חירום.', false, 'לחצן חירום מיועד רק לחירום.')
    ]),
    q('מה השלבים שצריך לבצע בזמן שריפה במעבדה?', [
      a('א\' + ב\' + ג\' נכונים.', true, 'נכון. חובה לנתק מקורות חשמל, לפנות את המעבדה, ולהשתמש במטף במידת האפשר.'),
      a('ניתוק מקורות חשמל.', false, 'חלקי.'),
      a('פינוי המעבדה במהירות.', false, 'חלקי.'),
      a('כיבוי האש, הפעלת מטף ייעודי.', false, 'חלקי.')
    ]),
    q('למעבדה יש להופיע בלבוש הבא:', [
      a('מכנסיים ארוכים, נעליים סגורות, שיער ארוך אסוף.', true, 'נכון מאוד. כללי הלבוש נועדו להגן עליכם.'),
      a('מה שרוצים.', false, 'שגוי. קיימים נהלים ברורים.'),
      a('העיקר להקפיד על נעליים סגורות.', false, 'שגוי, חובה גם מכנסיים ארוכים.')
    ]),
    q('מתי מותר להפעיל את מקור המתח (ספק הכוח) במעגל שבניתם?', [
      a('רק לאחר בדיקת החיבורים על ידי המדריך וקבלת אישורו.', true, 'בדיוק. מונע קצרים ונזק.'),
      a('מיד לאחר סיום החיווט על המטריצה.', false, 'לא לפני בדיקה.'),
      a('רק אם המתח נמוך מ-\\(5V\\).', false, 'יש לקבל אישור בכל מקרה.')
    ]),
    q('האם מותר לאכול או לשתות בשטח המעבדה?', [
      a('חל איסור מוחלט על אכילה ושתייה במעבדה בכל עת.', true, 'נכון. סכנת התחשמלות ונזק לציוד יקר.'),
      a('מותר לשתות רק מים מבוקבוק סגור.', false, 'שגוי, כל שתייה אסורה.'),
      a('מותר לאכול רק בזמן ההפסקה בתוך המעבדה.', false, 'שגוי, אין לאכול במעבדה.')
    ]),
    q('האם מותר לבצע שינויים בחיווט המעגל (הוספה או ניתוק חוטים) כאשר ספק הכוח פועל?', [
      a('חל איסור מוחלט. יש לכבות את ספק הכוח לפני כל שינוי בחיווט.', true, 'נכון מאוד. כל שינוי תחת מתח מסכן אתכם ואת הציוד.'),
      a('מותר, כל עוד נזהרים לא לגעת במוליכים חשופים.', false, 'שגוי ומסוכן.'),
      a('מותר, אבל רק אם המתח נמוך מ-\\(10V\\).', false, 'שגוי. הכלל חל על כל מתח.')
    ])
  ]),
  chapter('01_colorcode', 'Exp01_PreLab_01_ColorCode_H5P', 'ניסוי 1 - צופן צבעים', 'בדקו את הבנתכם בחישוב התנגדות וטולרנס.', [
    q('מהו רצף הצבעים של נגד בעל התנגדות של \\(1.5k\\Omega\\) ודיוק של 5%?', [
      a('חום, ירוק, אדום, זהב', true, 'נכון מאוד! חום (1), ירוק (5), אדום (\\(10^2\\)), זהב (5%).'),
      a('חום, ירוק, חום, זהב', false, 'שגוי. זה \\(150\\Omega\\).'),
      a('כתום, שחור, אדום, זהב', false, 'שגוי.')
    ]),
    q('לנגד בעל ערך נקוב של \\(100\\Omega\\) יש טבעת זהב (5%). מהו טווח המדידה התקין עבור נגד זה?', [
      a('בין \\(95\\Omega\\) ל-\\(105\\Omega\\)', true, 'נכון. 5% מתוך 100 הם \\(5\\Omega\\).'),
      a('בין \\(90\\Omega\\) ל-\\(110\\Omega\\)', false, 'שגוי. זה 10%.'),
      a('בדיוק \\(100\\Omega\\), כל סטייה מעידה על רכיב תקול.', false, 'שגוי. לכל רכיב יש טולרנס.')
    ])
  ]),
  chapter('02_equipment', 'Exp01_PreLab_02_Equipment_H5P', 'ניסוי 1 - ציוד מדידה', 'בדקו את ההבנה בשימוש נכון ברב-מודד וספק כוח.', [
    q('כיצד יש לחבר את הרב-מודד (DMM) לצורך מדידת מתח על פני נגד במעגל?', [
      a('במקביל לנגד, מבלי לפתוח את המעגל.', true, 'נכון! מתח נמדד בין שתי נקודות (במקביל).'),
      a('בטור לנגד, תוך פתיחת המעגל.', false, 'כך מודדים זרם.'),
      a('רק כאשר הספק כבוי.', false, 'מתח מודדים כשהמעגל פעיל.')
    ]),
    q('כיצד יש לחבר את ה-DMM לצורך מדידת זרם הזורם דרך נגד?', [
      a('בטור לנגד, תוך "פתיחת" המעגל והעברת הזרם דרך המכשיר.', true, 'נכון מאוד. חובה לפתוח את המעגל ולחבר בטור.'),
      a('במקביל לנגד.', false, 'חיבור כזה ייצור קצר.'),
      a('ישירות להדקי ספק הכוח.', false, 'שגוי.')
    ]),
    q('בספק כוח המכוון למצב SERIES, כאשר MASTER מכוון ל-\\(10V\\) ו-SLAVE מכוון ל-\\(5V\\), מה יהיה המתח המקסימלי שניתן לקבל בין ההדקים הקיצוניים?', [
      a('\\(15V\\)', true, 'נכון! במצב טורי המתחים מתחברים.'),
      a('\\(10V\\)', false, 'שגוי.'),
      a('\\(5V\\)', false, 'שגוי.')
    ]),
    q('מהי המטרה העיקרית של קביעת "הגבלת זרם" (Current Limit) בספק הכוח?', [
      a('למנוע זרם גבוה מדי שעלול לשרוף רכיבים במקרה של קצר.', true, 'נכון מאוד. מנגנון הגנה חשוב.'),
      a('כדי להבטיח שהספק יעבוד תמיד במתח מקסימלי.', false, 'שגוי.'),
      a('אין צורך בהגבלה.', false, 'הגבלה היא חובה.')
    ])
  ]),
  chapter('03_breadboard', 'Exp01_PreLab_03_Breadboard_H5P', 'ניסוי 1 - מטריצה', 'בחנו את עצמכם על המבנה הפנימי של המטריצה.', [
    q('כיצד מקושרים החורים ב"פסי הרכיבים" (הפסים המרכזיים) של המטריצה?', [
      a('כל 5 חורים בטור (אנכית) מקוצרים ביניהם.', true, 'נכון. כל טור כזה הוא צומת אחד.'),
      a('כל החורים לאורך השורה (אופקית) מקוצרים ביניהם.', false, 'זה נכון לפסי ההזנה, לא לרכיבים.'),
      a('אין קשר פנימי, יש לחבר הכול עם חוטים.', false, 'שגוי.')
    ])
  ])
];

// =================================================================
// 5. פונקציות ליצירת JSON ו-HTML
// =================================================================

function questionSetContent(group) {
  let total = 0;
  for (const q of group.questions) total += (q.answers || []).filter(a => a.correct).length;
  return {
    introPage: {
      showIntroPage: true,
      startButtonText: 'התחל בוחן',
      introduction: h(group.intro),
    },
    progressType: 'dots',
    passPercentage: 60,
    questions: group.questions.map((item, index) => ({
      params: {
        media: { disableImageZooming: false },
        answers: item.answers,
        question: h(item.question),
        behaviour,
        UI: ui,
      },
      library: 'H5P.MultiChoice 1.16',
      subContentId: `exp01-${group.id}-q${index + 1}`,
    })),
    texts,
    totalPoints: total,
  };
}

const htmlByChapterId = {
  '00_safety': '01_PreLab_00_Safety_sub.html',
  '01_colorcode': '01_PreLab_01_ColorCode_sub.html',
  '02_equipment': '01_PreLab_02_Equipment_sub.html',
  '03_breadboard': '01_PreLab_03_Breadboard_sub.html',
};

const bookDir = path.join(root, 'src', 'content', 'EELab1', 'Exp01', 'moodle_book_import_v2');

function h5pNotice(chapter) {
  return `
<!-- EXP01 PRELAB H5P QUIZ NOTICE: ${chapter.id} -->
<section class="card shadow-sm mb-4 border-start border-success border-4" style="box-sizing: border-box; background: #ffffff; border: 1px solid #e2e8f0; border-right-width: 5px; border-radius: 0.75rem; margin: 1rem 0; border-color: #10b981; border-width: 4px; border-right-style: solid; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); margin-bottom: 1rem;">
    <div class="card-body" style="box-sizing: border-box; padding: 1.25rem; text-align: center;">
        <h3 class="card-title text-success h5" style="box-sizing: border-box; font-weight: 700; line-height: 1.25; margin-top: 0; margin-bottom: 0.75rem; color: #047857;">בחן עצמי אינטראקטיבי</h3>
        <p class="card-text" style="box-sizing: border-box; margin-top: 0; margin-bottom: 1rem; color: #475569;">לאחר קריאת הפרק, בחן את עצמך כדי לוודא הבנה לקראת הניסוי.</p>
        <div style="box-sizing: border-box; margin-top: 1rem;">
            <a href="H5P_Quiz/${chapter.file}.h5p" style="box-sizing: border-box; display: inline-block; background-color: #10b981; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: background-color 0.2s;">
                📝 התחל שאלון חזרה (H5P)
            </a>
        </div>
    </div>
</section>
<!-- /EXP01 PRELAB H5P QUIZ NOTICE -->
`;
}

function injectH5pEmbeds(updatedFiles) {
  const noticeRegex = /\r?\n?<!-- EXP01 PRELAB H5P QUIZ NOTICE:[\s\S]*?<!-- \/EXP01 PRELAB H5P QUIZ NOTICE -->\r?\n?/g;
  for (const chapter of chapters) {
    const htmlFile = htmlByChapterId[chapter.id];
    if (!htmlFile) continue;
    const file = path.join(bookDir, htmlFile);
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8').replace(noticeRegex, '\n');
    const notice = h5pNotice(chapter);
    if (html.includes('<!-- NAVIGATION: BOOK PREV NEXT -->')) {
      html = html.replace(/<!-- NAVIGATION: BOOK PREV NEXT -->/, `${notice}\n<!-- NAVIGATION: BOOK PREV NEXT -->`);
    } else {
      const beforeMain = html.replace(/\r?\n<\/main>/, `\n${notice}\n</main>`);
      html = beforeMain === html ? html.replace(/\r?\n<\/body>/, `\n${notice}\n</body>`) : beforeMain;
      if (html === beforeMain && !html.includes('</body>')) {
        // Fallback for partial files without body or main tags
        html = html + `\n${notice}\n`;
      }
    }
    fs.writeFileSync(file, html, 'utf8');
    if (!updatedFiles.includes(file)) {
      updatedFiles.push(file);
    }
  }
}

// =================================================================
// 6. פונקציות לעבודה עם מערכת הקבצים
// =================================================================

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
      { machineName: 'H5P.MathDisplay', majorVersion: 1, minorVersion: 0 },
    ],
  };
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.copyFileSync(src, dest);
}

function compressH5p(sourceDir, destination) {
  if (fs.existsSync(destination)) {
    fs.rmSync(destination, { force: true });
  }
  const zipDestination = `${destination}.zip`;
  if (fs.existsSync(zipDestination)) {
    fs.rmSync(zipDestination, { force: true });
  }

  execFileSync('powershell.exe', [
    '-NoProfile',
    '-NonInteractive',
    '-Command',
    `
      $ErrorActionPreference = 'Stop';
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
      $zip2 = [System.IO.Compression.ZipFile]::Open($destination, [System.IO.Compression.ZipArchiveMode]::Update);
      try {
        $entry = $zip2.GetEntry('h5p.json');
        if ($entry) { $entry.LastWriteTime = (Get-Date "1980-01-01"); }
      } finally {
        $zip2.Dispose();
      }
    `,
  ], { stdio: 'inherit' });

  fs.renameSync(zipDestination, destination);
}

// =================================================================
// 7. לוגיקה ראשית - הרצת הסקריפט
// =================================================================

const createdH5PFiles = [];
const updatedHtmlFiles = [];

if (!fs.existsSync(outRoot)) fs.mkdirSync(outRoot, { recursive: true });
if (!fs.existsSync(packageOut)) fs.mkdirSync(packageOut, { recursive: true });

for (const chapter of chapters) {
  const dir = path.join(outRoot, chapter.file);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(dir, 'content'), { recursive: true });

  writeJson(path.join(dir, 'h5p.json'), h5pJson(chapter));
  writeJson(path.join(dir, 'content', 'content.json'), questionSetContent(chapter));

  for (const dep of dependencies) {
    copyRecursive(path.join(templateSrc, dep), path.join(dir, dep));
  }

  const h5pPath = path.join(packageOut, `${chapter.file}.h5p`);
  compressH5p(dir, h5pPath);
  createdH5PFiles.push(h5pPath);
}

injectH5pEmbeds(updatedHtmlFiles);

console.log(`\n✅ סקריפט 'generate_exp01_prelab_h5p.js' הושלם בהצלחה!`);
console.log('==================================================');
console.log(`📦 נוצרו ${createdH5PFiles.length} חבילות H5P:`);
createdH5PFiles.forEach(file => console.log(`   - ${path.relative(root, file)}`));

if (updatedHtmlFiles.length > 0) {
  console.log(`\n🔄 עודכנו ${updatedHtmlFiles.length} קבצי HTML:`);
  updatedHtmlFiles.forEach(file => console.log(`   - ${path.relative(root, file)}`));
}
console.log('==================================================');
