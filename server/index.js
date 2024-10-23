import express from 'express';
import { createServer } from 'http';

import { handler } from '../build/handler.js';

const port = 8092;
const app = express();
const server = createServer(app);

// SvelteKit should handle everything else using Express middleware
// https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
app.use(handler);

console.log(`Server listening on http://localhost:${port}`);
server.listen(port);
