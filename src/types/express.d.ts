import 'express-session';
import type { SessionState } from '../lib/auth/bridge.js';
import type { RelayStateStore } from '../lib/auth/relayState.js';

declare module 'express-session' {
  interface SessionData {
    auth?: SessionState;
    relayState?: RelayStateStore;
  }
}
