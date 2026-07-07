const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/content/EELab1/Exp03/moodle_book_import_v2/01_PreLab_07_WorkPlan_sub.html');
let content = fs.readFileSync(filePath, 'utf8');

const missingBlock = `<!-- פרק: כותרת -->
<div class="mb-5" style="box-sizing: border-box; margin-bottom: 2rem;">
<h4 class="section-title" style="box-sizing: border-box; font-weight: 700; margin-bottom: 0.75rem; margin-top: 0; display: inline-block; color: #005696; font-size: 1.7rem; line-height: 1.35; margin: 0 0 16px; border-bottom: 3px solid #00a4e4; padding-bottom: 10px;">הכנה לניסוי 3 - חלק ג': המעגל ותוכנית עבודה</h4>
<p class="mt-4" style="box-sizing: border-box; margin-bottom: 0.9rem; margin: 0 0 12px; font-size: 1.125rem; color: #52616b; margin-top: 1rem;">ניתוח מעגל RC טורי, ייצוג המעגל כמערכת ליניארית, חישוב הפרשי מופע, והכנת סימולציית Tinkercad.</p>
</div>
<!-- סעיף: RC CIRCUIT ANALYSIS -->
<div class="theory-card" id="section-rc-theory" style="box-sizing: border-box; background-color: white; margin-top: 1.25rem; background: #ffffff; border: 1px solid #d7dde4; border-radius: 8px; padding: 20px; margin: 18px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
<h4 class="sub-title" style="box-sizing: border-box; font-weight: 700; margin-bottom: 0.75rem; margin-top: 2rem; display: flex; align-items: center; gap: 0.5rem; color: #005696; font-size: 1.25rem; line-height: 1.4; margin: 0 0 12px;">📖 1. ניתוח תיאורטי של מעגל RC טורי</h4>
<p style="box-sizing: border-box; margin-top: 0; margin-bottom: 0.9rem; margin: 0 0 12px;">בניסוי נבנה מעגל RC טורי המורכב מנגד \\(R = 1 \\text{ k}\\Omega\\) וקבל \\(C = 100 \\text{ nF}\\) תחת הזנת סינוס:</p>
`;

content = content.replace('<div class="info-box"', missingBlock + '<div class="info-box"');

fs.writeFileSync(filePath, content, 'utf8');
