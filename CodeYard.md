"start": "vite --host"

Explicit Waits: In your client-side code, implement a mechanism to wait for the backend server to be ready before making requests. You can use a simple retry logic with exponential backoff:

async function fetchWithRetry(url: string, options: RequestInit, retries = 5, delay = 1000) {
try {
return await fetch(url, options);
} catch (error) {
if (retries > 0) {
await new Promise(resolve => setTimeout(resolve, delay));
return fetchWithRetry(url, options, retries - 1, delay \* 2);
} else {
throw error;
}
}
}

// ...in your component
const response = await fetchWithRetry("/api/clean-recipes", { method: 'POST' });
