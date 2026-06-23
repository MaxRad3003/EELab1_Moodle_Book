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

    let contentFiles = getFiles(SRC_DIR).filter(file => {
        const relativePath = path.relative(SRC_DIR, file);
        const folder = relativePath.split(path.sep)[0];
        return folder === 'EELab1' || folder === 'Measuring equipment';
    });
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
                fs.copyFileSync(file, distPath);
                console.log(`✅ Copied Asset: ${distPath}`);
            } catch (error) {
                console.warn(`⚠️ Skipped Asset: ${file} (${error.code || error.message})`);
            }
            return;
        }

        let content = fs.readFileSync(file, 'utf8');
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
        
        let finalInlineHtml = inlineHtml;
        if (fileName === '01_PreLab_02_RMS_sub.html') {
            console.log(`♻️ Replacing second interactive panel with iframe for Moodle snippet: ${fileName}`);
            
            // 1. Replace second interactive panel (AC vs DC comparison) with iframe pointing to the complex version, stopping before "סיכום קצר"
            const match2 = /<!-- המחשה 2 -->[\s\S]*?(?=<section[^>]*>\s*<!-- CARD CONTAINER -->\s*<div class="card-body"[^>]*>\s*<h3[^>]*>סיכום קצר<\/h3>)/gi;
            finalInlineHtml = finalInlineHtml.replace(match2, `<!-- המחשה 2 -->\n<iframe src="https://maxrad3003.github.io/EELab1_Moodle_Book/dist/previews/EELab1/Exp03/moodle_book_import_v2/interactive/exp03_rms_comparison_complex.html" width="100%" height="3400" style="border:none; overflow:hidden;"></iframe>\n\n`);

            // 2. Remove only the second IIFE (for המחשה 2) from the inline jsxgraph script block, keeping the first IIFE (for המחשה 1) intact
            finalInlineHtml = finalInlineHtml.replace(/\(function\s*\(\)\s*\{\s*const\s+seriesVpInput[\s\S]*?\}\)\(\);/gi, '');
        }

        const moodleDistPath = path.join(DIST_DIR, 'moodle_ready', folderName, fileName);
        ensureDir(path.dirname(moodleDistPath));
        fs.writeFileSync(moodleDistPath, finalInlineHtml);
        console.log(`✅ Generated Inline CSS Snippet: ${moodleDistPath}`);

        // 2. Generate Standalone Preview with MathJax support.
        // Keep the Moodle output clean, but make local preview comfortable for editing LaTeX.
        let previewHtml = previewTemplate
            .replace('{{TITLE}}', title)
            .replace('{{CONTENT}}', content);

        // Convert <jsxgraph> tags to <script> for standard browser previews to render correctly
        previewHtml = previewHtml
            .replace(/<jsxgraph[^>]*>/gi, '<script type="text/javascript">')
            .replace(/<\/jsxgraph>/gi, '</script>');

        const previewDistPath = path.join(DIST_DIR, 'previews', folderName, fileName);
        ensureDir(path.dirname(previewDistPath));
        fs.writeFileSync(previewDistPath, previewHtml);
        console.log(`✅ Generated Standalone Preview: ${previewDistPath}`);
    });

    console.log('✨ Build completed successfully!');
}

build();
