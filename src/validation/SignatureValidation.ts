import { createHmac } from 'node:crypto';

export class InvalidSignatureError extends Error {
  static {
    this.prototype.name = 'InvalidSignatureError';
  }
}

export function validateSignature({
  xHubSignature,
  reqBody,
  hubSecret,
}: {
  xHubSignature?: string;
  reqBody: string;
  hubSecret: string;
}) {
  if (!xHubSignature) {
    throw new InvalidSignatureError('X-Hub-Signature header is missing');
  }

  // X-Hub-Signature header starts with 'sha1=' prefix; strip it
  const [, got] = xHubSignature.split('=');
  const expected = createHmac('sha1', hubSecret).update(reqBody).digest('hex');
  if (got !== expected) {
    throw new InvalidSignatureError(`Signature mismatch: expected ${expected}, got ${got}`);
  }
}
