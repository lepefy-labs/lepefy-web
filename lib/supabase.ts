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
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

export async function fetchPublicDeals(): Promise<Deal[]> {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/scan_results` +
      `?select=id,title,price_value,score,margine_stimato,motivazione,keyword,location,url,source,image_url,condition,created_at` +
      `&score=gte.7&margine_stimato=gte.15&created_at=lte.${encodeURIComponent(twelveHoursAgo)}&limit=20`,
    {
      headers: supabaseHeaders,
      next: { revalidate: 900 },
    }
  );

  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);

  const data: Deal[] = await res.json();
  return data.sort((a, b) => b.score * b.margine_stimato - a.score * a.margine_stimato);
}
