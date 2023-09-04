<script lang="ts">
  import { page } from '$app/stores';
  import { getConnection } from '$lib/api';
  import Box from '$lib/components/layouts/Box.svelte';
  import api from '@code-judge/api';
  import { get } from 'svelte/store';

  import '$lib/styles/markdown.scss';
  import Orientation from '$lib/components/layouts/Orientation.svelte';
  import CodeEditor from '$lib/components/CodeEditor.svelte';
  import type { Language } from '$lib/language';
  import { goto } from '$app/navigation';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
  import LanguageSelector from '$lib/components/LanguageSelector.svelte';
  import { template } from 'lodash';
  import { base } from '$app/paths';

  const id = get(page).params.id;

  const problem = api.functional.problem
    .get(getConnection(), id)
    .then((response) => response.problem);

  let language: Language = 'C';
  let codes: Partial<Record<Language, string>> = {};

  problem.then((problem) => {
    codes = problem.templates;
  });

  async function submit() {
    await api.functional.submit.create(getConnection(), {
      language,
      code: codes[language] ?? '',
      problemId: id,
    });

    goto(`${base}/submits`);
  }
</script>

<UserOnly>
  <div
    class="flex flex-col gap-4 laptop:flex-row laptop:w-[calc(100vw-64px-128px)]"
  >
    {#await problem then problem}
      <Box class="laptop:flex-[8]">
        <div class="markdown">
          {@html problem.description}
        </div>
      </Box>

      <Box class="laptop:flex-[6]">
        <button on:click={submit}>Submit</button>
        <div class="mt-4 flex flex-row gap-x-2 items-center justify-end">
          <div class="label">Language</div>
          <LanguageSelector
            bind:language
            languages={Object.keys(problem.templates)}
          />
        </div>
        <CodeEditor bind:code={codes[language]} bind:language />
      </Box>
    {/await}
  </div>
</UserOnly>
