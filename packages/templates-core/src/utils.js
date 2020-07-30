const fs = require('fs-extra');
const path = require('path');

async function fileContentsRecursive(dir, rootPath, includeNodeModules) {
  if (!rootPath) {
    rootPath = dir;
  }
  if (!(await fs.pathExists(dir))) {
    return [];
  }
  if (dir.indexOf('node_modules') !== -1 && !includeNodeModules) {
    return [];
  }

  const files = fs.readdirSync(dir).filter((name) => !name.includes('.json'));

  // const files = await fs.readdir(dir);
  return (
    await Promise.all(
      files.map(async (file) => {
        const fileName = path.join(dir, file);
        const stats = await fs.lstat(fileName);
        if (!stats.isDirectory()) {
          const content = await fs.readFile(fileName, 'utf-8');
          return [
            {
              fileName: fileName.replace(rootPath, '').replace(/\\/g, '/'),
              content,
            },
          ];
        } else {
          return fileContentsRecursive(fileName, rootPath, includeNodeModules);
        }
      })
    )
  ).reduce((a, b) => a.concat(b), []);
}

module.exports = {
  fileContentsRecursive,
};
