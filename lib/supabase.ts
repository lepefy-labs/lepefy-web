const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface Deal {
  id: string;
  title: string;
  price_value: number;
  score: number;
  margine_stimato: number;
  motivazione: string | null;
  keyword: string | null;
  location: string | null;
  url: string | null;
  source: string;
  image_url: string | null;
  condition: string | null;
  created_at: string;
  is_sold: boolean;
}

export const supabaseHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

export async function fetchPublicDeals(): Promise<Deal[]> {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();

  const params = new URLSearchParams({
    select: 'id,title,price_value,score,margine_stimato,motivazione,keyword,location,url,source,image_url,condition,created_at',
    score:           'gte.6',    // include anche score 6
    margine_stimato: 'gte.80',   // soglia margine più alta per compensare
    created_at:      `lte.${twelveHoursAgo}`,
    is_sold:         'eq.false',
    order:           'score.desc,margine_stimato.desc', // ordinamento server-side
    limit:           '100',      // filtro finale avviene lato client
  });

  const res = await fetch(`${SUPABASE_URL}/rest/v1/scan_results?${params}`, {
    headers: supabaseHeaders,
    next: { revalidate: 900 },
  });

  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);

  return res.json();
  // Nota: l'ordinamento server-side (score × margine) è già applicato da Supabase.
  // Il client può ri-ordinare liberamente tramite FilterBar.
}
