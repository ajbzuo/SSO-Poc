import 'express-session';
import type { SessionState } from '../lib/auth/bridge.js';

declare module 'express-session' {
  interface SessionData {
    auth?: SessionState;
    relayState?: Record<string, { returnTo: string; createdAt: number }>;
  }
}
