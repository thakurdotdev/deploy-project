const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'thakur.dev';

export const CloudflareService = {
  /**
   * Checks if a subdomain is available.
   * Returns true if available (no DNS record found), false otherwise.
   */
  async checkSubdomain(subdomain: string): Promise<boolean> {
    if (!subdomain) return false;

    // 1. Basic Validation
    const s = subdomain.toLowerCase().trim();
    if (!/^[a-z0-9-]+$/.test(s)) {
      throw new Error('Invalid subdomain format. Use letters, numbers, and hyphens.');
    }
    if (s.startsWith('-') || s.endsWith('-')) {
      throw new Error('Subdomain cannot start or end with a hyphen.');
    }

    // Checking against local reserved words (optional, but good practice)
    const RESERVED = ['www', 'api', 'admin', 'mail', 'ftp', 'localhost'];
    if (RESERVED.includes(s)) return false;

    if (!CF_API_TOKEN || !CF_ZONE_ID) {
      console.warn(
        'Cloudflare credentials missing. Skipping actual API check (Assuming available).',
      );
      return true;
    }

    try {
      // 2. Query Cloudflare DNS Records
      const queryName = `${s}.${BASE_DOMAIN}`;
      const url = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records?name=${queryName}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Cloudflare API Error:', errorText);
        throw new Error('Failed to check domain availability with provider.');
      }

      const data = (await res.json()) as { result: any[] };

      // If result array is empty, no record exists -> Available
      return data.result.length === 0;
    } catch (error) {
      console.error('Cloudflare Service Error:', error);
      // Fallback: If we can't check, we might assume safely false to prevent conflicts?
      // Or throw to let user try again.
      throw error;
    }
  },
};
