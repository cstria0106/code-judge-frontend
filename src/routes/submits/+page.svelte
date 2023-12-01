<script lang="ts">
  import { getWebsocketConnection } from '$lib/api';
  import type {
    InitialSubmit,
    SubmitSubscribeEvent,
  } from '$lib/api/websocket/submit';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
  import { connectWebsocket } from '$lib/websocket';
  import { match } from 'ts-pattern';
  import SubmitTable from './SubmitTable.svelte';
  import { onMount } from 'svelte';
  import { Column, PaginationNav } from 'carbon-components-svelte';
  import type { Socket } from 'socket.io-client';

  let count = 0;
  let page = 0;
  const take = 20;
  let lastSocket: Socket | null = null;

  async function loadPage(page: number) {
    if (lastSocket !== null) {
      lastSocket.close();
    }

    const websocket = await connectWebsocket<SubmitSubscribeEvent>(
      getWebsocketConnection(),
    );

    const receive = websocket.receive();
    receive.subscribe((payload) => {
      match(payload)
        .with({ event: 'get/submit/initial' }, (payload) => {
          submits = payload.data.submits;
          count = payload.data.count;
        })
        .with({ event: 'get/submit/update' }, (payload) => {
          submits = submits?.map((submit) =>
            submit.id !== payload.data.submit.id
              ? submit
              : { ...submit, status: payload.data.submit.status },
          );
        })
        .otherwise(() => {});
    });

    lastSocket = websocket.send({
      event: 'get/submit',
      data: { skip: page * take, take },
    });
  }

  onMount(async () => {
    loadPage(0);
  });

  let submits: InitialSubmit[] | undefined = undefined;
</script>

<UserOnly>
  <Column>
    <h4 class="mb-4">Submits</h4>
    {#if submits !== undefined}
      <SubmitTable {submits} />
    {/if}
    <PaginationNav
      page={page + 1}
      total={Math.ceil(count / take)}
      on:change={(e) => {
        loadPage(e.detail.page - 1);
      }}
    />
  </Column>
</UserOnly>
