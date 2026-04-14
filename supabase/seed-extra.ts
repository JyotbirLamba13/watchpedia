import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const posts = [
  {
    slug: 'swiss-vs-japanese-watchmaking',
    title: "Swiss vs. Japanese Watchmaking: Two Philosophies, One Obsession",
    excerpt: "Switzerland and Japan dominate the watch industry with fundamentally different approaches. We explore what makes each tradition unique.",
    tags: ['comparison', 'swiss', 'japanese', 'culture'],
    content: `<p>The global watch industry is dominated by two countries separated by 9,000 kilometers but united by an obsession with precision: Switzerland and Japan. Together, they account for the vast majority of quality timepieces produced worldwide. But their approaches to watchmaking could not be more different.</p>

<h2>The Swiss Philosophy: Tradition and Prestige</h2>
<p>Swiss watchmaking is built on centuries of tradition. The industry traces its roots to 16th-century Geneva, where Huguenot refugees brought metalworking skills that merged with local clockmaking expertise. Today, the "Swiss Made" label carries more weight than perhaps any other country-of-origin designation in any industry.</p>
<ul>
<li><strong>Heritage</strong> — brands like Blancpain (1735), Vacheron Constantin (1755), and Breguet (1775) leverage centuries of history.</li>
<li><strong>Hand craftsmanship</strong> — haute horlogerie brands hand-finish every component with Geneva stripes, perlage, and beveled edges.</li>
<li><strong>Exclusivity</strong> — limited production, waitlists, and high prices create aspirational value.</li>
</ul>

<h2>The Japanese Philosophy: Innovation and Perfection</h2>
<p>Japanese watchmaking began much later — Seiko was founded in 1881. But what Japan lacked in history, it compensated for with relentless innovation.</p>
<ul>
<li><strong>Technological innovation</strong> — Seiko invented the quartz watch (1969), kinetic movement (1988), and Spring Drive (1999).</li>
<li><strong>Monozukuri</strong> — the Japanese art of making things, emphasizing process perfection and continuous improvement.</li>
<li><strong>Vertical integration</strong> — Grand Seiko manufactures everything in-house, including hairsprings and quartz crystals.</li>
<li><strong>Value for money</strong> — Japanese watches consistently over-deliver relative to their price.</li>
</ul>

<h2>The Quartz Crisis: Japan's Disruption</h2>
<p>In 1969, Seiko released the Astron — the world's first quartz wristwatch. By the late 1970s, cheap, accurate quartz watches from Japan were decimating the Swiss industry. Between 1970 and 1983, Swiss watch employment dropped from 90,000 to 30,000. Hundreds of brands disappeared.</p>
<p>Switzerland survived by pivoting to luxury — positioning mechanical watches as art objects and status symbols. The Swatch Group saved the mass-market Swiss industry, while brands like Rolex and Patek Philippe doubled down on prestige.</p>

<h2>Key Comparisons</h2>
<h3>Entry Luxury: Tissot vs. Seiko Presage</h3>
<p>Both offer excellent mechanical watches around $300-$800. Tissot leverages Swiss Made cachet. Seiko Presage offers stunning dials crafted using traditional Japanese lacquer and enamel techniques.</p>

<h3>Mid-Luxury: Omega vs. Grand Seiko</h3>
<p>Omega ($5,000-$12,000) offers iconic designs and Master Chronometer certification. Grand Seiko ($3,000-$10,000) offers arguably superior finishing and the unique Spring Drive technology.</p>

<h2>Who Makes Better Watches?</h2>
<p>Neither. They make <em>different</em> watches driven by different philosophies. Swiss watches sell heritage and prestige. Japanese watches deliver innovation and value. The best collections include both.</p>

<h2>Frequently Asked Questions</h2>
<h3>Are Japanese watches as good as Swiss watches?</h3>
<p>In terms of quality and precision, absolutely. Grand Seiko's finishing rivals any Swiss brand. In terms of brand prestige and resale value, Swiss brands still lead.</p>

<h3>What does "Swiss Made" actually mean?</h3>
<p>A watch labeled Swiss Made must have a Swiss movement, be cased in Switzerland, and undergo final inspection in Switzerland. At least 60% of manufacturing costs must be incurred in Switzerland.</p>

<h3>Why are Swiss watches so expensive?</h3>
<p>High labor costs, extensive hand-finishing, marketing expenditures, and brand positioning all contribute. A significant portion pays for the brand name rather than raw materials.</p>

<h3>What is the most accurate watch in the world?</h3>
<p>The Citizen Caliber 0100, accurate to plus or minus 1 second per year. Among mechanical watches, the Zenith Defy Lab claims plus or minus 0.3 seconds per day.</p>

<h3>Is Citizen Swiss or Japanese?</h3>
<p>Japanese. Citizen Watch Co. was founded in Tokyo in 1918. They own Bulova (American heritage, Japanese-owned) and Frederique Constant (Swiss).</p>`,
    author: 'Watchpedia',
    published: true,
    published_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    slug: 'watch-water-resistance-explained',
    title: "Watch Water Resistance: What the Numbers Really Mean",
    excerpt: "Can you swim with a 50m water-resistant watch? Spoiler: you probably shouldn't. Here's what water resistance ratings actually mean in practice.",
    tags: ['guide', 'water resistance', 'education', 'care'],
    content: `<p>Water resistance is one of the most misunderstood specifications in watchmaking. A watch rated to 100 meters does not mean you can take it diving to 100 meters. Here is the truth behind the numbers.</p>

<h2>How Water Resistance Is Tested</h2>
<p>Water resistance ratings are determined through static pressure tests in a laboratory — not by submerging watches underwater. The watch is placed in a sealed chamber, and pressure is gradually increased. The critical difference: <strong>static pressure in a lab is not the same as dynamic pressure in real life</strong>.</p>

<h2>What Each Rating Actually Means</h2>

<h3>30 Meters / 3 ATM</h3>
<p><strong>In practice:</strong> Splash-proof only. Safe for handwashing and light rain. Do NOT swim or shower with this watch.</p>

<h3>50 Meters / 5 ATM</h3>
<p><strong>In practice:</strong> Safe for brief swimming. Not recommended for snorkeling or diving. Do not press buttons while submerged.</p>

<h3>100 Meters / 10 ATM</h3>
<p><strong>In practice:</strong> Safe for recreational swimming and snorkeling. Still not rated for scuba diving.</p>

<h3>200 Meters / 20 ATM</h3>
<p><strong>In practice:</strong> The minimum for a true dive watch (ISO 6425). Safe for recreational scuba diving.</p>

<h3>300+ Meters / 30+ ATM</h3>
<p><strong>In practice:</strong> Professional dive watch territory. The Rolex Submariner (300m), Omega Seamaster 300M, and Tudor Pelagos (500m) fall here. Overkill for most people but provides maximum peace of mind.</p>

<h2>What Kills Water Resistance</h2>
<ul>
<li><strong>Age:</strong> Rubber gaskets degrade over time. A 5-year-old watch may no longer meet its original rating.</li>
<li><strong>Crown operation:</strong> NEVER operate the crown while the watch is submerged.</li>
<li><strong>Temperature changes:</strong> Going from a hot tub to a cold pool can cause rapid contraction that allows moisture entry.</li>
<li><strong>Chemicals:</strong> Chlorine, sunscreen, saltwater, and perfume degrade gaskets faster.</li>
<li><strong>Service neglect:</strong> Have water resistance tested annually if you swim with your watch ($15-$30 at most watch shops).</li>
</ul>

<h2>ISO 6425: What Makes a Real Dive Watch</h2>
<p>ISO 6425 is the international standard for dive watches. Requirements include: pressure testing to 125% of rated depth, unidirectional rotating bezel, readability in darkness at 25cm, antimagnetic and shock resistance, saltwater functionality between 5-40 degrees C, and secure strap attachment.</p>

<h2>Frequently Asked Questions</h2>
<h3>Can I shower with my dive watch?</h3>
<p>Technically yes if rated to 200m+, but many watchmakers advise against it because soap and hot water accelerate gasket degradation.</p>

<h3>Does screw-down crown matter?</h3>
<p>Yes, significantly. A screw-down crown provides much better water sealing than a push/pull crown. Nearly all watches rated 200m+ have screw-down crowns.</p>

<h3>How often should I pressure-test my watch?</h3>
<p>Annually if you swim or dive with it. Every 2-3 years for occasional exposure to rain or handwashing.</p>

<h3>Can water damage be repaired?</h3>
<p>Sometimes. If caught early, a watchmaker can dry the movement and replace damaged components. If moisture has sat inside for weeks, corrosion may be too extensive.</p>

<h3>My watch says "water resistant" with no depth. What does that mean?</h3>
<p>It has some moisture protection but is not rated for any specific depth. Treat it as splash-proof only.</p>`,
    author: 'Watchpedia',
    published: true,
    published_at: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
];

(async () => {
  for (const post of posts) {
    const { error } = await admin.from('blog_posts').upsert(post, { onConflict: 'slug' });
    if (error) console.error('Error:', error.message);
    else console.log('Published:', post.slug);
  }
  const { data } = await admin.from('blog_posts').select('slug').eq('published', true);
  console.log('Total published:', data?.length);
})();
