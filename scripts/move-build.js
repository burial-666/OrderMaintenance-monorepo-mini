const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const packagesDir = path.resolve(__dirname, '../packages');
const buildDir = path.resolve(__dirname, '../build');

// 创建母项目的 build 文件夹
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}
else{
  fs.rmSync(buildDir,{recursive:true});
  fs.mkdirSync(buildDir);
}
const nameMap = {
  "gd-school": "school",
  "gd-group": "group",
  "gd-engineer": "engineer",
  "gd-login": "login",
  "center": "center"
}
// 遍历每个子项目并将 dist 文件夹复制到母项目的 build 文件夹中
fs.readdirSync(packagesDir).forEach(packageName => {
  const packageDistPath = path.join(packagesDir, packageName, 'dist');
  const targetPath = path.join(buildDir,nameMap[packageName] );
  if (fs.existsSync(packageDistPath)) {
    fse.moveSync(packageDistPath, targetPath);
    console.log(`Copied ${packageDistPath} to ${targetPath}`);
  }
});