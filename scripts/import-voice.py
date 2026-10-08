"""Prepare web narration and silent video cuts without changing source files."""
import hashlib
import json
from pathlib import Path
import subprocess
import wave

import imageio_ffmpeg

root = Path(__file__).resolve().parents[1]
source = root / 'voice'
output = root / 'assets' / 'voice'
output.mkdir(parents=True, exist_ok=True)
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
original = json.loads((source / 'manifest.json').read_text(encoding='utf-8-sig'))
manifest = {}
for item in original['sections'].values():
    wav = source / item['audio']
    digest = hashlib.sha256(wav.read_bytes()).hexdigest()[:20]
    target = output / (digest + '.mp3')
    with wave.open(str(wav)) as audio:
        duration = audio.getnframes() / audio.getframerate()
    if not target.exists():
        subprocess.run([ffmpeg, '-y', '-i', str(wav), '-ac', '1', '-ar', '48000',
                        '-c:a', 'libmp3lame', '-b:a', '96k', str(target)],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    manifest[item['id']] = {'src': target.relative_to(root).as_posix(),
                            'duration': round(duration, 4), 'section': item['section']}
media = json.loads((root / 'assets/media/manifest.json').read_text(encoding='utf-8'))
manifest['doi-ngu']['presentationDuration'] = max(manifest['doi-ngu']['duration'], 4 + len(media['01']) * 4)
videos = media['32']
slot = (manifest['co-so-vat-chat']['duration'] - 4) / len(videos)
cuts = {}
for item in videos:
    video = root / item['src']
    reader = imageio_ffmpeg.read_frames(str(video))
    metadata = next(reader)
    reader.close()
    speed = max(1, metadata['duration'] / slot)
    digest = hashlib.sha256((item['src'] + str(slot)).encode()).hexdigest()[:20]
    target = output / (digest + '.mp4')
    if not target.exists():
        subprocess.run([ffmpeg, '-y', '-i', str(video), '-an', '-vf',
                        f'setpts=PTS/{speed},fps=30', '-t', str(slot),
                        '-c:v', 'libx264', '-preset', 'fast', '-crf', '24',
                        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(target)],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    cuts[item['src']] = {'src': target.relative_to(root).as_posix(),
                         'speed': round(speed, 3), 'duration': round(slot, 4)}
    print(f'Video: {speed:.2f}x, {slot:.2f}s', flush=True)
(output / 'manifest.json').write_text(json.dumps({'sections': manifest, 'videos': cuts},
                                               ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Prepared {len(manifest)} narrations and {len(cuts)} silent video cuts.', flush=True)
