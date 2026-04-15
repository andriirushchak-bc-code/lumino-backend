const COMPANIES: Record<string, string> = {
  stripe: 'https://stripe.com',
  notion: 'https://notion.so',
  figma: 'https://figma.com',
  linear: 'https://linear.app',
  vercel: 'https://vercel.com',
  supabase: 'https://supabase.com',
  anthropic: 'https://anthropic.com',
  openai: 'https://openai.com',
  google: 'https://google.com',
  microsoft: 'https://microsoft.com',
  acme: 'https://acme.example.com',
  northwind: 'https://northwind.example.com',
  globex: 'https://globex.example.com',
  initech: 'https://initech.example.com',
};

export function enrichGuest(guest: { full_name: string; company: string }): {
  company_website: string | null;
  linkedin_url: string | null;
} {
  const companyLower = guest.company.toLowerCase();
  let company_website: string | null = null;

  for (const [key, url] of Object.entries(COMPANIES)) {
    if (companyLower.includes(key)) {
      company_website = url;
      break;
    }
  }

  const linkedin_url = `https://linkedin.com/in/${guest.full_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;

  return { company_website, linkedin_url };
}
