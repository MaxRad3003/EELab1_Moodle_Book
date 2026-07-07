const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../src/content/EELab1/Exp03/moodle_book_import_v2');

// Organize files into their groups
const allFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.html')).sort();

const groups = [
    allFiles.filter(f => f.startsWith('00_Intro')),
    allFiles.filter(f => f.startsWith('01_PreLab')),
    allFiles.filter(f => f.startsWith('02_InLab')),
    allFiles.filter(f => f.startsWith('03_PostLab') || f.startsWith('04_References'))
];

const getRoadmapHTML = (activeIndex, activePercentage) => {
    // Generate text for each step based on whether it is past, present, or future
    const getPercentText = (stepIndex) => {
        if (activeIndex > stepIndex) return '100%';
        if (activeIndex === stepIndex) return `${activePercentage}%`;
        return ''; // Or '0%' if preferred
    };

    const getHtmlForStep = (stepIndex, label) => {
        const isActive = activeIndex === stepIndex;
        const isPast = activeIndex > stepIndex;
        const isFuture = activeIndex < stepIndex;
        
        let bgColor = isPast || isActive ? '#3b82f6' : '#cbd5e1';
        let shadow = isActive ? 'box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);' : '';
        let fontWeight = isActive ? 'bold' : 'normal';
        let textColor = isActive ? '#3b82f6' : '#64748b';
        let percentText = getPercentText(stepIndex);
        let percentHtml = percentText ? `<br><span style="font-size: 0.85em; opacity: 0.8; font-weight: normal;">${percentText}</span>` : '';

        return `
    <div class="roadmap-step ${isActive ? 'active' : ''}" style="text-align: center; flex: 1; position: relative;">
        <div class="roadmap-circle" style="width: 2rem; height: 2rem; color: white; border-radius: 9999px; margin: 0 auto 0.5rem; line-height: 2rem; font-weight: 700; background-color: ${bgColor}; ${shadow} transition: all 0.3s ease;">${stepIndex + 1}</div>
        <div style="font-weight: ${fontWeight}; color: ${textColor};">${label}${percentHtml}</div>
    </div>`;
    };

    return `
<!-- EXP03 ROADMAP PROGRESS BAR START -->
<div class="roadmap-container" style="box-sizing: border-box; display: flex; justify-content: space-around; margin: 1.5rem 0 2.5rem 0; background: #f1f5f9; padding: 1.25rem; border-radius: 9999px; border: 1px solid #e2e8f0; direction: rtl;">${getHtmlForStep(0, 'מבוא')}${getHtmlForStep(1, 'הכנה')}${getHtmlForStep(2, 'מעבדה')}${getHtmlForStep(3, 'סיכום')}
</div>
<!-- EXP03 ROADMAP PROGRESS BAR END -->`;
};

allFiles.forEach(file => {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let activeIndex = -1;
    let indexInGroup = -1;
    let totalInGroup = 1;

    for (let i = 0; i < groups.length; i++) {
        const fileIdx = groups[i].indexOf(file);
        if (fileIdx !== -1) {
            activeIndex = i;
            indexInGroup = fileIdx;
            totalInGroup = groups[i].length;
            break;
        }
    }
    
    if (activeIndex === -1) return;
    
    const activePercentage = Math.round(((indexInGroup + 1) / totalInGroup) * 100);
    const roadmapHTML = getRoadmapHTML(activeIndex, activePercentage);
    
    // Remove existing roadmap if present
    const regexExisting = /<!-- EXP03 ROADMAP PROGRESS BAR START -->[\s\S]*?<!-- EXP03 ROADMAP PROGRESS BAR END -->\s*/g;
    content = content.replace(regexExisting, '');
    
    // Inject new roadmap
    const markerRegex = /(>\s*ניסוי 3: מכשירי מדידה בזרם חילופין \(AC\)<\/div>)/;
    if (markerRegex.test(content)) {
        content = content.replace(markerRegex, `$1\n${roadmapHTML}`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file} (${activePercentage}%)`);
    } else if (file === '01_PreLab_05_Phasors_sub.html') {
        const h2Regex = /(<h2>.*?<\/h2>)/;
        if (h2Regex.test(content)) {
            content = content.replace(h2Regex, `$1\n${roadmapHTML}`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file} (Phasors fallback) (${activePercentage}%)`);
        } else {
            console.log(`H2 not found in ${file}`);
        }
    } else {
        console.log(`Marker not found in ${file}`);
    }
});
