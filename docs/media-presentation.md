# Media for the presentation

The default voice-driven mode now uses a four-second reading interval and splits
the remaining narration time equally among media frames. See `narration.md`.
The five-second timings below apply only to manual mode (`?autoplay=off`).

The current source is `../Ảnh theo section - thứ tự Word`, the numbered review
folders updated by the owner. All 48 folder assignments, including empty folders,
are recorded in `assets/media/manifest.json`. Empty folders have no slideshow.
Files repeated intentionally across folders share one optimized asset; assignments
are not silently removed. Original files are never modified.

To import a revised folder, install Pillow, pillow-heif and imageio-ffmpeg, then run:

```powershell
python scripts/import-section-media.py '../Ảnh theo section - thứ tự Word'
node scripts/check-section-media.mjs
```

The importer converts photographs to WebP at up to 1920 pixels, applies EXIF
orientation, and creates H.264/AAC MP4 copies with fast-start metadata. The three
section 32 videos are pn1, pn7 and pn8. A poster is exported for each video.

Presentation behavior:

- Each topic's first page retains its assigned media thumbnail.
- Opening and closing pages use only their background photo, without an expanding thumbnail.
- The club overview retains three poster columns; their galleries expand in rotation.
- The expansion starts after 5 seconds; individual photos stay for 5 seconds.
- Section 32 uses a full-viewport black stage without cropping the video.
- Videos play muted, in source filename order, through their full durations.
- The next video preloads while the current video plays.
- After the final item, the stage closes and another 5-second reading period starts.
- Navigation, resizing and tab hiding cancel the stage and pause videos.
- `?motion=reduced` remains an explicit opt-out from automatic presentation motion.

Fullscreen here means the complete web viewport, not an automatic change to the
browser's fullscreen permission/state. F11 on the presentation laptop can also
hide browser chrome. Default animation is independent of the OS motion setting.

Award counters are displayed at their final source values immediately. Their
highlight is restarted on each section entry; competition names are checked
against a baseline transcribed from the Word report.

## Presentation monitors

Layout is checked for the owner's two 1920x1080 monitors and one 2560x1440
monitor, including 1920x960 and 2560x1320 browser viewports. Sections center their
heading and body together. Single-statistic pages center their reading content
independently of the small media thumbnail. Short pages use larger text rather
than stretched spacing. Sections 19-25 use the bundled Noto Sans variable font
under the accompanying OFL license to avoid reliance on local font substitutions.
