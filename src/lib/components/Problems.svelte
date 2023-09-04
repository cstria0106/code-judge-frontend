<script lang="ts">
  import type api from '@code-judge/api';
  import { createEventDispatcher } from 'svelte';
  import { BarsRotateFade } from 'svelte-svg-spinners';
  import moment from 'moment';
  import { isAfter, isBefore } from '$lib/utils/date';

  export let pages: Promise<
    api.functional.problem.list.Output['problems'][number][]
  >[];

  export let paging: boolean = false;

  let empty: boolean = false;
  let noMore: boolean = false;

  $: pages,
    (() => {
      pages.length > 0 &&
        pages[0].then((problems) => (empty = problems.length === 0));
      pages.length > 0 &&
        pages[pages.length - 1].then(
          (problems) => (noMore = problems.length === 0),
        );
    })();

  const dispatch = createEventDispatcher<{
    loadMore: string;
    clickProblem: api.functional.problem.list.Output['problems'][number];
  }>();

  function formatDate(dateString: string) {
    const date = moment(dateString);
    return date.format('MM-DD HH:mm');
  }

  const now = moment();
</script>

<div class="min-h-[48px]">
  {#if empty}
    <div class="text-sm text-gray-500">Nothing...</div>
  {:else}
    <ul class="flex flex-col gap-y-4">
      {#each pages as problems, i}
        {#await problems}
          <BarsRotateFade size={32} color="#333" />
        {:then problems}
          {#each problems as problem}
            <li>
              <button
                type="button"
                on:click={() => {
                  dispatch('clickProblem', problem);
                }}
                class={`bg-gray-100 text-black border border-solid border-gray-300`}
              >
                <div
                  class="bg-slate-800 bg-opacity-50 text-white px-1 py-0.5 rounded-md text-xs"
                >
                  {#if problem.startTime !== null && problem.endTime !== null}
                    <!-- If it's already end -->
                    {#if isBefore(problem.endTime, now)}
                      End
                    {:else}
                      <!-- If it's not started -->
                      {#if isAfter(problem.startTime, now)}
                        {formatDate(problem.startTime)}
                      {/if}
                      ~ {formatDate(problem.endTime)}
                    {/if}
                  {:else if problem.startTime !== null}
                    Permanent
                  {:else}
                    Draft
                  {/if}
                </div>
                {problem.name}
              </button>
            </li>
          {/each}
          {#if paging && !noMore}
            <li>
              <button
                type="button"
                class="bg-green-600"
                on:click={() => {
                  dispatch('loadMore', problems[problems.length - 1].id);
                }}
              >
                Load more
              </button>
            </li>
          {/if}
        {/await}
      {/each}
    </ul>
  {/if}
</div>
