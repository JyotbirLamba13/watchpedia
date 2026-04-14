// Seed initial blog posts into Supabase
// Usage: npx tsx supabase/seed-blogs.ts

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin = createClient(url, key);

const posts = [
  {
    slug: 'what-is-a-chronograph-complete-guide',
    title: 'What Is a Chronograph? The Complete Guide to Chronograph Watches',
    excerpt: 'Everything you need to know about chronograph watches — from how they work to the best models across every price range.',
    content: `<p>A <strong>chronograph</strong> is a watch with a built-in stopwatch function. The word comes from the Greek <em>chronos</em> (time) and <em>grapho</em> (to write). While every chronograph is a watch, not every watch is a chronograph — the key distinction is the ability to measure elapsed time independently of the regular timekeeping function.</p>

<h2>How Does a Chronograph Work?</h2>
<p>A chronograph features additional sub-dials (also called registers) and pushers on the side of the case. Typically, you'll find:</p>
<ul>
<li><strong>Start/Stop pusher</strong> — usually at 2 o'clock, this starts and stops the timing function</li>
<li><strong>Reset pusher</strong> — at 4 o'clock, this returns the chronograph hands to zero</li>
<li><strong>Sub-dials</strong> — small dials showing elapsed seconds, minutes, and sometimes hours</li>
</ul>

<h2>Types of Chronograph Movements</h2>
<h3>Mechanical Chronograph</h3>
<p>The classic approach uses a column wheel or cam-lever mechanism to engage the chronograph function. Notable calibers include the Rolex 4130 (Daytona), Omega 9900 (Speedmaster), and Zenith El Primero — one of the first automatic chronograph movements, beating at 36,000 vibrations per hour.</p>

<h3>Quartz Chronograph</h3>
<p>More affordable and accurate for everyday timing, quartz chronographs use electronic circuits. The Seiko 7T62 and Citizen Eco-Drive B612 are popular examples.</p>

<h2>Iconic Chronograph Watches</h2>
<p>Some chronographs have transcended watchmaking to become cultural icons:</p>
<ul>
<li><strong>Omega Speedmaster Professional</strong> — the "Moonwatch," worn during every NASA crewed mission since 1965</li>
<li><strong>Rolex Cosmograph Daytona</strong> — named after the famous Florida racetrack, one of the most sought-after luxury watches</li>
<li><strong>TAG Heuer Monaco</strong> — Steve McQueen's watch in the 1971 film <em>Le Mans</em></li>
<li><strong>Breitling Navitimer</strong> — featuring a circular slide rule for aviation calculations</li>
</ul>

<h2>Chronograph vs. Chronometer</h2>
<p>Don't confuse these two terms. A <strong>chronograph</strong> measures elapsed time (stopwatch). A <strong>chronometer</strong> is a watch certified for accuracy by COSC (Contrôle Officiel Suisse des Chronomètres). A watch can be both — like the Rolex Daytona, which is a chronograph with chronometer certification.</p>

<h2>Frequently Asked Questions</h2>
<h3>Is a chronograph necessary for everyday wear?</h3>
<p>No, but it's one of the most useful complications. Whether you're timing a parking meter, a cooking recipe, or a workout, the chronograph adds genuine functionality beyond telling time.</p>

<h3>Does using the chronograph drain the battery faster?</h3>
<p>In quartz watches, running the chronograph continuously can reduce battery life slightly. In mechanical watches, it adds negligible load to the mainspring.</p>

<h3>What is a flyback chronograph?</h3>
<p>A flyback (or retour-en-vol) lets you reset and restart the chronograph with a single pusher press, instead of the usual stop-reset-start sequence. Originally designed for pilots who needed to time consecutive events.</p>`,
    cover_image: null,
    author: 'Watchpedia',
    published: true,
    published_at: '2026-04-14T06:00:00Z',
    tags: ['guide', 'complications', 'chronograph'],
  },
  {
    slug: 'top-10-watch-brands-by-heritage',
    title: 'The 10 Oldest Watch Brands Still Making Watches Today',
    excerpt: 'From Blancpain (1735) to Patek Philippe (1839), these are the oldest continuously operating watch manufacturers in the world.',
    content: `<p>The watchmaking industry has a rich history spanning nearly three centuries. While many early watchmakers have disappeared, a remarkable number continue producing timepieces today. Here are the ten oldest watch brands still in operation.</p>

<h2>1. Blancpain — Founded 1735</h2>
<p>The world's oldest watch brand was established by Jehan-Jacques Blancpain in Villeret, Switzerland. For nearly three centuries, Blancpain has refused to make quartz watches, remaining devoted to mechanical horology. Their Fifty Fathoms (1953) is considered the first modern dive watch, predating even the Rolex Submariner.</p>

<h2>2. Vacheron Constantin — Founded 1755</h2>
<p>Part of the "Holy Trinity" of watchmaking alongside Patek Philippe and Audemars Piguet, Vacheron Constantin has maintained uninterrupted production since its founding in Geneva. Their Overseas collection and the ultra-complicated Traditionnelle line showcase centuries of accumulated expertise.</p>

<h2>3. Breguet — Founded 1775</h2>
<p>Abraham-Louis Breguet is arguably the most important watchmaker in history. He invented the tourbillon, the Breguet overcoil hairspring, and the first wristwatch (for the Queen of Naples in 1810). Now part of the Swatch Group, Breguet continues to produce some of the finest complications available.</p>

<h2>4. Jaeger-LeCoultre — Founded 1833</h2>
<p>Known as "the watchmaker's watchmaker," JLC has produced over 1,200 calibers — more than almost any other manufacture. Their Reverso (1931), designed for polo players with a flipping case, remains one of the most recognizable dress watches in the world.</p>

<h2>5. Patek Philippe — Founded 1839</h2>
<p>The most prestigious watch brand in the world. Patek Philippe holds the record for the most expensive watch ever sold at auction (the Grandmaster Chime, $31 million). Their motto — "You never actually own a Patek Philippe, you merely look after it for the next generation" — speaks to the brand's philosophy of eternal value.</p>

<h2>6. A. Lange & Söhne — Founded 1845</h2>
<p>The crown jewel of German watchmaking. Founded in Glashütte, Saxony, the brand was nationalized under East German rule and only refounded in 1990 by Walter Lange. Despite this interruption, their watches — featuring the signature Glashütte three-quarter plate — are considered among the finest in the world.</p>

<h2>7. Cartier — Founded 1847</h2>
<p>While primarily known as a jeweler, Cartier has deep watchmaking credentials. They created the Santos (1904), widely considered the first modern wristwatch designed for aviator Alberto Santos-Dumont. The Tank (1917) remains one of the most iconic watch designs ever created.</p>

<h2>8. Omega — Founded 1848</h2>
<p>From the moon landing to James Bond, Omega's watches have defined popular culture. The Speedmaster Professional became the first watch on the moon in 1969, while the Seamaster has graced the wrist of 007 since 1995. Omega's Co-Axial escapement represents one of the most significant advances in mechanical watchmaking in 250 years.</p>

<h2>9. Tag Heuer — Founded 1860</h2>
<p>Originally Heuer, this brand has been at the forefront of chronograph development. Their Monaco (1969) was the first automatic chronograph, and the brand's association with motorsport — from Formula 1 to Le Mans — has made it synonymous with precision timing.</p>

<h2>10. IWC Schaffhausen — Founded 1868</h2>
<p>The only major Swiss watch brand based in German-speaking Switzerland, IWC combines Swiss craftsmanship with German engineering precision. Their Pilot's watches, Portugieser, and Portofino collections offer some of the best value in luxury watchmaking.</p>

<h2>Honorable Mentions</h2>
<p>Several other historic brands deserve recognition: <strong>Longines</strong> (1832), <strong>Tissot</strong> (1853), <strong>Zenith</strong> (1865), and <strong>Seiko</strong> (1881). Each has contributed enormously to the art and science of timekeeping.</p>`,
    cover_image: null,
    author: 'Watchpedia',
    published: true,
    published_at: '2026-04-12T06:00:00Z',
    tags: ['history', 'brands', 'heritage'],
  },
  {
    slug: 'mechanical-vs-quartz-watches-which-is-better',
    title: 'Mechanical vs. Quartz Watches: Which Is Better?',
    excerpt: 'The great debate in watchmaking — mechanical artistry or quartz precision? We break down the pros, cons, and everything in between.',
    content: `<p>It's the most fundamental question in watchmaking: should you buy a mechanical watch or a quartz watch? The answer depends on what you value most — and understanding the differences will help you make the right choice.</p>

<h2>How Mechanical Watches Work</h2>
<p>A mechanical watch is powered by a wound mainspring that slowly unwinds, transferring energy through a series of gears (the gear train) to the escapement, which regulates the release of energy in precise intervals. The balance wheel oscillates back and forth, typically at 28,800 vibrations per hour (4 Hz), creating the characteristic sweeping second hand.</p>
<p>There are two types:</p>
<ul>
<li><strong>Manual-wind</strong> — you wind the crown by hand, typically once a day</li>
<li><strong>Automatic (self-winding)</strong> — a rotor spins with your wrist movement, winding the mainspring automatically</li>
</ul>

<h2>How Quartz Watches Work</h2>
<p>A quartz watch uses a battery to send an electrical current through a tiny quartz crystal, which vibrates at exactly 32,768 Hz. A circuit counts these vibrations and converts them into one pulse per second, driving the motor that moves the hands. It's elegant in its simplicity.</p>

<h2>Accuracy</h2>
<p>This is where quartz wins decisively. A typical quartz watch loses or gains about <strong>15 seconds per month</strong>. A well-regulated mechanical watch might achieve <strong>±5 seconds per day</strong> — about 150 seconds per month. COSC-certified chronometers must be within -4/+6 seconds per day, which is still far less accurate than a basic quartz.</p>

<h2>Durability & Maintenance</h2>
<p><strong>Quartz</strong> watches need a battery replacement every 2-5 years (about $10-30) and are generally more shock-resistant. <strong>Mechanical</strong> watches need a full service every 5-7 years, which can cost $200-800+ depending on the brand and complications. However, a well-maintained mechanical watch can last for generations.</p>

<h2>Value & Investment</h2>
<p>Mechanical watches, especially from prestigious brands, tend to hold or increase in value over time. A Rolex Submariner purchased in 2010 is worth significantly more today. Quartz watches, with some exceptions (like the original Seiko Astron or Cartier Tank), typically depreciate.</p>

<h2>The Emotional Factor</h2>
<p>This is where mechanical watches truly shine. There's something magical about a device that tells time using nothing but springs, gears, and human ingenuity — no battery, no electronics. The smooth sweep of the second hand, the feel of winding the crown, the visible movement through a case back — these experiences create an emotional connection that quartz simply cannot match.</p>

<h2>Our Recommendation</h2>
<p>If you want the most accurate, affordable, and low-maintenance option: <strong>buy quartz</strong>. If you appreciate craftsmanship, tradition, and the art of mechanical engineering: <strong>buy mechanical</strong>. And if you can afford it, buy both — a reliable quartz for everyday timing and a beautiful mechanical for the joy of wearing something truly special.</p>

<h2>Frequently Asked Questions</h2>
<h3>Can you tell if a watch is mechanical or quartz by looking at it?</h3>
<p>Usually, yes. A mechanical watch's second hand sweeps smoothly, while a quartz second hand ticks in one-second increments. However, some high-end quartz movements (like Bulova Precisionist at 262 kHz) produce a nearly sweep-like motion.</p>

<h3>Do mechanical watches need to be worn every day?</h3>
<p>No. A fully wound automatic watch will run for 40-80 hours (the "power reserve") without being worn. After that, you'll need to reset the time and date. A watch winder can keep automatic watches running when not worn.</p>

<h3>Is Spring Drive mechanical or quartz?</h3>
<p>It's both. Seiko's Spring Drive uses a mainspring (like a mechanical watch) but regulates timekeeping with a quartz crystal (like a quartz watch). The result is the smooth sweep of a mechanical watch with near-quartz accuracy of ±1 second per day.</p>`,
    cover_image: null,
    author: 'Watchpedia',
    published: true,
    published_at: '2026-04-10T06:00:00Z',
    tags: ['guide', 'mechanical', 'quartz', 'buying guide'],
  },
];

async function seedBlogs() {
  console.log(`Seeding ${posts.length} blog posts...`);

  for (const post of posts) {
    const { error } = await admin.from('blog_posts').upsert(post, { onConflict: 'slug' });
    if (error) {
      console.error(`Error seeding "${post.slug}":`, error.message);
    } else {
      console.log(`  ✓ ${post.title}`);
    }
  }

  console.log('\nDone!');
}

seedBlogs().catch(console.error);
