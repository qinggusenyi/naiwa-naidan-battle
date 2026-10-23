const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=__dirname;
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const assets=[...new Set([...source.matchAll(/['"]([^'"<>]+\.(?:png|jpe?g|webp|gif|svg|mp3|m4a|wav|ogg))['"]/gi)].map(match=>match[1]))];
const mime={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',svg:'image/svg+xml',mp3:'audio/mpeg',m4a:'audio/mp4',wav:'audio/wav',ogg:'audio/ogg'};
let html=source;
for(const name of assets){
  const extension=path.extname(name).slice(1).toLowerCase();
  const data=fs.readFileSync(path.join(root,name)).toString('base64');
  html=html.replaceAll(name,`data:${mime[extension]};base64,${data}`);
}
if(/['"][^'"<>]+\.(?:png|jpe?g|webp|gif|svg|mp3|m4a|wav|ogg)['"]/i.test(html))throw Error('Some media files were not embedded');
new vm.Script(html.split('<script>')[1].split('</script>')[0]);
const output=path.join(root,'奶蛙奶蛋-手机单文件版.html');
fs.writeFileSync(output,html);
console.log(`Created ${path.basename(output)} (${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MiB; ${assets.length} media files embedded)`);
