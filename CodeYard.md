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

/////////////////////////////////////////////////////////
package.json -client modified from awesome-compose
/////////////////////////////////////////////////////////

{
"name": "client",
"private": true,
"version": "0.0.0",
"type": "module",
"scripts": {
"dev": "vite",
"build": "tsc && vite build",
"lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
"preview": "vite preview"
},
"dependencies": {
"react": "^18.2.0",
"react-dom": "^18.2.0"
},
"devDependencies": {
"@types/react": "^18.2.66",
"@types/react-dom": "^18.2.22",
"@typescript-eslint/eslint-plugin": "^7.2.0",
"@typescript-eslint/parser": "^7.2.0",
"@vitejs/plugin-react-swc": "^3.5.0",
"eslint": "^8.57.0",
"eslint-plugin-react-hooks": "^4.6.0",
"eslint-plugin-react-refresh": "^0.4.6",
"typescript": "^5.2.2",
"vite": "^5.2.0"
},
"eslintConfig": {
"extends": "react-app"
},
"browserslist": {
"production": [
">0.2%",
"not dead",
"not op_mini all"
],
"development": [
"last 1 chrome version",
"last 1 firefox version",
"last 1 safari version"
]
}
}

/////////////////////////////////////////////////////////
package.json -server modified from awesome-compose
/////////////////////////////////////////////////////////

{
"name": "node-docker-good-defaults",
"private": true,
"version": "2.0.1",
"description": "Node.js Hello world app using docker features for easy docker compose local dev and solid production defaults",
"author": "Bret Fisher <bret@bretfisher.com>",
"main": "src/index.js",
"scripts": {
"start": "node src/index.js",
"start-watch": "nodemon src/index.js --inspect=0.0.0.0:9229",
"start-wait-debuger": "nodemon src/index.js --inspect-brk=0.0.0.0:9229",
"test": "cross-env NODE_ENV=test PORT=8081 mocha --timeout 10000 --exit --inspect=0.0.0.0:9230",
"test-watch": "nodemon --exec \"npm test\"",
"test-wait-debuger": "cross-env NODE_ENV=test PORT=8081 mocha --no-timeouts --exit --inspect-brk=0.0.0.0:9230"
},
"dependencies": {
"express": "^4.19.2",
"winston": "^3.13.0"
},
"devDependencies": {
"chai": "^5.1.1",
"chai-http": "^5.0.0",
"cross-env": "^7.0.3",
"mocha": "^10.4.0",
"nodemon": "^3.1.3"
}
}
