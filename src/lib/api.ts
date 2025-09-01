import { dev } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';
import type api from '@code-judge/api';
import { get } from 'svelte/store';
import { loginToken } from './store';
import type { WebsocketConnection } from './websocket';

export type User = {
  id: string;
  name: string;
  shouldChangePassword: boolean;
  role: 'STUDENT' | 'ADMIN';
};

function addBearerPrefix(token: string | undefined | null) {
  return token !== undefined && token !== null ? `Bearer ${token}` : undefined;
}

export function getConnection(noAuthorization?: boolean): api.IConnection {
  const host = dev ? 'http://localhost:3000' : PUBLIC_API_URL;
  const token = get(loginToken);
  return {
    host,
    headers: {
      ...(noAuthorization === false
        ? undefined
        : { Authorization: addBearerPrefix(token) }),
    },
  } as const satisfies api.IConnection;
}

export function getWebsocketConnection(
  noAuthorization?: boolean,
): WebsocketConnection {
  const host = dev ? 'ws://localhost:3000' : 'wss://api.algorithm.icnlab.dev';
  const token = get(loginToken);
  return {
    host,
    ...(noAuthorization === false
      ? undefined
      : {
          authorization: { token: addBearerPrefix(token) },
        }),
  };
}
