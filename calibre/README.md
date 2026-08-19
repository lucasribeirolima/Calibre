# Calibre

A browser tool that measures pupillary distance (PD) from a photo, using a
standard ID card as a scale reference. No app to install, no backend, no
uploads leaving your browser.

## Why I built this

My girlfriend needed to buy glasses online and had no idea how to measure
her own pupillary distance, the one number every online eyewear site asks
for and almost nobody knows offhand. I looked into how the existing free
tools do it, and the trick turned out to be simple: hold a standard card
(any credit card or ID) next to your face, since it's always exactly
85.6mm wide (ISO/IEC 7810), and that gives you a fixed reference to convert
pixels into millimeters. I built my own version of that, partly to actually
solve the problem, and partly as a from-scratch React project. I'd never
used React before starting this.

## How it works

1. **Calibrate scale**: click both edges of the card in the photo. Since a
   card's real-world width is fixed and known, the pixel distance between
   those two clicks tells you exactly how many pixels equal one millimeter
   in that photo.
2. **Mark pupils**: click the center of each pupil. That pixel distance,
   run through the same scale, gives you PD in millimeters.
3. Every point is draggable afterward, for fine-tuning.

All of it runs client-side. The photo is read locally via the browser's
`FileReader` API and never leaves the device or touches a server.

## Privacy

Your photo never leaves your device: everything runs client-side, by
design. Reading the file and drawing the markers all happens in your
browser's own memory, and it's gone the moment you close or refresh the
tab. No account, no upload, no tracking, nothing stored. A photo of your
own face is worth building that way from the start.

## Tech

- React (hooks: `useState`, `useRef`, `useEffect`), no other libraries
- Plain CSS, no framework
- No backend: the "server" is just the browser doing geometry

## What I'd improve next

Right now calibration is fully manual (click the card edges, click the
pupils yourself). The natural next step is automatic pupil detection, using
a client-side face-landmark model (face-api.js or MediaPipe's Face
Landmarker) that places the markers automatically, with manual
click-to-adjust as a correction step rather than the primary flow. I kept
v1 manual-only on purpose: it's 100% reliable with zero external
dependencies, which mattered more for a first working version than
automating a step I could already do by hand.

Also on the list: monocular PD (splitting the measurement left/right
around the nose bridge, which some lens labs want separately) and basic
tilt-detection to warn if the photo isn't level.

## Accuracy

This gives a genuinely useful estimate, not a clinical measurement.
Typical error is around +-2mm, mostly from click precision and
how flat the card sits against the face. Fine for most single-vision
lenses; for high prescriptions or progressives, confirm with an optician.