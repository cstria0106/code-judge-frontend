import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';

export type WebsocketConnection = {
  host: string;
  authorization?: {
    token?: string;
  };
};

export type WsPayload<E extends string, Data> = {
  event: E;
  data: Data;
};

export type WsErrorPayload = WsPayload<'error', { reason: string }>;

export async function connectWebsocket<T extends WsPayload<string, any>>(
  connection: WebsocketConnection,
) {
  const socket = io(connection.host, {
    auth: connection.authorization?.token
      ? {
          token: connection.authorization.token,
        }
      : undefined,
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: true,
  });

  await new Promise<void>((resolve) => socket.on('connect', resolve));

  return {
    send: (payload: WsPayload<string, any>) =>
      socket.emit(payload.event, payload.data),
    receive: () =>
      new Observable<T | WsErrorPayload>((subscriber) => {
        socket.onAny((event, data) => {
          subscriber.next({ event, data } as T | WsErrorPayload);
        });

        socket.on('disconnect', () => {
          subscriber.complete();
        });
      }),
  };
}
