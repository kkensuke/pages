#!/bin/sh
# sh scripts/make-photo-thumbs.sh — write display copies of public/photos/* to public/photos/thumbs/.
# Long edge 1600px. Only the ICC profile is kept (Display P3), so colors match the originals.
# Needs ImageMagick. Re-run after adding a photo; existing, up-to-date thumbnails are skipped.
set -e
cd "$(dirname "$0")/../public/photos"
magick=$(command -v magick || command -v convert)
mkdir -p thumbs
for f in *.[jJ][pP][gG] *.[jJ][pP][eE][gG]; do
  [ -f "$f" ] || continue
  [ "thumbs/$f" -nt "$f" ] && continue
  "$magick" "$f" -auto-orient -resize '1600x1600>' -sampling-factor 4:2:0 -quality 82 -interlace Plane +profile '!icc,*' "thumbs/$f"
  echo "thumbs/$f"
done
