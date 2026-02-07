// Service icon cache
const ICON_CACHE_KEY = 'service_icons_cache';
const ICON_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedIcon {
  url: string;
  timestamp: number;
}

interface CachedIcons {
  [key: string]: CachedIcon;
}

// Popular services with direct icon URLs
const KNOWN_SERVICES: Record<string, string> = {
  netflix: 'https://www.netflix.com/favicon.ico',
  spotify: 'https://www.spotify.com/favicon.ico',
  youtube: 'https://www.youtube.com/favicon.ico',
  'youtube premium': 'https://www.youtube.com/favicon.ico',
  apple: 'https://www.apple.com/favicon.ico',
  'apple music': 'https://www.apple.com/favicon.ico',
  'apple tv': 'https://www.apple.com/favicon.ico',
  amazon: 'https://www.amazon.com/favicon.ico',
  'amazon prime': 'https://www.amazon.com/favicon.ico',
  'amazon prime video': 'https://www.amazon.com/favicon.ico',
  hulu: 'https://www.hulu.com/favicon.ico',
  disney: 'https://www.disneyplus.com/favicon.ico',
  'disney+': 'https://www.disneyplus.com/favicon.ico',
  'disney plus': 'https://www.disneyplus.com/favicon.ico',
  hbo: 'https://www.hbomax.com/favicon.ico',
  'hbo max': 'https://www.hbomax.com/favicon.ico',
  paramount: 'https://www.paramountplus.com/favicon.ico',
  'paramount+': 'https://www.paramountplus.com/favicon.ico',
  peacock: 'https://www.peacocktv.com/favicon.ico',
  adobe: 'https://www.adobe.com/favicon.ico',
  'adobe creative cloud': 'https://www.adobe.com/favicon.ico',
  microsoft: 'https://www.microsoft.com/favicon.ico',
  'microsoft 365': 'https://www.microsoft.com/favicon.ico',
  office: 'https://www.microsoft.com/favicon.ico',
  github: 'https://github.com/favicon.ico',
  slack: 'https://www.slack.com/favicon.ico',
  notion: 'https://www.notion.so/favicon.ico',
  dropbox: 'https://www.dropbox.com/favicon.ico',
  'google drive': 'https://drive.google.com/favicon.ico',
  icloud: 'https://www.icloud.com/favicon.ico',
  onedrive: 'https://www.microsoft.com/favicon.ico',
  canva: 'https://www.canva.com/favicon.ico',
  figma: 'https://www.figma.com/favicon.ico',
  grammarly: 'https://www.grammarly.com/favicon.ico',
  chatgpt: 'https://chatgpt.com/favicon.ico',
  'openai': 'https://openai.com/favicon.ico',
  duolingo: 'https://www.duolingo.com/favicon.ico',
  skillshare: 'https://www.skillshare.com/favicon.ico',
  udemy: 'https://www.udemy.com/favicon.ico',
  coursera: 'https://www.coursera.org/favicon.ico',
  linkedin: 'https://www.linkedin.com/favicon.ico',
  'linkedin learning': 'https://www.linkedin.com/favicon.ico',
  gym: 'https://www.equinox.com/favicon.ico',
  peloton: 'https://www.onepeloton.com/favicon.ico',
  'planet fitness': 'https://www.planetfitness.com/favicon.ico',
  strava: 'https://www.strava.com/favicon.ico',
  myfitnesspal: 'https://www.myfitnesspal.com/favicon.ico',
  audible: 'https://www.audible.com/favicon.ico',
  medium: 'https://www.medium.com/favicon.ico',
  substack: 'https://www.substack.com/favicon.ico',
  patreon: 'https://www.patreon.com/favicon.ico',
  twitch: 'https://www.twitch.tv/favicon.ico',
  discord: 'https://discord.com/favicon.ico',
};

function getCachedIcon(serviceName: string): CachedIcon | null {
  try {
    const cached = localStorage.getItem(ICON_CACHE_KEY);
    if (!cached) return null;

    const icons: CachedIcons = JSON.parse(cached);
    const icon = icons[serviceName.toLowerCase()];

    if (icon && Date.now() - icon.timestamp < ICON_CACHE_DURATION) {
      return icon;
    }
  } catch (error) {
    console.error('Error reading icon cache:', error);
  }

  return null;
}

function setCachedIcon(serviceName: string, url: string): void {
  try {
    const cached = localStorage.getItem(ICON_CACHE_KEY);
    const icons: CachedIcons = cached ? JSON.parse(cached) : {};

    icons[serviceName.toLowerCase()] = {
      url,
      timestamp: Date.now(),
    };

    localStorage.setItem(ICON_CACHE_KEY, JSON.stringify(icons));
  } catch (error) {
    console.error('Error writing icon cache:', error);
  }
}

export async function getServiceIcon(serviceName: string): Promise<string | null> {
  const lowerName = serviceName.toLowerCase();

  // Check cache first
  const cached = getCachedIcon(lowerName);
  if (cached) {
    return cached.url;
  }

  // Check known services
  if (KNOWN_SERVICES[lowerName]) {
    const url = KNOWN_SERVICES[lowerName];
    setCachedIcon(lowerName, url);
    return url;
  }

  // Try to find by partial match
  for (const [key, url] of Object.entries(KNOWN_SERVICES)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      setCachedIcon(lowerName, url);
      return url;
    }
  }

  // Try using favicon.io API as fallback
  try {
    // Extract domain from service name (e.g., "Netflix" -> "netflix.com")
    const domain = `${lowerName}.com`;
    const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

    // Verify the favicon exists by checking if it's accessible
    const response = await fetch(faviconUrl, { method: 'HEAD' });
    if (response.ok) {
      setCachedIcon(lowerName, faviconUrl);
      return faviconUrl;
    }
  } catch (error) {
    console.error('Error fetching favicon:', error);
  }

  return null;
}

export function getDefaultServiceIcon(): string {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23E5E7EB" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" fill="%23999" text-anchor="middle" dy=".3em"%3E%3F%3C/text%3E%3C/svg%3E';
}
