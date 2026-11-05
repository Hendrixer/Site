// Everything about you that isn't a project lives here.
export const site = {
  name: 'Scott Moss',
  initials: 'SM',
  tagline: 'Builds products. Teaches on YouTube.',
  description:
    'Scott Moss builds apps and open-source tools, does AI research, and explains how it all works on YouTube.',
  // Rendered as HTML so it can hold links.
  intro:
    'I build apps and open-source tools, do AI research, and explain how it all works on YouTube. I also help companies put AI to work, safely.',
  // Short status line with a green dot. Leave empty to hide it.
  now: '',
  // General mail. Both addresses are caught by the Cloudflare inbox worker.
  email: 'hello@mossscott.com',
  // Engagement inquiries from the Work with me section.
  workEmail: 'work@mossscott.com',
  work: {
    lead: 'I take on a few engagements at a time, for teams that want AI in their products and want it done responsibly.',
    offers: [
      {
        title: 'Safety and evaluation',
        tag: 'AI safety research',
        description:
          'Red-teaming, evals and failure analysis for models and agents before they reach your users. You get a clear map of where they break and a plan to fix it.',
      },
      {
        title: 'From demos to production',
        tag: 'Consulting',
        description:
          'For teams stuck between impressive prototypes and shipped features. We pick the workflows worth automating, build them properly and train your engineers to own them.',
      },
      {
        title: 'Fractional Chief AI Officer',
        tag: 'Leadership',
        description:
          'Senior AI leadership a few days a month, without a full-time hire. I own the roadmap, model and vendor choices, hiring, and the governance your board will ask about.',
      },
    ],
    cta: 'Tell me what you’re working on',
  },
  // Leave a link empty to hide it.
  links: {
    youtube: '',
    github: '',
    x: '',
  },
  // Put a square photo at public/portrait.jpg and it replaces the initials.
  portrait: '/portrait.jpg',
  // Small line in the footer. Leave empty to hide it.
  placeholderNote: '',
};
