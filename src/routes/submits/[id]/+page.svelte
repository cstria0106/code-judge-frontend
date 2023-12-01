<script lang="ts">
  import { page } from '$app/stores';
  import { getConnection } from '$lib/api';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
  import SubmitTable from '../SubmitTable.svelte';
  import CodeEditor from '$lib/components/CodeEditor.svelte';
  import api from '@code-judge/api';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { Button, CodeSnippet, Column, Row } from 'carbon-components-svelte';
  import type { Language } from '@code-judge/api/lib/problem/template';

  const id = $page.params.id;
  const manage = $page.url.searchParams.get('manage') !== null;

  const submit = (
    manage ? api.functional.submit.manage.manageGet : api.functional.submit.get
  )(getConnection(), id).then((response) => ({
    ...response.submit,
    createdAt: new Date(response.submit.createdAt),
  }));

  let code: string = '';

  submit.then((response) => (code = response.code));

  async function submitAgain(language: Language, problemId: string) {
    if (!submit) return;
    await api.functional.submit.create(getConnection(), {
      language,
      code,
      problemId,
    });

    goto(`${base}/submits`);
  }
</script>

<UserOnly>
  <Column>
    {#await submit then submit}
      <SubmitTable submits={[submit]} {manage} />
      <h5>Code</h5>
      <CodeEditor language={submit.language} bind:code />
      <Row class="my-4">
        <Column class="flex flex-row justify-end">
          <Button
            on:click={() => submitAgain(submit.language, submit.problem.id)}
            >Submit</Button
          >
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
    {/await}
  </Column>
</UserOnly>
