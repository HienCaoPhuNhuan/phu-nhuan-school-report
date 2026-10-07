# Narration

The opening page has no voice and advances after five seconds. All subsequent
topics play the corresponding narration in `assets/voice/manifest.json` and
advance on the audio element's `ended` event. The closing page stays visible.

The audio playback position is the shared clock: text appears for four seconds,
then the remaining duration is divided equally among all assigned media frames.
Topic subpages share one audio track; their time boundaries are proportional to
body word counts. Manual navigation to a subpage seeks to its boundary. Manual
navigation to another topic stops the previous audio and starts the new track.
Resize preserves the track position. Hidden tabs pause playback.

During image playback a separate compact title moves to the top of a full-viewport
media layer. Reading layouts remain unchanged. Images occupy the remaining space
with `object-fit: contain` and top alignment; they are never cropped to fill it.
The same compact-title layout applies to manual photo playback.

Section 32 uses three separate silent, accelerated video copies. The original
media is unchanged. Videos occupy the full browser viewport, synchronized to
the narration clock; they do not request native browser fullscreen.

Audible autoplay is attempted automatically. Browser permission cannot be
bypassed by JavaScript. If playback is denied, timing waits and a temporary
enable-sound button appears. A user gesture resumes the narration and timing.
Use `?autoplay=off` for the original manual presentation mode, or
`?motion=reduced` to reduce visual movement without disabling narration.

To reimport voices, retain the source `voice/manifest.json` and WAV files and run
`scripts/import-voice.py` with Python and `imageio_ffmpeg` available. Sources in
`voice/` are ignored by Git; only optimized web assets are published.
