#!/usr/bin/env -S deno run -A --watch=static/,routes/

if (!Deno.env.get('DENO_DEPLOYMENT_ID')) {
  await import('https://deno.land/std@0.224.0/dotenv/load.ts');
}

import dev from '$fresh/dev.ts';
import config from './fresh.config.ts';

await dev(import.meta.url, './main.ts', config);
