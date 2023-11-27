<script lang="ts">
  import '$lib/styles/markdown.scss';
  import { page } from '$app/stores';
  import { getConnection } from '$lib/api';
  import api from '@code-judge/api';
  import { get } from 'svelte/store';
  import CodeEditor from '$lib/components/CodeEditor.svelte';
  import type { Language } from '$lib/language';
  import { goto } from '$app/navigation';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
  import LanguageSelector from '$lib/components/LanguageSelector.svelte';
  import { base } from '$app/paths';
  import {
    Button,
    ButtonSet,
    Column,
    Row,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListHead,
    StructuredListRow,
  } from 'carbon-components-svelte';
  import { filesize } from 'filesize';
  import { onMount } from 'svelte';

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

<svelte:window
  on:beforeunload|preventDefault={(e) => {
    e.preventDefault();
    e.returnValue = true;
    return 'Are you sure to leave this page?';
  }}
/>

<UserOnly let:user>
  {#await problem then problem}
    <Column>
      <Row>
        <Column>
          <StructuredList>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>Problem Name</StructuredListCell>
                <StructuredListCell head>Time Limit</StructuredListCell>
                <StructuredListCell head>Memory Limit</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              <StructuredListRow>
                <StructuredListCell>{problem.name}</StructuredListCell>
                <StructuredListCell>{problem.timeLimit}ms</StructuredListCell>
                <StructuredListCell
                  >{filesize(problem.memoryLimit)}</StructuredListCell
                >
              </StructuredListRow>
            </StructuredListBody>
          </StructuredList>

          <div class="markdown">
            {@html problem.description}
          </div>
        </Column>

        <Column>
          <LanguageSelector
            bind:language
            labelText="Select language"
            languages={Object.keys(problem.templates)}
          />
          <CodeEditor bind:code={codes[language]} bind:language />
          <Row>
            <Column>
              <ButtonSet class="flex justify-end mt-4">
                {#if user !== null && user.role === 'ADMIN'}
                  <Button
                    kind="tertiary"
                    on:click={() => {
                      goto(`${base}/manage/problems/${problem.id}`);
                    }}>Manage</Button
                  >
                {/if}
                <Button on:click={submit}>Submit</Button>
              </ButtonSet>
            </Column>
          </Row>
        </Column>
      </Row>
    </Column>
  {/await}
</UserOnly>
