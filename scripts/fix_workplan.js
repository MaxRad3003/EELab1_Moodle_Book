const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/content/EELab1/Exp03/moodle_book_import_v2/01_PreLab_07_WorkPlan_sub.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update titles
content = content.replace('פונקציית תמסורת מתוך אלגברה ליניארית', 'ייצוג המעגל כמערכת ליניארית');
content = content.replace('פונקציית תמסורת מתוך אלגברה ליניארית', 'ייצוג המעגל כמערכת ליניארית'); // twice (in header and subtitle)

// Update subtitle from "🧮 3. פונקציית תמסורת מתוך אלגברה ליניארית"
content = content.replace('🧮 3. פונקציית תמסורת מתוך אלגברה ליניארית', '🧮 3. ייצוג המעגל כמערכת ליניארית');

// 2. Extract sections
const sec2Regex = /<!-- סעיף: FREQUENCY CALCULATIONS -->[\s\S]*?<\/div>\s*<!-- סעיף: TRANSFER FUNCTION FROM LINEAR ALGEBRA -->/;
const sec3Regex = /<!-- סעיף: TRANSFER FUNCTION FROM LINEAR ALGEBRA -->[\s\S]*?<\/div>\s*<!-- סעיף: TINKERCAD MANDATORY TASK -->/;

const sec2Match = content.match(sec2Regex);
const sec3Match = content.match(sec3Regex);

if (sec2Match && sec3Match) {
    let sec2 = sec2Match[0];
    let sec3 = sec3Match[0];
    
    // We need to clean up the overlapping boundaries
    // sec2 has "<!-- סעיף: TRANSFER FUNCTION..." at the end.
    sec2 = sec2.replace(/\s*<!-- סעיף: TRANSFER FUNCTION FROM LINEAR ALGEBRA -->$/, '');
    sec3 = sec3.replace(/\s*<!-- סעיף: TINKERCAD MANDATORY TASK -->$/, '');

    // Now rename the section numbers in the titles so order makes sense
    // Sec 2 (Calculations) becomes Sec 3
    sec2 = sec2.replace('📐 2. חישוב הפרשי מופע בתדרי הניסוי', '📐 3. חישוב הפרשי מופע בתדרי הניסוי');
    // Sec 3 (Transfer function) becomes Sec 2
    sec3 = sec3.replace('🧮 3. ייצוג המעגל כמערכת ליניארית', '🧮 2. ייצוג המעגל כמערכת ליניארית ופונקציית תמסורת');
    sec3 = sec3.replace('🧮 3. פונקציית תמסורת מתוך אלגברה ליניארית', '🧮 2. ייצוג המעגל כמערכת ליניארית ופונקציית תמסורת'); // Just in case it wasn't replaced earlier

    // Replace the combined block with sec3 followed by sec2
    const combinedOriginalRegex = /<!-- סעיף: FREQUENCY CALCULATIONS -->[\s\S]*?<\/div>\s*<!-- סעיף: TINKERCAD MANDATORY TASK -->/;
    
    // Construct new text
    const newCombined = sec3 + '\n' + sec2 + '\n<!-- סעיף: TINKERCAD MANDATORY TASK -->';
    
    content = content.replace(combinedOriginalRegex, newCombined);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('WorkPlan didactic order updated successfully.');
} else {
    console.log('Error: Could not find sections.');
}
