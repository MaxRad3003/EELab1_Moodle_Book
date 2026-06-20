const fs = require('fs');
const path = require('path');
const juice = require('juice').default;

const SRC_DIR = path.join(__dirname, '../src/content');
const TEMPLATES_DIR = path.join(__dirname, '../src/templates');
const DIST_DIR = path.join(__dirname, '../dist');

// Templates
const moodleTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'moodle_inline_template.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(TEMPLATES_DIR, 'styles.css'), 'utf8');
const jsxgraphCore = fs.readFileSync(path.join(TEMPLATES_DIR, 'jsxgraph_core.js'), 'utf8');
const jsxgraphCss = fs.readFileSync(path.join(TEMPLATES_DIR, 'jsxgraph.css'), 'utf8');
const previewTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'preview_standalone.html'), 'utf8');
const buildFilter = process.env.BUILD_FILTER || process.argv[2] || '';
const equipmentLinksPath = path.join(SRC_DIR, 'EELab1', 'Moodle_Measuring_equipment_links.txt');

function parseEquipmentLinks() {
    if (!fs.existsSync(equipmentLinksPath)) {
        return new Map();
    }

    const titleToUrl = new Map();
    const lines = fs.readFileSync(equipmentLinksPath, 'utf8')
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].startsWith('https://')) {
            titleToUrl.set(lines[i - 1], lines[i]);
        }
    }

    const titleByLocalFile = new Map([
        ['Agilent_33220A_sub.html', 'Agilent 33220A - מחולל דיגיטלי'],
        ['GDM_8245_sub.html', 'GDM-8245 - מולטימטר בסיסי'],
        ['GDM_8341_sub.html', 'GDM-8341 - מולטימטר מתקדם'],
        ['GDS_2072A_sub.html', 'GDS-2072A - אוסילוסקופ דיגיטלי'],
        ['GFG_8219A_sub.html', 'GFG-8219A - מחולל אנלוגי'],
        ['GOS_620_sub.html', 'GOS-620 - אוסילוסקופ אנלוגי'],
        ['GPM_8212_sub.html', 'GPM-8212 - מד הספק דיגיטלי'],
        ['GPS_3303_sub.html', 'GPS-3303 - ספק כוח DC מיוצב'],
        ['Oscilloscope_sub.html', 'מבוא ועקרונות האוסילוסקופ'],
    ]);

    const fileToUrl = new Map();
    const firstMoodleUrl = [...titleToUrl.values()][0];
    if (firstMoodleUrl) {
        fileToUrl.set('Index.html', firstMoodleUrl.replace(/&chapterid=\d+$/, ''));
    }

    for (const [fileName, title] of titleByLocalFile) {
        const url = titleToUrl.get(title);
        if (url) {
            fileToUrl.set(fileName, url);
        }
    }

    return fileToUrl;
}

const equipmentFileToMoodleUrl = parseEquipmentLinks();

function applyMoodleEquipmentLinks(content) {
    let result = content;

    for (const [fileName, moodleUrl] of equipmentFileToMoodleUrl) {
        const escapedFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const localPathRegex = new RegExp(`(?:\\.\\./)+Measuring equipment/EELab_Measuring_equipment/${escapedFileName}`, 'g');
        const hrefRegex = new RegExp(`href="[^"]*${escapedFileName}"`, 'g');
        result = result.replace(localPathRegex, moodleUrl);
        result = result.replace(hrefRegex, `href="${moodleUrl}"`);
    }

    result = result.replace(/<a\b([^>]*href="https:\/\/moodle\.sce\.ac\.il\/mod\/book\/view\.php\?id=1215290[^"]*"[^>]*)>/g, (match, attrs) => {
        if (/\starget=/.test(attrs)) {
            return match;
        }
        return `<a${attrs} target="_blank">`;
    });

    return result;
}

/**
 * Recursively get all files in a directory
 */
function getFiles(dir, allFiles = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            if (file.toLowerCase() === 'draft') {
                continue;
            }
            getFiles(name, allFiles);
        } else {
            allFiles.push(name);
        }
    }
    return allFiles;
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function build() {
    console.log('🚀 Starting build with Juice (Inline CSS)...');

    let contentFiles = getFiles(SRC_DIR);
    if (buildFilter) {
        contentFiles = contentFiles.filter(file => path.relative(SRC_DIR, file).includes(buildFilter));
        console.log(`🔎 Build filter active: ${buildFilter} (${contentFiles.length} files)`);
    }

    contentFiles.forEach(file => {
        const relativePath = path.relative(SRC_DIR, file);
        const fileName = path.basename(file);
        const folderName = path.dirname(relativePath);
        
        if (!fileName.endsWith('.html')) {
            const distPath = path.join(DIST_DIR, 'moodle_ready', folderName, fileName);
            ensureDir(path.dirname(distPath));
            try {
                if (/\.(json|md|txt)$/i.test(fileName)) {
                    const content = applyMoodleEquipmentLinks(fs.readFileSync(file, 'utf8'));
                    fs.writeFileSync(distPath, content);
                } else {
                    fs.copyFileSync(file, distPath);
                }
                console.log(`✅ Copied Asset: ${distPath}`);
            } catch (error) {
                console.warn(`⚠️ Skipped Asset: ${file} (${error.code || error.message})`);
            }
            return;
        }

        let content = fs.readFileSync(file, 'utf8');
        content = applyMoodleEquipmentLinks(content);
        const title = fileName.replace('.html', '').replace(/_/g, ' ');

        // Handle JSXGraph Inlining
        let currentStyles = stylesCss;
        if (content.includes('<!-- INLINE_JSXGRAPH -->')) {
            console.log(`📦 Inlining JSXGraph for: ${fileName}`);
            content = content.replace('<!-- INLINE_JSXGRAPH -->', `<script>\n${jsxgraphCore}\n</script>`);
            currentStyles += '\n' + jsxgraphCss;
        }

        // 1. Generate Moodle Snippet with Inline CSS
        const fullHtml = moodleTemplate
            .replace('{{TITLE}}', title)
            .replace('{{CONTENT}}', content);
        
        // Inline the CSS
        // Prepend currentStyles to ensure they are processed even if they aren't in the HTML yet
        let inlineHtml = juice(`<style>${currentStyles}</style>${fullHtml}`, {
            removeStyleTags: true,
            deletedStyleTags: [],
            preserveMediaQueries: false
        });
        
        // Final safety check: Moodle strips <style> tags, so we MUST remove them
        inlineHtml = inlineHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        
        const moodleDistPath = path.join(DIST_DIR, 'moodle_ready', folderName, fileName);
        ensureDir(path.dirname(moodleDistPath));
        fs.writeFileSync(moodleDistPath, inlineHtml);
        console.log(`✅ Generated Inline CSS Snippet: ${moodleDistPath}`);

        // 2. Generate Standalone Preview (Keep as is or use inlined?)
        // Previews are better with a separate <style> for easier debugging, 
        // but let's use the inlined one for 100% accuracy of what Moodle will show.
        const previewDistPath = path.join(DIST_DIR, 'previews', folderName, fileName);
        ensureDir(path.dirname(previewDistPath));
        fs.writeFileSync(previewDistPath, inlineHtml);
        console.log(`✅ Generated Standalone Preview: ${previewDistPath}`);
    });

    console.log('✨ Build completed successfully!');
}

build();
