const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.py')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (!content.includes('sys.stdout.reconfigure')) {
                // Find first import statement
                const importMatch = content.match(/^import .*/m);
                if (importMatch) {
                    const snippet = `import sys\nif hasattr(sys.stdout, 'reconfigure'):\n    sys.stdout.reconfigure(encoding='utf-8')`;
                    content = content.replace(importMatch[0], snippet + '\n' + importMatch[0]);
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Updated ${fullPath}`);
                }
            }
        }
    }
}

processDir(path.join(__dirname, 'scripts'));
