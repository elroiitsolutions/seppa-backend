const fs = require('fs');
const path = require('path');

function copyJsonFiles(src, dest) {
  if (!fs.existsSync(src)) return;
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyJsonFiles(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyJsonFiles(path.join(__dirname, 'src'), path.join(__dirname, 'dist', 'src'));
console.log('Successfully copied all JSON schemas to dist.');
