<script lang="ts">
  import { base } from '$app/paths';
  import type { InitialSubmit } from '$lib/api/websocket/submit';
  import { languageNames } from '$lib/language';
  import {
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListHead,
    StructuredListRow,
  } from 'carbon-components-svelte';
  import { filesize } from 'filesize';
  import moment from 'moment';
  import { match } from 'ts-pattern';

  export let submits: InitialSubmit[];
  export let user = false;
</script>

<StructuredList>
  <StructuredListHead>
    <StructuredListRow head>
      {#if user}
        <StructuredListCell head>User</StructuredListCell>
      {/if}
      <StructuredListCell head>Problem</StructuredListCell>
      <StructuredListCell head>Status</StructuredListCell>
      <StructuredListCell head>Memory</StructuredListCell>
      <StructuredListCell head>Time</StructuredListCell>
      <StructuredListCell head>Language</StructuredListCell>
      <StructuredListCell head>Submitted at</StructuredListCell>
    </StructuredListRow>
  </StructuredListHead>
  <StructuredListBody>
    {#each submits as submit}
      <StructuredListRow>
        {#if user}
          <StructuredListCell>
            <a href={`${base}/manage/users/${submit.user?.id}`}>
              {submit.user?.name}
            </a>
          </StructuredListCell>
        {/if}
        <StructuredListCell>
          <a href={`${base}/problems/${submit.problem.id}`}>
            {submit.problem.name}
          </a>
        </StructuredListCell>
        <StructuredListCell>
          {match(submit.status)
            .with({ type: 'WAITING' }, () => 'Waiting for compilation')
            .with({ type: 'COMPILING' }, () => 'Compiling')
            .with({ type: 'READY' }, () => 'Waiting for running')
            .with(
              { type: 'RUNNING' },
              ({ progress }) => `Running (${progress}%)`,
            )
            .with({ type: 'COMPLETE' }, ({ result }) =>
              match(result)
                .with({ type: 'SUCCESS' }, () => 'Success')
                .with({ type: 'FAILED' }, ({ reason }) =>
                  match(reason)
                    .with('WRONG', () => 'Wrong answer')
                    .with('MEMORY_LIMIT_EXCEED', () => 'Memory limit exceed')
                    .with('TIME_LIMIT_EXCEED', () => 'Time limit exceed')
                    .with('RUNTIME_ERROR', () => 'Runtime error')
                    .exhaustive(),
                )
                .with({ type: 'COMPILE_ERROR' }, () => 'Compile error')
                .with({ type: 'UNKNOWN_ERROR' }, () => 'Unknown error')
                .exhaustive(),
            )
            .exhaustive()}
        </StructuredListCell>
        <StructuredListCell>
          {submit.status.type === 'COMPLETE' &&
          submit.status.result.type === 'SUCCESS'
            ? filesize(submit.status.result.memory)
            : ''}
        </StructuredListCell>
        <StructuredListCell>
          {submit.status.type === 'COMPLETE' &&
          submit.status.result.type === 'SUCCESS'
            ? `${submit.status.result.time}ms`
            : ''}
        </StructuredListCell>
        <StructuredListCell>
          <a href={`${base}/submits/${submit.id}`}>
            {languageNames[submit.language]}
            <span class="text-xs">(Edit)</span>
          </a>
        </StructuredListCell>
        <StructuredListCell>
          {moment(submit.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </StructuredListCell>
      </StructuredListRow>
    {/each}
  </StructuredListBody>
</StructuredList>
