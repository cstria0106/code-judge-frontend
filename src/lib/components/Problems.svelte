<script lang="ts">
  import type api from '@code-judge/api';
  import { createEventDispatcher } from 'svelte';
  import { BarsRotateFade } from 'svelte-svg-spinners';
  import moment from 'moment';
  import { isAfter, isBefore } from '$lib/utils/date';
  import {
    Button,
    InlineLoading,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListHead,
    StructuredListRow,
  } from 'carbon-components-svelte';

  export let pages: Promise<
    api.functional.problem.list.Output['problems'][number][]
  >[];

  export let paging: boolean = false;

  let empty: boolean = false;
  let noMore: boolean = false;
  let lastProblemId: string | null;

  $: pages,
    (() => {
      pages.length > 0 &&
        pages[0].then((problems) => (empty = problems.length === 0));
      pages.length > 0 &&
        pages[pages.length - 1].then((problems) => {
          if (problems.length > 0) {
            lastProblemId = problems[problems.length - 1].id;
          } else {
            noMore = true;
          }
        });
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

{#if empty}
  <div>No items</div>
{:else}
  <StructuredList class="mb-5">
    <StructuredListHead>
      <StructuredListRow head>
        <StructuredListCell head>ID</StructuredListCell>
        <StructuredListCell head>Name</StructuredListCell>
        <StructuredListCell head>Term</StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {#each pages as problems}
        {#await problems}
          <InlineLoading />
        {:then problems}
          {#each problems as problem}
            <StructuredListRow
              class="cursor-pointer hover:bg-gray-50"
              on:click={() => {
                dispatch('clickProblem', problem);
              }}
            >
              <StructuredListCell>{problem.id}</StructuredListCell>
              <StructuredListCell>{problem.name}</StructuredListCell>
              <StructuredListCell>
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
              </StructuredListCell>
            </StructuredListRow>
          {/each}
        {/await}
      {/each}
    </StructuredListBody>
  </StructuredList>
  {#if paging && !noMore && lastProblemId !== null}
    <div class="text-right">
      <Button
        on:click={() => {
          if (lastProblemId !== null) {
            dispatch('loadMore', lastProblemId);
          }
        }}
      >
        Load more
      </Button>
    </div>
  {/if}
{/if}
