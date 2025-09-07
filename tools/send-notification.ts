import { createHmac } from 'node:crypto';

function stringEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

const HUB_CALLBACK = stringEnv('HUB_CALLBACK');
const HUB_SECRET = stringEnv('HUB_SECRET');
const PAYLOAD = stringEnv('PAYLOAD');

const hmac = createHmac('sha1', HUB_SECRET).update(PAYLOAD).digest('hex');

const res = await fetch(HUB_CALLBACK, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/atom+xml',
    'X-Hub-Signature': `sha1=${hmac}`,
  },
  body: PAYLOAD,
});

const resBody = await res.text();
console.log({
  status: res.status,
  resBody,
});
