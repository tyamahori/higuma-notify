import type { Context } from 'hono';
import type { Bindings } from './Bindings';

export type HigumaContext = Context<{ Bindings: Bindings }>;
