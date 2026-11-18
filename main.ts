// news-image-20261118 — "Sum up 18 November's world news in one image"
//
// Design: the entry is a single editorial front-page image (entry.png, a JPEG
// stored under that name, as the rules allow). A navy masthead banner names the
// day in big type — "18 NOVEMBER 2026 / THE WORLD IN ONE DAY" — above a hero
// photograph-style scene of the day's lead diplomacy story, US President Donald
// Trump shaking hands with Philippine President Ferdinand Marcos Jr. in Manila.
// Four labelled vignettes along the bottom sum up the rest of the day:
//
//   1. NVIDIA BEATS FORECASTS — Nvidia reported $115.8B quarterly revenue
//      (+103% year on year), EPS $2.68, and guided Q4 to ~$130B, in its first
//      report since co-founder Jensen Huang resigned as CEO; shares rose
//      after hours. First reported in the early hours of 18 Nov UTC.
//   2. TRUMP MEETS MARCOS — on Wednesday 18 November, Trump meets President
//      Marcos Jr. in Manila on day two of his Asia tour, after the first Quad
//      leaders' summit in two years, before heading to Shenzhen for APEC and
//      a planned trilateral with Xi Jinping and Vladimir Putin.
//   3. CYCLONE AKVAN NEARS INDIA — the Bay of Bengal storm strengthened into
//      a Severe Cyclonic Storm at 00:00 UTC on 18 November, winds 100-110
//      km/h gusting to 120, with landfall forecast on the Andhra Pradesh
//      coast around noon on 20 November.
//   4. RUTO ADDRESSES KENYA — President William Ruto delivers Kenya's State
//      of the Nation address to parliament on 18 November, amid public anger
//      over the cost of living and ahead of the 2027 general election.
//
// The program copies ./entry.png to $MAKEFUN_OUTPUT_DIR/entry.png (default
// /output) and then validates the copy hard: it re-reads the written file and
// requires byte-for-byte equality with the source, parses the JPEG Start-Of-
// Frame marker to confirm the image is exactly 1024x1024, and requires the
// size to be at most 1 MiB (1048576 bytes). Any failure exits non-zero with a
// clear message, so a bad copy can never pass silently.
//
// Node 22 standard library only; no network; deterministic — the same bytes
// are written on every run.
//
// Run locally:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1048576; // 1 MiB
const EXPECTED_WIDTH = 1024;
const EXPECTED_HEIGHT = 1024;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Parse the JPEG Start-Of-Frame marker and return [width, height].
// Walks the segment list from the SOI marker (0xFFD8) and reads the first
// SOF0/SOF1/SOF2 frame header it finds; throws on a malformed file.
function jpegDimensions(buf: Buffer): [number, number] {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) {
    throw new Error('not a JPEG file: missing SOI marker 0xFFD8');
  }
  let offset = 2;
  while (offset + 1 < buf.length) {
    if (buf[offset] !== 0xff) {
      throw new Error(`malformed JPEG: expected marker 0xFF at offset ${offset}`);
    }
    const marker = buf[offset + 1];
    // Standalone markers carry no length field.
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      offset += 2;
      continue;
    }
    if (offset + 4 > buf.length) {
      throw new Error('malformed JPEG: truncated segment header');
    }
    const segmentLength = buf.readUInt16BE(offset + 2);
    if (segmentLength < 2 || offset + 2 + segmentLength > buf.length) {
      throw new Error('malformed JPEG: segment length runs past end of file');
    }
    // SOF0 (baseline), SOF1 (extended sequential) and SOF2 (progressive).
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      if (segmentLength < 7) {
        throw new Error('malformed JPEG: SOF segment too short for dimensions');
      }
      const height = buf.readUInt16BE(offset + 5);
      const width = buf.readUInt16BE(offset + 7);
      return [width, height];
    }
    offset += 2 + segmentLength;
  }
  throw new Error('malformed JPEG: no Start-Of-Frame marker found');
}

function main(): void {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const sourcePath = join(scriptDir, 'entry.png');
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const destPath = join(outputDir, 'entry.png');

  // The source image ships with the repository; it must exist and be a JPEG.
  let source: Buffer;
  try {
    source = readFileSync(sourcePath);
  } catch {
    fail(`cannot read source image ${sourcePath}`);
  }
  if (source.length === 0 || source[0] !== 0xff || source[1] !== 0xd8) {
    fail('source image is not a JPEG (missing SOI marker 0xFFD8)');
  }
  if (source.length > MAX_BYTES) {
    fail(`source image is ${source.length} bytes, over the 1 MiB limit`);
  }

  mkdirSync(outputDir, { recursive: true });
  copyFileSync(sourcePath, destPath);

  // Validate the copy: re-read it and require byte-for-byte equality, and
  // confirm the SHA-256 digests match so the check is not just a length one.
  const copied = readFileSync(destPath);
  const sourceHash = createHash('sha256').update(source).digest('hex');
  const copiedHash = createHash('sha256').update(copied).digest('hex');
  if (!copied.equals(source) || copiedHash !== sourceHash) {
    fail(
      `copied image differs from the source image (source sha256 ${sourceHash}, ` +
        `output sha256 ${copiedHash})`,
    );
  }

  // Validate the file size on disk matches what we wrote.
  const onDisk = statSync(destPath);
  if (onDisk.size !== source.length) {
    fail(`output size ${onDisk.size} does not match source size ${source.length}`);
  }
  if (onDisk.size > MAX_BYTES) {
    fail(`output image is ${onDisk.size} bytes, over the 1 MiB limit`);
  }

  // Validate the dimensions from the JPEG SOF marker.
  const [width, height] = jpegDimensions(copied);
  if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
    fail(`output image is ${width}x${height}, expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`);
  }

  // The JPEG must end with the End-Of-Image marker.
  if (copied[copied.length - 2] !== 0xff || copied[copied.length - 1] !== 0xd9) {
    fail('output JPEG is truncated: missing EOI marker 0xFFD9');
  }

  console.log(
    `wrote ${destPath} (${onDisk.size} bytes, ${width}x${height} JPEG, ` +
      `sha256 ${copiedHash})`,
  );
}

main();
