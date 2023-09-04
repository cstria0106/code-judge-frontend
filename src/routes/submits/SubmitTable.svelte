<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import type { InitialSubmit } from '$lib/api/websocket/submit';
  import { languageNames } from '$lib/language';
  import { filesize } from 'filesize';
  import moment from 'moment';
  import { match } from 'ts-pattern';

  export let submits: InitialSubmit[];
</script>

<div class="submit-table">
  <div>Problem</div>
  <div>Status</div>
  <div>Memory</div>
  <div>Time</div>
  <div>Language</div>
  <div>Submitted at</div>
  {#each submits as submit}
    <a href={`${base}/problems/${submit.problem.id}`}>{submit.problem.name}</a>
    <div>
      {match(submit.status)
        .with({ type: 'WAITING' }, () => 'Waiting for compilation')
        .with({ type: 'COMPILING' }, () => 'Compiling')
        .with({ type: 'READY' }, () => 'Waiting for running')
        .with({ type: 'RUNNING' }, ({ progress }) => `Running (${progress}%)`)
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
    </div>
    <div>
      {submit.status.type === 'COMPLETE' &&
      submit.status.result.type === 'SUCCESS'
        ? filesize(submit.status.result.memory * 1000)
        : ''}
    </div>
    <div>
      {submit.status.type === 'COMPLETE' &&
      submit.status.result.type === 'SUCCESS'
        ? `${submit.status.result.time}ms`
        : ''}
    </div>
    <button
      class="no-default-styles"
      on:click={() => {
        goto(`${base}/submits/${submit.id}`);
      }}
    >
      <div class="text-right">
        {languageNames[submit.language]} <span class="text-xs">(Edit)</span>
      </div>
    </button>
    <div>
      {moment(submit.createdAt).format('YYYY-MM-DD HH:mm:ss')}
    </div>
  {/each}
</div>

<style lang="scss" scoped>
  .submit-table {
    @apply grid grid-cols-[auto_1fr_auto_auto_auto_auto] text-sm border rounded-sm;

    & > div,
    & > a,
    & > button {
      @apply border-l border-b p-2;

      &:nth-child(6n + 1) {
        @apply border-l-0;
      }

      &:nth-last-child(-n + 6) {
        @apply border-b-0;
      }
    }

    & > a,
    & > button {
      @apply text-blue-600 hover:underline;
    }
  }
</style>
