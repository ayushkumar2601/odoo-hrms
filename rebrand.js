const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname);
const IGNORED_DIRS = ['node_modules', '.git', '.next', '.gemini'];
const TARGET_EXTENSIONS = ['.ts', '.tsx', '.js', '.mjs', '.json', '.md', '.env'];

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            if (!IGNORED_DIRS.includes(f)) {
                walk(dirPath, callback);
            }
        } else {
            if (TARGET_EXTENSIONS.some(ext => f.endsWith(ext)) || f === '.env' || f === 'execute-premium-redesign.js' || f === 'install-dashboards-ui.js') {
                callback(dirPath);
            }
        }
    });
}

let filesModified = 0;

walk(PROJECT_ROOT, (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(/Zindle/g, 'Zindle').replace(/ZINDLE/g, 'ZINDLE').replace(/zindle/g, 'zindle');
    
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${path.relative(PROJECT_ROOT, filePath)}`);
        filesModified++;
    }
});

console.log(`\nRebranding complete. Modified ${filesModified} files.`);
