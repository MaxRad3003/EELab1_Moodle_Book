const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/content/EELab1/Exp03/moodle_book_import_v2/01_PreLab_10_Readiness_sub.html');
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `<tr style="box-sizing: border-box;"><td>6</td><td>איך מודדים הפרש מופע לפי זמן?</td><td>\\(\\phi=360^\\circ\\Delta t/T\\)</td></tr>
<tr style="box-sizing: border-box;"><td>7</td><td>מה תפקיד Trigger?</td><td>לייצב את התצוגה.</td></tr>
<tr style="box-sizing: border-box;"><td>8</td><td>מה צריך לבדוק לגבי Probe x10?</td><td>שהפרוב והסקופ מוגדרים אותו דבר.</td></tr>
</tbody></table></div>
<!-- סעיף: COMPLETION CRITERION -->
<div class="ok" style="box-sizing: border-box; background: #eefaf1; border: 1px solid #b7e4c7; border-right: 5px solid #28a745; border-radius: 8px; padding: 16px; margin: 16px 0;"><strong style="box-sizing: border-box;">מוכן למעבדה:</strong> סטודנט מוכן יודע להסביר כל שורה בטבלה במילים שלו ולבצע חישוב קצר ללא עזרה.</div>
<!-- ניווט: הקודם / תוכן עניינים / הבא -->
<div style="box-sizing: border-box; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin: 28px 0 4px;"><a href="01_PreLab_09_Mistakes_sub.html" style="box-sizing: border-box; border-bottom: 1px solid rgba(6, 182, 212, 0.35); display: inline-block; background: #eef3f7; color: #005696; border: 1px solid #cbd5df; border-radius: 6px; padding: 10px 14px; text-decoration: none; font-weight: 700;">הקודם</a><a href="01_PreLab.html" style="box-sizing: border-box; border-bottom: 1px solid rgba(6, 182, 212, 0.35); display: inline-block; background: #005696; color: #ffffff; border: 1px solid #005696; border-radius: 6px; padding: 10px 14px; text-decoration: none; font-weight: 700;">תוכן עניינים</a><a href="02_InLab.html" style="box-sizing: border-box; border-bottom: 1px solid rgba(6, 182, 212, 0.35); display: inline-block; background: #eef3f7; color: #005696; border: 1px solid #cbd5df; border-radius: 6px; padding: 10px 14px; text-decoration: none; font-weight: 700;">הבא</a></div>
</div>

<!-- EXP03 PRELAB H5P QUIZ NOTICE: 09_readiness -->`;

// I'll replace everything from `<tr style="box-sizing: border-box;"><td>5</td>...` to `<!-- EXP03 PRELAB H5P QUIZ NOTICE: 09_readiness -->`
const regex = /<tr style="box-sizing: border-box;"><td>5<\/td>[\s\S]*?<!-- EXP03 PRELAB H5P QUIZ NOTICE: 09_readiness -->/;
const toInject = `<tr style="box-sizing: border-box;"><td>5</td><td>למה חייבים להיזהר מאדמות האוסצילוסקופ?</td><td>הן מחוברות פנימית ועלולות לקצר נקודות במעגל.</td></tr>\n` + replacement;

content = content.replace(regex, toInject);
fs.writeFileSync(filePath, content, 'utf8');
