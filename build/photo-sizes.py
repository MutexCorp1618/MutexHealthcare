"""Make the smaller copies of every photo in assets/people/ that the pages use on smaller screens.

   Run after adding or replacing a photo:   python build/photo-sizes.py
   (needs Python 3 with Pillow:  pip install pillow)

   For each assets/people/<name>.jpg it writes assets/people/480/, 960/ and 1600/<name>.jpg, resized with
   Lanczos and lightly sharpened, so photos stay crisp. The original (2400 px; 3840 px for the home page
   team photo) is used on large and high-resolution screens. Copies that are newer than their original are
   skipped. Sizes must match PHOTO_SIZES in js/data.js. """
import os, sys
from PIL import Image, ImageFilter

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'people')
SIZES = [480, 960, 1600]
made = 0
for f in sorted(os.listdir(ROOT)):
    if not f.endswith('.jpg'):
        continue
    src = os.path.join(ROOT, f)
    im = None
    for w in SIZES:
        out_dir = os.path.join(ROOT, str(w))
        os.makedirs(out_dir, exist_ok=True)
        out = os.path.join(out_dir, f)
        if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src):
            continue
        if im is None:
            im = Image.open(src).convert('RGB')
        if im.width > w:
            small = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            small = small.filter(ImageFilter.UnsharpMask(radius=0.8, percent=60, threshold=2))
        else:
            small = im
        small.save(out, quality=86, optimize=True, progressive=True)
        made += 1
# remove copies whose original is gone
for w in SIZES:
    d = os.path.join(ROOT, str(w))
    for f in os.listdir(d):
        if not os.path.exists(os.path.join(ROOT, f)):
            os.remove(os.path.join(d, f))
print(f'photo sizes: {made} copies written')
