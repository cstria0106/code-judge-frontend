<script lang="ts">
  import { getWebsocketConnection } from '$lib/api';
  import type {
    InitialSubmit,
    SubmitSubscribeEvent,
  } from '$lib/api/websocket/submit';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
  import { connectWebsocket } from '$lib/websocket';
  import type api from '@code-judge/api';
  import moment from 'moment';
  import { match } from 'ts-pattern';
  import SubmitTable from './SubmitTable.svelte';
  import { onMount } from 'svelte';
  import { Column } from 'carbon-components-svelte';

  let skip = 0;

  onMount(async () => {
    const websocket = await connectWebsocket<SubmitSubscribeEvent>(
      getWebsocketConnection(),
    );

    const receive = websocket.receive();
    receive.subscribe((payload) => {
      match(payload)
        .with({ event: 'get/submit/initial' }, (payload) => {
          submits = payload.data.submits;
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

    websocket.send({ event: 'get/submit', data: { skip } });
  });

  let submits: InitialSubmit[] | undefined = undefined;
</script>

<UserOnly>
  <Column>
    <h4 class="mb-4">Submits</h4>
    {#if submits !== undefined}
      <SubmitTable {submits} />
    {/if}
  </Column>
</UserOnly>
