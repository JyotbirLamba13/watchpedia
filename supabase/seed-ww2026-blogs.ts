// Seed Watches and Wonders Geneva 2026 blog posts
// Usage: npx tsx supabase/seed-ww2026-blogs.ts

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin = createClient(url, key);

const posts = [
  {
    slug: 'watches-and-wonders-geneva-2026-best-releases',
    title: 'Watches and Wonders Geneva 2026: The 20 Best New Releases',
    excerpt: 'From Patek Philippe\'s Nautilus 50th anniversary to Rolex\'s centennial Oyster Perpetual, here are the watches that defined W&W 2026.',
    tags: ['watches and wonders', 'event coverage', '2026', 'new releases'],
    author: 'Watchpedia',
    published: true,
    published_at: '2026-04-16T10:00:00Z',
    content: `<p>Watches and Wonders Geneva 2026 (April 14–20) is the biggest watch event of the year, with 66 brands unveiling hundreds of new timepieces. From Patek's blockbuster Nautilus anniversary to Rolex's centennial tributes and a wave of skeleton watches, this year's show has delivered. Here are the 20 releases that matter most.</p>

<h2>The Headliners</h2>

<h3>1. <a href="/brands/patek-philippe">Patek Philippe</a> Nautilus 50th Anniversary Collection</h3>
<p>The biggest story of W&W 2026. Patek celebrates 50 years of the Nautilus — the watch that Gerald Genta sketched on a napkin in 1974 — with three limited-edition wristwatches and a desk clock. The headline piece is the ref. 5810/1G-001, a 41mm white gold Nautilus with the ultra-thin calibre 240 micro-rotor movement. No date window. No complications. Just the iconic horizontally embossed blue dial in its purest form. Limited to 2,000 pieces.</p>
<p>The 38mm platinum ref. 5610/1P-001 (limited to 2,000) and the ref. 5810G-001 on strap (limited to 1,000) round out the trio. There's also a stunning 50.7mm Nautilus pocket watch (ref. 958G) in white gold with an 8-day power reserve — a first for the collection.</p>
<p>Read our <a href="/blog/patek-philippe-nautilus-history">complete Nautilus history</a> for the full backstory.</p>

<h3>2. <a href="/brands/rolex">Rolex</a> Oyster Perpetual 100th Anniversary</h3>
<p>Rolex marks 100 years of the Oyster case — the invention that made wristwatches waterproof — with two commemorative models. The Oyster Perpetual 41 in yellow Rolesor (steel and gold) features a slate dial with "100 years" inscribed at 6 o'clock, with the Rolex logo and minute-marker squares in signature green. The Oyster Perpetual 36 "Jubilee Edition" gets a vibrant multicolored lacquer dial with ten distinct colors arranged in a historic Jubilee motif. Both use the calibre 3230.</p>

<h3>3. <a href="/brands/patek-philippe">Patek Philippe</a> Celestial Sunrise/Sunset (Ref. 6105G)</h3>
<p>Patek's technical showstopper: a 47mm white gold astronomical grand complication that displays the times of sunrise and sunset — a first in Patek's modern history. The dial charts the Geneva night sky with star display and moon phases. CHF 350,000. The kind of watch that makes even seasoned collectors pause.</p>

<h3>4. <a href="/brands/rolex">Rolex</a> Cosmograph Daytona in Rolesium</h3>
<p>The Daytona gets a new material combination: Rolesium (Oystersteel with platinum). White enameled dial, anthracite Cerachrom bezel with "suspended" numerals, and — for the first time on a Daytona — a sapphire crystal caseback revealing the movement. This will be the most sought-after Rolex of 2026.</p>

<h2>Best in Show: Sport Watches</h2>

<h3>5. <a href="/brands/rolex">Rolex</a> Yacht-Master II — Next Generation</h3>
<p>The Yacht-Master II has been completely reimagined around the new calibre 4162, featuring a programmable countdown that runs counterclockwise. Available in Oystersteel or 18k yellow gold with a mechanical memory function. A genuine tool watch for competitive sailing.</p>

<h3>6. <a href="/brands/iwc">IWC</a> Pilot's Venturer Vertical Drive</h3>
<p>IWC's most ambitious pilot's watch in years. The 44.4mm case houses the cal. 32722 with a bezel-controlled "vertical drive" system operable with flight gloves. 120-hour power reserve. $28,200 — serious money, but a genuinely new mechanical concept.</p>

<h3>7. <a href="/brands/tudor">Tudor</a> Monarch</h3>
<p>Tudor's surprise hit: a 39mm faceted case with a vintage "California" dial mixing Roman and Arabic numerals. The Manufacture cal. MT5662-2U automatic powers it. At $5,875, this could be the year's best value from a major brand.</p>

<h3>8. Bremont Supernova Chronograph</h3>
<p>The Supernova's dial pattern is inspired by spacecraft solar arrays, and a version of this watch will actually travel to the moon on an upcoming mission. 41mm, cal. BC77 automatic chronograph. $8,000–$8,250. British watchmaking's most significant moment.</p>

<h2>Best in Show: Dress & Complication Watches</h2>

<h3>9. <a href="/brands/patek-philippe">Patek Philippe</a> "The Fox and The Crow" Automaton (Ref. 5249R)</h3>
<p>Patek's first modern automaton wristwatch. A 43mm rose gold case with an on-demand animated scene from Aesop's fable, featuring a mechanical fox and crow. CHF 320,000. Only Patek could make this work at a wristwatch scale.</p>

<h3>10. <a href="/brands/cartier">Cartier</a> Santos-Dumont</h3>
<p>Cartier revamps the Santos-Dumont with a precious-metal mesh bracelet inspired by 1920s designs and a gilded obsidian dial option. The cal. 430 MC hand-wound movement. $7,350–$62,000 depending on material. The Santos-Dumont is arguably the first modern wristwatch (1904), and this update honors that legacy beautifully.</p>

<h3>11. <a href="/brands/cartier">Cartier</a> Roadster Returns</h3>
<p>One of the most anticipated comebacks in recent memory. The Roadster, discontinued in 2012, returns with automotive cues, a curved tonneau profile, and unmistakable dial language. Cartier is reasserting its personality beyond the Tank and Santos.</p>

<h3>12. <a href="/brands/piaget">Piaget</a> Altiplano Ultimate Concept Tourbillon</h3>
<p>Just 2mm thick. A cobalt alloy case with a tiger-eye stone dial and a tourbillon that seems to defy physics at this thinness. Piaget continues to push the boundaries of ultra-thin watchmaking in a way no other brand can match.</p>

<h3>13. <a href="/brands/jaeger-lecoultre">Jaeger-LeCoultre</a> Master Hybris Inventiva Gyrotourbillon À Stratosphère</h3>
<p>The name is a mouthful, but the watch is extraordinary: a triple-axis tourbillon weighing just 0.78 grams. JLC's most complex movement ever, and a strong contender for the most impressive complication at the show.</p>

<h3>14. <a href="/brands/a-lange-sohne">A. Lange & Söhne</a> New Releases</h3>
<p>Lange brings its trademark German precision to Geneva. While specific models are still being revealed, anything from Glashütte with the three-quarter plate and hand-engraved balance cock commands attention.</p>

<h2>Best in Show: Chronographs</h2>

<h3>15. <a href="/brands/tag-heuer">TAG Heuer</a> Monaco Evergraph</h3>
<p>A 40mm grade 5 titanium Monaco with the experimental TH80-00 movement: a 5 Hz chronograph with flexible components and 70-hour power reserve. $28,500. TAG Heuer is proving it can compete at the high-complications level, not just the accessible-luxury tier.</p>

<h3>16. <a href="/brands/zenith">Zenith</a> G.F.J. Tantalum</h3>
<p>Limited to just 20 pieces, this 39.15mm watch uses the legendary calibre 135 hand-wound movement in a tantalum case with a black onyx dial and mother-of-pearl small seconds. COSC-certified. CHF 83,400. A collector's grail.</p>

<h3>17. Parmigiani Fleurier Tonda PF Chronograph Mystérieux</h3>
<p>A hidden-seconds chronograph — the chronograph seconds hand is invisible until activated. The cal. PF053 automatic in a 40mm case. CHF 36,900. Understated brilliance from one of the most underrated brands in Swiss watchmaking.</p>

<h2>Surprises & Dark Horses</h2>

<h3>18. <a href="/brands/rolex">Rolex</a> Day-Date in Jubilee Gold</h3>
<p>Rolex debuts a new proprietary alloy: Jubilee gold, which shifts between yellow, grey, and pink tones. Light green aventurine dial. A material innovation that only Rolex, with its in-house foundry, could create.</p>

<h3>19. <a href="/brands/grand-seiko">Grand Seiko</a> Mystic Waterfall & U.F.A Diver</h3>
<p>Grand Seiko continues to prove that Japanese craftsmanship rivals anything from Switzerland. The Mystic Waterfall dial texture and the U.F.A Diver represent GS's growing ambitions in both dress and tool watch categories.</p>

<h3>20. Universal Genève Cabriolet</h3>
<p>The revival of Universal Genève continues with the Cabriolet — a reversible Art Deco case design with the ultra-slim UG-111 hand-wound movement. $12,500–$64,500. A brand comeback story worth watching.</p>

<h2>What W&W 2026 Tells Us About Watchmaking</h2>
<p>Three clear trends emerge from this year's show:</p>
<ul>
<li><strong>Anniversaries drive ambition:</strong> Patek's Nautilus 50th and Rolex's Oyster centennial pushed both brands to create their most ambitious collections in years.</li>
<li><strong>Skeleton and openwork dials are dominant:</strong> From Hermès to Patek to TAG Heuer, brands are exposing their movements like never before.</li>
<li><strong>Smaller sizes are back:</strong> H. Moser's 28mm Streamliner, Rolex's 28mm and 34mm gold OPs, and Patek's 38mm Nautilus all signal that the oversized era is over.</li>
</ul>

<p>We'll be updating this article throughout the week as more releases are announced. Check our <a href="/brands/rolex">Rolex</a>, <a href="/brands/patek-philippe">Patek Philippe</a>, and <a href="/brands/omega">Omega</a> brand pages for full collection details.</p>`,
  },
  {
    slug: 'watches-and-wonders-2026-trends',
    title: 'The 5 Biggest Trends from Watches and Wonders 2026',
    excerpt: 'Skeleton dials, smaller cases, gold-on-gold, anniversary fever, and the death of the oversized watch. Here\'s what W&W 2026 means for the industry.',
    tags: ['watches and wonders', 'trends', '2026', 'industry'],
    author: 'Watchpedia',
    published: true,
    published_at: '2026-04-16T14:00:00Z',
    content: `<p>Watches and Wonders Geneva 2026 isn't just about individual releases — it's about where the watch industry is headed. After walking the show floor and analyzing hundreds of new timepieces from 66 brands, five definitive trends emerge. These will shape what you see in watch shops, on wrists, and in collections for the next several years.</p>

<h2>1. Skeleton Watches Go Mainstream</h2>
<p>Skeleton dials — where the dial is removed or cut away to reveal the movement beneath — were everywhere at W&W 2026. This isn't new (skeleton watches have existed since the 18th century), but the scale and sophistication of this year's offerings mark a turning point.</p>
<p><strong>Key releases:</strong></p>
<ul>
<li><a href="/brands/patek-philippe">Patek Philippe</a> Cubitus Skeleton Perpetual Calendar (ref. 5840P) — the first grand complication in the Cubitus line, with a fully openworked movement visible through both sides. 45mm platinum. CHF 150,000.</li>
<li>Hermès H08 Squelette, Arceau Samarcande, and Slim d'Hermès Squelette Lune — three skeleton watches from a brand known for leather goods, proving Hermès is a serious watchmaker.</li>
<li><a href="/brands/tag-heuer">TAG Heuer</a> Monaco Evergraph — the experimental 5 Hz chronograph in titanium with visible flexible components.</li>
</ul>
<p><strong>Why it matters:</strong> Skeleton watches used to be niche — too delicate for daily wear, too expensive for most collectors. Modern manufacturing techniques (laser cutting, CNC machining, advanced surface treatments) have made openworked dials more durable and more affordable. When Hermès and Patek both go skeleton in the same year, it's not a trend — it's a shift.</p>

<h2>2. The Return to Smaller Sizes</h2>
<p>The oversized watch era (2005–2020) is officially dead. W&W 2026 saw brand after brand downsizing their flagships:</p>
<ul>
<li><strong>H. Moser & Cie.</strong> debuted the Streamliner Mini in 34mm and 28mm — sizes that would have been unthinkable from a "serious" brand five years ago.</li>
<li><strong><a href="/brands/rolex">Rolex</a></strong> released 28mm and 34mm Oyster Perpetuals in 18k gold with stunning stone lacquer dials — making small watches feel luxurious, not diminutive.</li>
<li><strong><a href="/brands/patek-philippe">Patek Philippe</a></strong> introduced a 38mm Nautilus (ref. 5610/1P) in platinum — smaller than the iconic 40mm 5711, and arguably more elegant.</li>
<li><strong><a href="/brands/cartier">Cartier</a></strong>'s bestselling Santos-Dumont remains 43.5×31.4mm — a rectangular case that wears far smaller than its dimensions suggest.</li>
</ul>
<p><strong>Why it matters:</strong> Three forces are driving this. First, vintage watches (typically 34–38mm) have become aspirational, and modern brands are responding. Second, the "unisex" movement means brands can sell the same 36mm watch to everyone. Third, comfort wins — a 38mm watch on bracelet is simply more livable than a 44mm one. Read our <a href="/blog/watch-size-guide-how-to-choose">complete watch sizing guide</a> for help finding your ideal size.</p>

<h2>3. Gold Is Back — and Bolder Than Ever</h2>
<p>For years, steel sports watches dominated collector attention. In 2026, gold is making a major comeback:</p>
<ul>
<li><strong><a href="/brands/rolex">Rolex</a></strong> debuted Jubilee gold — a proprietary new alloy that shifts between yellow, grey, and pink tones. Used on the Day-Date 40 with a light green aventurine dial. Only Rolex, with its in-house foundry, could develop a new gold alloy.</li>
<li><strong>Rolex</strong> also released 28mm and 34mm Oyster Perpetuals in full 18k yellow and Everose gold — a clear signal that gold isn't just for the Day-Date anymore.</li>
<li><strong><a href="/brands/patek-philippe">Patek Philippe</a></strong>'s automaton "The Fox and The Crow" is in 43mm rose gold. The Nautilus anniversary pieces are in white gold and platinum.</li>
<li><strong><a href="/brands/iwc">IWC</a></strong> showcased an 18k gold Pilot's watch with an olive green "Grid" dial.</li>
</ul>
<p><strong>Why it matters:</strong> After a decade of steel-watch hype (driven by Nautilus and Royal Oak shortages), the market is maturing. Serious collectors are pivoting to precious metals, which offer better finishing, more exclusivity, and historically stronger long-term value retention. Steel sports watches aren't going anywhere, but gold is no longer your grandfather's choice.</p>

<h2>4. Anniversary Fever Drives Innovation</h2>
<p>Two milestones dominated W&W 2026:</p>
<ul>
<li><strong>Patek Philippe Nautilus — 50 years.</strong> Three limited-edition wristwatches, a pocket watch, and a desk clock. The ultra-thin calibre 240 in the anniversary Nautilus pieces is a deliberate choice — removing the date window and using a micro-rotor to create the thinnest Nautilus ever. Patek didn't just celebrate; they refined.</li>
<li><strong>Rolex Oyster — 100 years.</strong> The Oyster case (patented 1926) made wristwatches waterproof and defined modern watchmaking. Rolex's centennial OP 41 with "100 years" on the dial and the multicolored Jubilee OP 36 are celebratory without being gimmicky.</li>
</ul>
<p><strong>Other anniversaries:</strong> <a href="/brands/tudor">Tudor</a>'s Centenary Collection marks the brand's own milestones, while the Cartier Roadster revival feels like a strategic anniversary play even without a specific date.</p>
<p><strong>Why it matters:</strong> Anniversaries force brands to ask: "What is our DNA?" The best anniversary pieces (like the date-free Nautilus) distill a design to its essence rather than adding unnecessary complications. The worst are cynical limited editions. This year, the balance tipped toward genuine quality.</p>

<h2>5. Haute Horlogerie Gets More Theatrical</h2>
<p>The top end of watchmaking is becoming more expressive, more artistic, and more willing to surprise:</p>
<ul>
<li><strong><a href="/brands/patek-philippe">Patek Philippe</a></strong>'s automaton wristwatch — a mechanical scene of a fox and crow animated on demand. A first in Patek's modern history.</li>
<li><strong><a href="/brands/jaeger-lecoultre">Jaeger-LeCoultre</a></strong>'s triple-axis Gyrotourbillon weighing 0.78 grams. Three axes of rotation in a component lighter than a paperclip.</li>
<li><strong>Hermès</strong> staged a "theater of mechanics and sound" with its skeleton collection — framing watchmaking as performance art.</li>
<li><strong><a href="/brands/piaget">Piaget</a></strong>'s 2mm-thick Altiplano tourbillon with tiger-eye stone dial. Engineering that borders on the impossible.</li>
<li><strong><a href="/brands/breitling">Breitling</a></strong>'s Navitimer Cosmonaute Artemis II with a meteorite dial — cut from actual extraterrestrial stone.</li>
</ul>
<p><strong>Why it matters:</strong> In an era of AI and mass production, haute horlogerie is doubling down on what machines can't do: create objects that are simultaneously functional, artistic, and emotionally stirring. The gap between "good watches" and "extraordinary watches" is widening, and W&W 2026 suggests the top brands are leaning into that separation.</p>

<h2>What This Means for Buyers</h2>
<p>If you're buying a watch in 2026, here's how these trends translate to action:</p>
<ul>
<li><strong>Try smaller.</strong> A 38mm watch on your wrist will look more intentional and refined than a 42mm one. The industry agrees.</li>
<li><strong>Consider gold.</strong> Entry-level gold watches (like Rolex's 28mm and 34mm OPs) offer a way into precious metals without six-figure pricing.</li>
<li><strong>Skeleton watches are safer than they used to be.</strong> Modern constructions are robust enough for daily wear. If you've been curious, this is the year to try one.</li>
<li><strong>Anniversary pieces are smart buys.</strong> Limited editions tied to genuine milestones (not marketing events) tend to hold value well.</li>
</ul>

<p>Read our full rundown of the <a href="/blog/watches-and-wonders-geneva-2026-best-releases">20 best releases from W&W 2026</a>. For background on the brands mentioned, explore our coverage of <a href="/brands/rolex">Rolex</a>, <a href="/brands/patek-philippe">Patek Philippe</a>, <a href="/brands/audemars-piguet">Audemars Piguet</a>, and <a href="/brands/cartier">Cartier</a>.</p>`,
  },
];

(async () => {
  console.log(`Seeding ${posts.length} W&W 2026 blog posts...`);
  for (const post of posts) {
    const { error } = await admin.from('blog_posts').upsert(post, { onConflict: 'slug' });
    if (error) console.error(`Error: ${post.slug} — ${error.message}`);
    else console.log(`  ✓ ${post.title}`);
  }
  const { data } = await admin.from('blog_posts').select('slug').eq('published', true);
  console.log(`\nTotal published: ${data?.length}`);
})();
