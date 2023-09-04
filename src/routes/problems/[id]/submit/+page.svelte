<script lang="ts">
  import { page } from '$app/stores';
  import { getConnection } from '$lib/api';
  import Box from '$lib/components/layouts/Box.svelte';
  import api from '@code-judge/api';
  import { get } from 'svelte/store';

  import '$lib/styles/markdown.scss';
  import CodeEditor from '$lib/components/CodeEditor.svelte';
  import type { Language } from '$lib/language';
  import { goto } from '$app/navigation';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  const problemId = get(page).params.id;

  let language: Language = 'C';
  let codes: Partial<Record<Language, string>> = {};

  onMount(async () => {
    const state = history.state.codes;
    if (state) {
      codes = state;
      return;
    }

    const problem = await api.functional.problem
      .get(getConnection(), problemId)
      .then((response) => response.problem);
    codes = problem.templates;
  });

  async function submit() {
    await api.functional.submit.create(getConnection(), {
      language,
      code: codes[language] ?? '',
      problemId: problemId,
    });

    goto(`${base}/submits`);
  }
</script>

<!-- <UserOnly>
  <Box>
    <button on:click={submit}>Submit</button>
    <CodeEditor bind:value={codes} bind:language />
  </Box>
</UserOnly> -->
