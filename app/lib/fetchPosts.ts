import axios, { AxiosInstance } from 'axios';
import fs from 'fs/promises';
import path from 'path';

interface PostNode {
  name: string;
  tagline: string;
  votesCount: number;
  createdAt: string;
  url: string;
  website: string;
  thumbnail: {
    url: string;
  };
}

// Cookie storage path
const COOKIES_FILE = path.join(process.cwd(), '.ph-cookies.json');

// Dub.co API functions
async function createDubShortLink(url: string): Promise<string> {
  try {
    console.log(`Creating Dub.co short link for: ${url}`);
    
    if (!process.env.DUB_API_KEY) {
      console.warn('DUB_API_KEY not found, using original URL');
      return url;
    }
    
    const response = await axios.post('https://api.dub.co/links', {
      url: url,
      domain: 'go.debutism.com',
      folderId: 'fold_1JVYQW1T88ZD0QZF62MY2088R'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DUB_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.shortLink) {
      console.log(`Short link created: ${response.data.shortLink}`);
      return response.data.shortLink;
    } else {
      console.warn(`No shortLink in response for ${url}, using original URL`);
      return url;
    }
  } catch (error: any) {
    console.error(`Failed to create short link for ${url}:`, error.message);
    // If short link creation fails, return the original URL
    return url;
  }
}

async function createShortLinksForPosts(posts: PostNode[]): Promise<PostNode[]> {
  console.log(`Creating short links for ${posts.length} posts...`);
  
  // Process posts sequentially to avoid overwhelming the Dub.co API
  const postsWithShortLinks: PostNode[] = [];
  
  for (const post of posts) {
    const shortLink = await createDubShortLink(post.url);
    postsWithShortLinks.push({
      ...post,
      url: shortLink
    });
    
    // Add a small delay between requests to respect rate limits
    if (postsWithShortLinks.length < posts.length) {
      await delay(500); // 500ms delay between requests
    }
  }

  console.log('Short links creation completed');
  return postsWithShortLinks;
}

// Create a persistent axios instance with browser-like configuration
const createBrowserLikeClient = (): AxiosInstance => {
  const client = axios.create({
    timeout: 45000,
    maxRedirects: 5,
    validateStatus: (status) => status < 500, // Don't throw on 4xx
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"macOS"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'Connection': 'keep-alive',
      'DNT': '1'
    }
  });

  // Add request interceptor for timing and session management
  client.interceptors.request.use(async (config) => {
    // Add small random delay to mimic human behavior
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Add timestamp and browser entropy
    if (config.url) {
      const separator = config.url.includes('?') ? '&' : '?';
      const entropy = Math.random().toString(36).substring(7);
      config.url += `${separator}_t=${Date.now()}&_r=${entropy}`;
    }
    
    // Load and apply cookies
    const cookies = await loadCookies();
    if (cookies) {
      config.headers['Cookie'] = cookies;
    }
    
    return config;
  });

  // Add response interceptor for cookie management
  client.interceptors.response.use(async (response) => {
    // Save cookies from successful responses
    const setCookies = response.headers['set-cookie'];
    if (setCookies) {
      await saveCookies(setCookies);
    }
    return response;
  });

  return client;
};

// Persistent client instance
let browserClient: AxiosInstance | null = null;

const getBrowserClient = () => {
  if (!browserClient) {
    browserClient = createBrowserLikeClient();
  }
  return browserClient;
};

// Cookie management functions
async function saveCookies(setCookies: string[]): Promise<void> {
  try {
    const cookieString = setCookies.join('; ');
    await fs.writeFile(COOKIES_FILE, cookieString, 'utf8');
    console.log('Cookies saved successfully');
  } catch (error) {
    console.warn('Failed to save cookies:', error);
  }
}

async function loadCookies(): Promise<string | null> {
  try {
    const cookieString = await fs.readFile(COOKIES_FILE, 'utf8');
    return cookieString.trim();
  } catch (error) {
    return null;
  }
}

async function clearCookies(): Promise<void> {
  try {
    await fs.unlink(COOKIES_FILE);
    console.log('Cookies cleared');
  } catch (error) {
    // File doesn't exist, which is fine
  }
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Enhanced session warm-up with multiple steps
async function warmUpSession(): Promise<void> {
  try {
    console.log('Warming up session with Product Hunt...');
    const client = getBrowserClient();
    
    // Step 1: Visit main page to establish initial session
    console.log('Step 1: Visiting main page...');
    await client.get('https://www.producthunt.com/', {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1'
      }
    });
    
    await delay(2000 + Math.random() * 2000);
    
    // Step 2: Make a simple API request to establish API session
    console.log('Step 2: Establishing API session...');
    await client.post('https://api.producthunt.com/v2/api/graphql', {
      query: 'query { viewer { id } }'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PH_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Origin': 'https://www.producthunt.com',
        'Referer': 'https://www.producthunt.com/',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    await delay(1000 + Math.random() * 1000);
    console.log('Session warmed up successfully');
  } catch (error: any) {
    console.warn('Session warm-up encountered issues, but continuing:', error.message);
  }
}

export async function fetchPosts(after: Date, before: Date): Promise<PostNode[]> {
  const maxRetries = 2;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}: Fetching posts from Product Hunt API...`);
      console.log('Date range:', { after: after.toISOString(), before: before.toISOString() });
      console.log('PH_ACCESS_TOKEN exists:', !!process.env.PH_ACCESS_TOKEN);
      console.log('PH_ACCESS_TOKEN length:', process.env.PH_ACCESS_TOKEN?.length || 0);

      // Warm up session on first attempt or after Cloudflare detection
      if (attempt === 1) {
        await warmUpSession();
      }

      const client = getBrowserClient();
      
      const response = await client.post(
        'https://api.producthunt.com/v2/api/graphql',
        {
          query: `
            query GetTopPosts($after: DateTime!, $before: DateTime!) {
              posts(first: 5, order: RANKING, postedAfter: $after, postedBefore: $before) {
                edges {
                  node {
                    name
                    tagline
                    votesCount
                    createdAt
                    url
                    website
                    thumbnail {
                      url
                    }
                  }
                }
              }
            }
          `,
          variables: {
            after: after.toISOString(),
            before: before.toISOString()
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.PH_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'Origin': 'https://www.producthunt.com',
            'Referer': 'https://www.producthunt.com/',
            'X-Requested-With': 'XMLHttpRequest',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site'
          }
        }
      );

      console.log('Product Hunt API response status:', response.status);
      
      // Check for Cloudflare challenge in response
      if (response.status === 403 || 
          (typeof response.data === 'string' && response.data.includes('challenge-platform'))) {
        throw new Error('Cloudflare challenge detected');
      }
      
      if (response.data?.data?.posts?.edges) {
        const posts = response.data.data.posts.edges.map((edge: { node: PostNode }) => edge.node);
        console.log('Posts fetched successfully:', posts.length);
        
        // Create short links for all posts
        const postsWithShortLinks = await createShortLinksForPosts(posts);
        return postsWithShortLinks;
      } else {
        throw new Error('Invalid response structure from Product Hunt API');
      }

    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:');
        console.error('Status:', error.response?.status);
        console.error('Status text:', error.response?.statusText);
        
        // Check for specific error conditions
        if (error.response?.status === 403) {
          console.error('403 Forbidden - Authentication or protection issue');
          
          // If it's a Cloudflare challenge, reset everything
          if (typeof error.response?.data === 'string' && 
              error.response.data.includes('challenge-platform')) {
            console.error('Cloudflare challenge detected - resetting session completely');
            browserClient = null; // Reset the client
            await clearCookies(); // Clear stored cookies
          }
        }
      }
      
      // Wait before retrying with exponential backoff + jitter
      if (attempt < maxRetries) {
        const baseWait = Math.pow(2, attempt) * 3000; // 6s, 12s
        const jitter = Math.random() * 2000; // Add up to 2s jitter
        const waitTime = baseWait + jitter;
        console.log(`Waiting ${Math.round(waitTime)}ms before retry...`);
        await delay(waitTime);
      }
    }
  }
  
  // If all retries failed, throw the last error
  console.error('All attempts to fetch from Product Hunt API failed.');
  console.error('This may be due to:');
  console.error('- Cloudflare protection blocking the requests');
  console.error('- Invalid or expired access token');
  console.error('- Rate limiting');
  console.error('- Network connectivity issues');
  
  throw lastError || new Error('Failed to fetch posts from Product Hunt API after all retries');
}
