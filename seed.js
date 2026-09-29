const { createStrapi } = require('@strapi/strapi');

async function seed() {
  const strapi = await createStrapi().load();

  console.log('--- Starting Strapi Seed with Google Doc Article ---');

  // 1. Grant public permissions for api collections
  try {
    const roles = await strapi.query('plugin::users-permissions.role').findMany({
      where: { type: 'public' },
      populate: ['permissions'],
    });

    const publicRole = roles[0];
    if (publicRole) {
      const apis = ['page.page', 'author.author', 'category.category', 'tag.tag'];
      const actions = ['find', 'findOne'];
      for (const api of apis) {
        for (const action of actions) {
          const permAction = `api::${api}.${action}`;
          const existingPerm = await strapi.query('plugin::users-permissions.permission').findOne({
            where: { role: publicRole.id, action: permAction },
          });

          if (!existingPerm) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: { action: permAction, role: publicRole.id, enabled: true },
            });
            console.log(`Granted public permission: ${permAction}`);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not auto-grant public permissions:', err.message);
  }

  // 2. Authors
  const authorsToSeed = [
    {
      name: 'Packaging Specialist',
      slug: 'packaging-specialist',
      bio: 'Beverage packaging lines, canning, and bottling specialist at SEPPA Solutions.',
    },
    {
      name: 'Seppa Engineering Team',
      slug: 'seppa-engineering-team',
      bio: 'Technical engineering and automation experts at SEPPA Solutions.',
    },
  ];

  const authorMap = {};
  for (const author of authorsToSeed) {
    let existing = null;
    if (strapi.documents) {
      const found = await strapi.documents('api::author.author').findMany({
        filters: { slug: { $eq: author.slug } },
      });
      existing = found && found.length > 0 ? found[0] : null;
    }

    if (!existing) {
      existing = await strapi.documents('api::author.author').create({ data: author, status: 'published' });
      console.log(`✓ Created Author: ${author.name}`);
    }
    authorMap[author.slug] = existing.documentId || existing.id;
  }

  // 3. Categories
  const categoriesToSeed = [
    {
      name: 'Packaging Insights',
      slug: 'packaging-insights',
      description: 'Strategic comparison and technical guides across PET, Glass, and Aluminium Can packaging formats.',
    },
    {
      name: 'Can Packaging',
      slug: 'can-packaging',
      description: 'Innovations and technical guides for beverage canning.',
    },
    {
      name: 'PET Bottling',
      slug: 'pet-bottling',
      description: 'PET stretch blow moulding, bottle design, and lightweighting.',
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesToSeed) {
    let existing = null;
    if (strapi.documents) {
      const found = await strapi.documents('api::category.category').findMany({
        filters: { slug: { $eq: cat.slug } },
      });
      existing = found && found.length > 0 ? found[0] : null;
    }

    if (!existing) {
      existing = await strapi.documents('api::category.category').create({ data: cat, status: 'published' });
      console.log(`✓ Created Category: ${cat.name}`);
    }
    categoryMap[cat.slug] = existing.documentId || existing.id;
  }

  // 4. Tags
  const tagsToSeed = [
    { name: 'PET Bottles', slug: 'pet-bottles' },
    { name: 'Glass Packaging', slug: 'glass-packaging' },
    { name: 'Aluminium Cans', slug: 'aluminium-cans' },
    { name: 'Sustainability', slug: 'sustainability' },
    { name: 'Total Cost of Ownership', slug: 'total-cost-of-ownership' },
  ];

  const tagMap = {};
  for (const tag of tagsToSeed) {
    let existing = null;
    if (strapi.documents) {
      const found = await strapi.documents('api::tag.tag').findMany({
        filters: { slug: { $eq: tag.slug } },
      });
      existing = found && found.length > 0 ? found[0] : null;
    }

    if (!existing) {
      existing = await strapi.documents('api::tag.tag').create({ data: tag, status: 'published' });
      console.log(`✓ Created Tag: ${tag.name}`);
    }
    tagMap[tag.slug] = existing.documentId || existing.id;
  }

  // 5. Google Doc Article Content
  const googleDocContent = `
## Introduction: This Decision is Bigger Than You Think

Every trip down any retail aisle or factory is an under-the-radar meeting of materials engineering, branding, and cold logistics. By 2026, all the beverage brands will find themselves in a very uncomfortable position in terms of the rising costs of raw materials and the fact that EPR penalties are coming for those who haven't gotten their act together. Picking your primary container isn't a procurement checkbox anymore: it's a strategic call.

For anyone running high-volume lines, evaluating packaging options means thinking well past per-unit cost. Carbon taxation tiers, shelf life chemistry, consumer sentiment—it all feeds into this decision. The container you choose shapes how your liquid behaves under pressure, how your pallets stack, and whether a buyer at the shelf feels good picking it up.

The shift toward sustainable packaging used to be a nice marketing angle. Now it's operational reality. If you want your brand to scale clearly over the next five years, understanding the practical trade-offs between PET, glass, and aluminium is table stakes.

---

## Material Choice Is Actually Business Strategy

Here's the honest truth: the material you choose becomes a silent partner in your daily operations. It sets the ceiling on shelf life, chemical stability, and how well your product holds up against oxygen ingress or UV exposure. Sensitive liquids—nitrogen-infused cold brew, organic juice, anything with a delicate sensory profile—need real barrier integrity, or the flavour is gone before the consumer gets there.

Distribution logistics add a whole other layer. High-speed filling lines are violent on containers. Long-distance freight means sustained vibration and top-load pressure across entire pallets. And not only that, the package also offers an experiential aspect—as the consumer touches and feels the package, hears the sound of a tab being ripped open, and even makes a decision about its quality without having tasted any of the product yet. Successful packaging requires a balance between the two.

---

## PET: The Volume Leader for Good Reason

When you look at sheer commercial scale, PET still leads globally and the reasons are practical, not sentimental. Polyethylene terephthalate has predictable stretch blow moulding behaviour and a low melting point, which lets high-volume operations run at very high speeds. But the bigger operational win is weight. Modern PET bottles are a fraction of what they weighed even a decade ago, and that directly cuts freight costs and transport emissions.

However, when it comes to PET in 2026, things get all about recycling. Recycled food-grade rPET has become mandatory in many areas, and the race for reliable feedstocks is on. For brands able to use PET with high amounts of recycling, there is a way to reduce the environmental impact of the product significantly.

There are legitimate technical headaches: aesthetic yellowing, modest tensile strength loss across recycling cycles—but for mass market water, juice, and soda, PET remains the most cost-efficient distribution option. That isn't changing soon.

---

## Glass: Still Unmatched for Premium Product

If your brand is selling heritage, luxury, or a genuinely delicate product, glass is still the default. From a material science standpoint, it's completely chemically inert: a total barrier against gas migration, with no oxygen getting in and no CO2 escaping. That's why glass is the go-to for pasteurized liquids and high-proof spirits that simply cannot tolerate micro-level chemical migration.

The operational costs are real and worth acknowledging. Industrial glass furnaces are energy-intensive, and that spikes your Scope 1 emissions up front. Packaging engineers are addressing this through lightweighting and localized returnable bottle systems, but glass still carries more weight and more fragility than the alternatives.

For products where the drinking experience is inseparable from the container—a premium botanical gin, a fine wine, a specialty olive oil that premium is worth paying. Glass earns its place in high margin, high perception categories.

---

## Aluminium Cans: Portable, Protective, and Highly Circular

The RTD boom (craft beer, canned cocktails, functional sodas) has put aluminium cans at the center of the industry, and it's not hard to see why. Cans pack with perfect cube efficiency on a pallet, they're completely opaque (so light-struck degradation isn't a concern), and advanced polymer linings now prevent acidic liquids from contacting raw metal. Shelf life of 18 to 24 months is achievable.

Procurement teams working with reliable aluminium can suppliers also benefit from supply chain predictability that other materials don't always offer. And from a sustainability perspective, aluminium has the highest recycling rate out of all three, as it is completely circular compared to PET and glass at this point. In terms of reaching consumer needs while hitting corporate targets for carbon reduction, cans may be a great choice.

---

## Comparative Performance Matrix

| Metric | PET Bottle (500 ml) | Glass Packaging (500 ml) | Aluminium Can (330 ml) |
| :--- | :--- | :--- | :--- |
| **Unit Weight** | 18g to 24g | 180g to 340g | 13g to 15g |
| **Barrier Properties** | 6–12 months shelf life | 24+ months (completely inert) | 24+ months (full light/oxygen barrier) |
| **Production CO2e** | ~85g (cradle-to-gate) | ~330g (high-furnace energy) | ~170g per unit |
| **Global Recycling Rate** | ~47% recovery | ~42% recovery | ~75% recovery |
| **Relative Filled Cost** | 1.0x (Base cost benchmark) | 2.2–2.8x (Premium tier) | 1.4–1.6x (Mid-volume tier) |
| **Light Protection** | Low protection | Variable (depends on tint) | Complete protection (100% UV barrier) |

---

## Decision Framework for Beverage Producers

| Beverage Category | Recommended Primary Material | Strategic Justification |
| :--- | :--- | :--- |
| **Carbonated Soft Drinks** | PET (with high rPET content) | Lowest filled cost, pressure-tolerant stability. |
| **Premium Spirits & Wine** | Glass Packaging | Flavor integrity preservation; tactile brand equity signaling. |
| **RTD Coffee & Energy** | Aluminium Cans | Full light barrier, extended shelf life protection. |
| **Craft Beer** | Aluminium Cans | Portability layout; excellent oxygen exclusion barrier. |
| **Functional Drinks** | Aluminium or PET | Consumer lifestyle appeal, vibrant branding space. |

---

## What This Means for Your P&L?

Your container choice shows up directly on your profit and loss statement. Total Cost of Ownership means tracking well past the invoice: filling line reject rates, freight surcharges, breakage, incoming environmental tax assessments. These add up fast and in ways that aren't always obvious at the procurement stage.

Then there is the issue of consumer side of it all. Consumers scrutinize labeling and recycling symbols on products. Those brands that have embedded sustainability within their packaging develop a sort of credibility that translates into repeat sales. Not only is sustainability no longer an afterthought, but it's increasingly becoming a means of retaining consumers.

The brands gaining ground right now are the ones treating their container as a business asset not just an overhead cost.

---

## Methodology

The insights and data shared throughout this analysis are drawn directly from 2026 industrial benchmarks, life cycle assessments, and real-world supply chain audits. Our financial numbers reflect current market pricing for raw resins and processed metals, giving you an honest look at modern beverage production landscapes. Any brand searching for dependable packaging solutions needs to ground its choices in this type of hard evidence. Fine tuning your equipment for specialized beverage production metrics reduces scrap rates and helps you stay competitive.

---

## Frequently Asked Questions

### 1. Which format provides the lowest total cost of ownership right now?
For setups running over a million units a year, PET packaging—especially with a high blend of recycled resin—delivers the lowest landed cost once you factor in shipping weights and product breakage. Among high volume packaging solutions, it remains incredibly tough to beat on a cost per liter basis.

### 2. How can I ensure our lines stay protected against sudden supply chain disruptions?
Building redundant relationships with your core material partners is crucial. Top aluminum can suppliers advise keeping safety stock and using dual-sourcing models. Leading aluminum can suppliers also offer real-time freight tracking to help protect your active beverage production calendar.

### 3. Does adopting sustainable packaging mean sacrificing my profit margins?
Not if you plan your rollout strategically. While upfront costs for premium eco-resins might look high, they save you from heavy plastic taxes and lower your distribution costs over time.

### 4. Why is classic glass format experiencing a regional revival?
Localized returnable and refillable loops are becoming highly cost-effective for regional brands. Washing and reusing the same container reduces your raw purchasing needs, shields your beverage production runs from material shortages, and connects with local consumers beautifully.

### 5. Which packaging format offers the lowest total cost of ownership in 2026?
For SKUs above one million units annually, PET—particularly rPET at 50% inclusion—delivers the lowest landed cost once EPR fees, freight, and breakage are loaded. Among scaled packaging solutions, nothing matches it on cost per litre.
`;

  const articles = [
    {
      title: "PET vs Glass vs Aluminium Cans: Choosing the Right Packaging Solutions for Your Brand's Success",
      slug: "pet-vs-glass-vs-aluminium-cans",
      full_path: "/can/blog/pet-vs-glass-vs-aluminium-cans",
      template: 'blog',
      author: authorMap['packaging-specialist'],
      category: categoryMap['packaging-insights'],
      tags: [tagMap['pet-bottles'], tagMap['glass-packaging'], tagMap['aluminium-cans'], tagMap['sustainability']],
      hero: {
        title: "PET vs Glass vs Aluminium Cans: Choosing the Right Packaging Solutions for Your Brand's Success",
        subtitle: "A comprehensive material science, total cost of ownership, and operational comparison across beverage containers.",
      },
      body: [
        {
          __component: 'shared.rich-text',
          content: googleDocContent,
        },
      ],
      seo: {
        meta_title: "PET vs Glass vs Aluminium Cans Comparison | SEPPA Packaging",
        meta_description: "Strategic comparison of PET bottles, glass packaging, and aluminium cans: shelf life, cost, carbon footprint, and recycling.",
      },
    },
    {
      title: "Innovations in High-Speed Aluminium Can Filling and Seaming",
      slug: "innovations-in-can-filling",
      full_path: "/can/blog/innovations-in-can-filling",
      template: 'blog',
      author: authorMap['packaging-specialist'],
      category: categoryMap['can-packaging'],
      tags: [tagMap['aluminium-cans']],
      hero: {
        title: "Innovations in High-Speed Aluminium Can Filling and Seaming",
        subtitle: "How modern isobaric and volumetric can filling lines are reducing beverage oxidation and boosting production speeds.",
      },
      body: [
        {
          __component: 'shared.rich-text',
          content: `## The Shift Towards Aluminium Can Packaging\n\nAluminium beverage cans have rapidly expanded into craft sodas, sparkling water, energy drinks, and teas.\n\n### Key Advantages:\n- 100% light barrier\n- Complete recyclability\n- Ultra-fast chilling`,
        },
      ],
      seo: {
        meta_title: "Innovations in High-Speed Aluminium Can Filling | SEPPA",
        meta_description: "Modern isobaric can filling systems.",
      },
    },
  ];

  for (const article of articles) {
    try {
      let existing = null;
      if (strapi.documents) {
        const found = await strapi.documents('api::page.page').findMany({
          filters: { full_path: { $eq: article.full_path } },
        });
        existing = found && found.length > 0 ? found[0] : null;
      }

      if (existing) {
        await strapi.documents('api::page.page').update({
          documentId: existing.documentId || existing.id,
          data: article,
          status: 'published',
        });
        console.log(`✓ Updated blog: ${article.full_path}`);
      } else {
        await strapi.documents('api::page.page').create({
          data: article,
          status: 'published',
        });
        console.log(`✓ Created & Published blog: ${article.full_path}`);
      }
    } catch (e) {
      console.error(`Error saving blog ${article.full_path}:`, e.message);
    }
  }

  console.log('--- Seed Finished Successfully ---');
  await strapi.destroy();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
