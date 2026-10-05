"""Import the user's numbered section folders without changing original files."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys

from PIL import Image, ImageOps
import pillow_heif
import imageio_ffmpeg

pillow_heif.register_heif_opener()
root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
output = root / 'assets' / 'media'
output.mkdir(parents=True, exist_ok=True)
manifest = {}
known = {}
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
for folder in sorted(source.iterdir()):
    if not folder.is_dir() or not folder.name[:2].isdigit():
        continue
    items = []
    for file in sorted(folder.iterdir(), key=lambda f: f.name.casefold()):
        extension = file.suffix.lower()
        if extension not in {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.mp4', '.mov'}:
            continue
        digest = hashlib.sha256(file.read_bytes()).hexdigest()[:20]
        if digest not in known:
            video = extension in {'.mp4', '.mov'}
            target = output / (digest + ('.mp4' if video else '.webp'))
            poster = output / (digest + '-poster.webp')
            if video:
                if not target.exists():
                    subprocess.run([ffmpeg, '-y', '-i', str(file), '-vf',
                        'scale=1920:1080:force_original_aspect_ratio=decrease:force_divisible_by=2',
                        '-c:v', 'libx264', '-preset', 'fast', '-crf', '24', '-pix_fmt', 'yuv420p',
                        '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', str(target)],
                        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                if not poster.exists():
                    subprocess.run([ffmpeg, '-y', '-ss', '1', '-i', str(target), '-frames:v', '1',
                        str(poster)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                with Image.open(poster) as image:
                    width, height = image.size
            else:
                with Image.open(file) as original:
                    image = ImageOps.exif_transpose(original).convert('RGB')
                    image.thumbnail((1920, 1920))
                    width, height = image.size
                    if not target.exists():
                        image.save(target, 'WEBP', quality=86, method=4)
            known[digest] = {'src': 'assets/media/' + target.name,
                'type': 'video' if video else 'image', 'width': width, 'height': height}
            if video:
                known[digest]['poster'] = 'assets/media/' + poster.name
        items.append({**known[digest], 'source': folder.name + '/' + file.name})
        print(folder.name[:2], file.name, flush=True)
    manifest[folder.name[:2]] = items
(output / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print('Imported', sum(map(len, manifest.values())), 'media assignments;', len(known), 'unique files.', flush=True)
