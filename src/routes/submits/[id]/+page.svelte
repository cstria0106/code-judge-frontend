<script lang="ts">
  import { page } from '$app/stores';
  import { getConnection, getWebsocketConnection } from '$lib/api';
  import type {
    DetailSubmit,
    SubmitSubscribeEvent,
  } from '$lib/api/websocket/submit';
  import BoxTitle from '$lib/components/BoxTitle.svelte';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
  import Box from '$lib/components/layouts/Box.svelte';
  import { connectWebsocket } from '$lib/websocket';
  import { match } from 'ts-pattern';
  import SubmitTable from '../SubmitTable.svelte';
  import CodeEditor from '$lib/components/CodeEditor.svelte';
  import api from '@code-judge/api';
  import { goto } from '$app/navigation';
  import type { Language } from '$lib/language';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  const id = $page.params.id;

  let submit: DetailSubmit | undefined = undefined;

  let code: string = '';

  async function submitAgain() {
    if (!submit) return;
    await api.functional.submit.create(getConnection(), {
      language: submit.language,
      code,
      problemId: submit.problem.id,
    });

    goto(`${base}/submits`);
  }

  onMount(async () => {
    const websocket = await connectWebsocket<SubmitSubscribeEvent>(
      getWebsocketConnection(),
    );

    const receive = websocket.receive();
    receive.subscribe((payload) => {
      match(payload)
        .with({ event: 'get/submit/detail' }, (payload) => {
          submit = payload.data.submit;
          code = payload.data.submit.code;
        })
        .with({ event: 'get/submit/update' }, (payload) => {
          if (submit)
            submit = { ...submit, status: payload.data.submit.status };
        })
        .otherwise(() => {});
    });

    websocket.send({ event: 'get/submit', data: { id } });
  });
</script>

<UserOnly>
  <Box>
    <BoxTitle>Submits</BoxTitle>
    {#if submit !== undefined}
      <SubmitTable submits={[submit]} />
      <div class="mt-4">
        <div>Code</div>
        <CodeEditor language={submit.language} bind:code />
        <div class="mt-4 text-right">
          <button class="inline-block w-auto" on:click={submitAgain}>
            Submit
          </button>
        </div>
      </div>
      {#if submit.status.type === 'COMPLETE' && submit.status.result.type === 'COMPILE_ERROR'}
        <div class="mt-4">
          <div class="mb-2">Compiler message</div>
          <pre
            class="text-xs border border-gray-200 rounded-sm p-4 overflow-scroll">{submit
              .status.result.message}</pre>
        </div>
      {/if}
    {/if}
  </Box>
</UserOnly>
