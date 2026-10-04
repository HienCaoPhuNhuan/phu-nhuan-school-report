import { readFile, writeFile, mkdir, copyFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = path.resolve(root, '../Hình ảnh');
const output = path.resolve(root, process.argv[2] || '../Ảnh theo section');
const mapping = JSON.parse(await readFile(path.join(root, 'qa/section-photo-map.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(root, 'assets/photos/manifest.json'), 'utf8'));
const photos = new Map(Object.values(manifest).flat().map(photo => [photo.src, photo]));
const rows = [['Section', 'ID', 'Tên section', 'Ảnh kiểm tra', 'Ảnh gốc', 'Ảnh website']];
await mkdir(output, { recursive: true });
let total = 0;
for (const section of mapping) {
  const name = `${String(section.number).padStart(2, '0')} - ${section.title.replace(/[<>:"/\\|?*]/g, '-')}`;
  const folder = path.join(output, name);
  await mkdir(folder, { recursive: true });
  for (const [index, src] of section.images.entries()) {
    const photo = photos.get(src);
    if (!photo) throw new Error('Unknown photo: ' + src);
    const original = path.resolve(sourceRoot, photo.source);
    if (!original.startsWith(sourceRoot + path.sep)) throw new Error('Photo path outside source folder');
    let input = original;
    let basename = path.basename(photo.source);
    try { await access(original); }
    catch (error) {
      if (error.code !== 'ENOENT' || !/\.(mp4|mov|avi) \(khung hình tại giây [\d.]+\)$/i.test(photo.source)) throw error;
      input = path.join(root, src);
      basename = 'Khung hình video - ' + path.basename(src);
    }
    const filename = `${String(index + 1).padStart(2, '0')} - ${basename}`;
    const target = path.join(folder, filename);
    await copyFile(input, target);
    const hash = bytes => createHash('sha256').update(bytes).digest('hex');
    if (hash(await readFile(input)) !== hash(await readFile(target))) throw new Error('Copy differs: ' + filename);
    rows.push([String(section.number).padStart(2, '0'), section.id, section.title, path.join(name, filename), photo.source, src]);
    total++;
  }
  const description = section.images.length
    ? `Section ${section.number}: ${section.title}\n${section.images.length} ảnh đang được dùng trên website (bao gồm toàn bộ ảnh chuyển tự động).\nẢnh tĩnh được sao chép nguyên bản; khung hình trích từ video dùng ảnh WebP của website. Không thay đổi file gốc.\n`
    : `Section ${section.number}: ${section.title}\nSection này hiện không dùng ảnh trên website.\n`;
  await writeFile(path.join(folder, 'THONG-TIN.txt'), description, 'utf8');
}
const csv = rows.map(row => row.map(cell => '"' + cell.replace(/"/g, '""') + '"').join(',')).join('\r\n');
await writeFile(path.join(output, 'Danh sách ảnh theo section.csv'), '\ufeff' + csv, 'utf8');
await writeFile(path.join(output, 'THONG-TIN.txt'),
  `ẢNH THEO SECTION\n\n${mapping.length} folder tương ứng các mục 00–${mapping.length - 1} trên website, gồm ${total} ảnh.\nDựa trên website trình chiếu Full HD, không phải tất cả ảnh có trong folder gốc.\nFolder không có ảnh được ghi rõ trong THONG-TIN.txt.\nDanh sách CSV ghi tên ảnh kiểm tra, đường dẫn ảnh gốc và ảnh website để đối chiếu.\nCác bản sao chỉ phục vụ kiểm tra, không tự cập nhật website khi thay đổi.\n`, 'utf8');
console.log(JSON.stringify({ output, sections: mapping.length, copiedAndVerified: total }));
