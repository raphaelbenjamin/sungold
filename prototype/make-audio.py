"""Regenerate the offline Italian narration and its word cues."""
import io
import json
from pathlib import Path
import subprocess
import wave

PAGES = [
    "Ogni mattina attraverso la città. Dietro la stazione c’è un piccolo giardino.",
    "Qui il tempo sembra più lento. Mi siedo e ascolto gli uccelli.",
    "Prima di andare via, saluto il giardiniere.",
]

root = Path(__file__).resolve().parent
cue_pages = []
for number, page in enumerate(PAGES):
    frames = []
    cues = []
    elapsed = 0
    for word in page.split():
        data = subprocess.check_output(["espeak-ng", "-v", "it", "-s", "150", "--stdout", word])
        with wave.open(io.BytesIO(data)) as speech:
            rate = speech.getframerate()
            width = speech.getsampwidth()
            audio = speech.readframes(speech.getnframes())
        cues.append(round(elapsed / (rate * width), 4))
        frames.append(audio)
        elapsed += len(audio)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(rate),
                    "-ac", "1", "-i", "-", str(root / "public/media" / f"garden-{number}.mp3")],
                   input=b"".join(frames), check=True)
    cue_pages.append(cues)
(root / "cues.json").write_text(json.dumps(cue_pages, indent=2) + "\n")
