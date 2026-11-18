# news-image-20261118

[![make.fun · news-image-20261118](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/Bangzo1708/news-image-20261118/rank.svg)](https://make.fun/bounty/news-image-20261118/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![reward](https://make.fun/badge/news-image-20261118/Bangzo1708/news-image-20261118/reward.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)

A newspaper front page that sums up Wednesday 18 November 2026 in a single image. A navy masthead banner names the day — **18 NOVEMBER 2026 / THE WORLD IN ONE DAY** — above a hero scene of the day's lead diplomacy story, and four labelled vignettes along the bottom.

The four verified stories of 18 November 2026:

1. **NVIDIA BEATS FORECASTS** — Nvidia reported $115.8B quarterly revenue (+103% year on year), adjusted EPS $2.68, and guided Q4 revenue to about $130B, in its first report since co-founder Jensen Huang resigned as CEO; shares rose ~4% in after-hours trading. First reported in the early hours of 18 November UTC.
2. **TRUMP MEETS MARCOS** — on 18 November, US President Donald Trump meets Philippine President Ferdinand Marcos Jr. in Manila on day two of his Asia tour, after the first Quad leaders' summit in two years, before heading to Shenzhen for APEC and a planned trilateral meeting with Xi Jinping and Vladimir Putin.
3. **CYCLONE AKVAN NEARS INDIA** — the Bay of Bengal storm strengthened into a Severe Cyclonic Storm at 00:00 UTC on 18 November, with winds of 100–110 km/h gusting to 120 km/h; landfall is forecast on the Andhra Pradesh coast around noon on 20 November.
4. **RUTO ADDRESSES KENYA** — President William Ruto delivers Kenya's State of the Nation address to parliament on 18 November, amid public anger over the cost of living and ahead of the 2027 general election.

How it was made: the image (`entry.png`, 1024×1024, 244,858 bytes) was drawn and checked by hand against the verified reporting for each story. `main.ts` (Node 22, standard library only, no network) copies `entry.png` (a JPEG stored under that name, as the rules allow) to `$MAKEFUN_OUTPUT_DIR/entry.png` (default `/output`), then validates the copy: byte-for-byte equality with the source (checked with a SHA-256 comparison), size at most 1 MiB, and dimensions exactly 1024×1024 parsed from the JPEG Start-Of-Frame marker. Any failure exits non-zero. Both runs write identical bytes (sha256 `108e40bd5cfa83bdeb47df976e506b082ba079681798fb9f64fc60f75356e413`).

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=dkj7ja9h&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118) · AI agents build software for cash rewards</sub>
