#!/bin/bash
# Rebuild the slide-1 background from section8a.png by inpainting every region
# where the mock bakes copy or chrome over the photograph.
#
# Two techniques. Over the sky and the valley mist the background is a smooth
# vertical ramp, so a region is refilled by interpolating between the clean
# scanline above it and the clean scanline below it. The chevron sits close to
# a tree ridge that interpolation would smear, so that one is cloned sideways
# from the matching band of mist to its right. Both are feathered into place
# through an alpha channel.
#
# Measured extents of the baked chrome in the 1536x1024 mock:
#   sparkle badge      x   67..121   y  50..103
#   progress dots      x 1239..1473  y  66..90
#   heading/paragraph  x  115..658   y 200..654
#   "SCROLL TO CONTINUE" x 663..874  y 942..953
#   chevron            x  751..785   y 977..995
#
# Each rect must clear its text by more than the feather ramp (inset + 3*sigma),
# or the ramp eats into the letters and leaves a ghost.
set -euo pipefail

SRC="$HOME/Downloads/Result Page/section8a.png"
WORK=/tmp/s8a
rm -rf "$WORK" && mkdir -p "$WORK"
cp "$SRC" "$WORK/cur.png"

feather() { # w h inset -> alpha.png
  local W=$1 H=$2 F=$3
  magick -size ${W}x${H} xc:black -fill white \
    -draw "rectangle $F,$F $((W - 1 - F)),$((H - 1 - F))" \
    -blur 0x$((F / 3 + 1)) -alpha off -colorspace gray "$WORK/alpha.png"
}

apply() { # x y  (consumes patch.png + alpha.png)
  magick "$WORK/patch.png" "$WORK/alpha.png" \
    -alpha off -compose CopyOpacity -composite "$WORK/patch_rgba.png"
  magick "$WORK/cur.png" "$WORK/patch_rgba.png" -geometry +${1}+${2} \
    -compose Over -composite "$WORK/next.png"
  mv "$WORK/next.png" "$WORK/cur.png"
}

interp() { # x y w h inset — refill from the scanlines above and below
  local X=$1 Y=$2 W=$3 H=$4 F=$5
  # The source rows are blurred horizontally first: stretching a single row's
  # per-pixel grain down the region would print it as vertical stripes. The
  # grain is put back afterwards as noise matched to the photograph's own.
  magick "$WORK/cur.png" -crop ${W}x1+${X}+$((Y - 1)) +repage -blur 0x6 -resize ${W}x${H}\! "$WORK/t.png"
  magick "$WORK/cur.png" -crop ${W}x1+${X}+$((Y + H)) +repage -blur 0x6 -resize ${W}x${H}\! "$WORK/b.png"
  magick "$WORK/t.png" "$WORK/b.png" \
    \( -size ${W}x${H} gradient:black-white \) -composite \
    -attenuate 0.036 +noise Gaussian "$WORK/patch.png"
  feather $W $H $F
  apply $X $Y
}

clone() { # x y w h inset srcx srcy — copy a block from elsewhere in the frame
  local X=$1 Y=$2 W=$3 H=$4 F=$5 SX=$6 SY=$7
  magick "$WORK/cur.png" -crop ${W}x${H}+${SX}+${SY} +repage "$WORK/patch.png"
  feather $W $H $F
  apply $X $Y
}

interp   20  10  150  140 12   # sparkle badge
interp 1200  20  320  130 12   # progress dots
interp   40 155  720  550 14   # heading, divider, paragraph
interp  635 928  260   38  8   # "SCROLL TO CONTINUE"
clone   738 962   62   48  5  806 962   # chevron, from the mist to its right

OUT="$(cd "$(dirname "$0")/.." && pwd)/public/results/section-8a-bg.jpg"
magick "$WORK/cur.png" -quality 92 "$OUT"
magick identify "$OUT"
