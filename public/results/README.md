Artwork exports for the results page.

Each section ships a CSS/SVG stand-in so the page is never broken by a missing
file. Dropping the real export here (exact filename) layers it over the
stand-in automatically — no code change.

Everything here is JPEG at quality 92. Nothing in public/ is processed by the
build — whatever size a file is here is the size it ships at — so save
photographic artwork as JPEG, not PNG. Reserve PNG for artwork that genuinely
needs an alpha channel; none of these do, and the three that were PNG cost
2.2MB between them for no gain.

Present (extracted from the design mocks):
  section-1-mirror.jpg        Section 1 backdrop, desktop. Full 1536x1024
                              frame with the mock's baked-in copy painted out
                              so the live text sits on clean black.
  section-1-mirror-mobile.jpg Section 1, mobile crop (mirror + pedestal only)
  section-8c-art.jpg          Carousel slide 3, portrait collage
  section-8d.jpg              Carousel slide 4, constellation (chrome trimmed
                              so the live sparkle badge and dots aren't doubled)
  section-8f.jpg              Carousel slide 6, memory wall, landscape
  section-8f-mobile.jpg       Carousel slide 6, memory wall, portrait
  section-6-dusk.jpg          Section 6 dusk path, signpost, doors, photographs
                              (cropped from section5.png, clear of the copy)
  section-6-dusk-mobile.jpg   Section 6, phone crop (from section5_mobile.png).
                              The landscape one gets cropped to a band by
                              object-cover in the phone layout's shorter box.
  section-7-sunrise.jpg       Section 7 sunrise over mountain ridges. Mobile
                              reuses this file, masked into the upper right.
  section-8-doorway.jpg       Section 8 doorway, desktop. Full frame with the
                              left painted cream and feathered.
  section-8-doorway-mobile.jpg  Section 8, phone crop (steps + doorway only)
  section-9-door.jpg          Golden doorway for the next-chapter CTA. Carries
                              the mock's own ground, so it is drawn with
                              mix-blend-mode: darken and a feathered mask.
  section-8a-bg.jpg           Carousel slide 1 sunrise mountains. The mock
                              bakes the badge, dot row, heading and scroll cue
                              over the photograph, so this one is inpainted
                              rather than cropped — see tools/repair-8a-bg.sh.
