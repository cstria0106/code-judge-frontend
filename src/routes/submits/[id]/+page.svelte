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
  import { Button, CodeSnippet, Column, Row } from 'carbon-components-svelte';

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
  <Column>
    {#if submit !== undefined}
      <SubmitTable submits={[submit]} />
      <h5>Code</h5>
      <CodeEditor language={submit.language} bind:code />
      <Row class="my-4">
        <Column class="flex flex-row justify-end">
          <Button on:click={submitAgain}>Submit</Button>
        </Column>
      </Row>
      {#if submit.status.type === 'COMPLETE' && submit.status.result.type === 'COMPILE_ERROR'}
        <h5 class="mb-4">Compiler message</h5>
        <div class="[&>div]:max-w-none">
          <CodeSnippet
            id="snippet"
            code={submit.status.result.message}
            type="multi"
          />
        </div>
      {/if}
    {/if}
  </Column>
</UserOnly>
