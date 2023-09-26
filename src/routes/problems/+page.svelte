<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { getConnection } from '$lib/api';
  import BoxTitle from '$lib/components/BoxTitle.svelte';
  import Problems from '$lib/components/Problems.svelte';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
  import Box from '$lib/components/layouts/Box.svelte';
  import api from '@code-judge/api';

  function onLoadMore(cursor: string) {
    problemsEntries = [
      ...problemsEntries,
      api.functional.problem
        .list(getConnection(), {
          all: true,
          cursor: cursor,
        })
        .then((response) => response.problems),
    ];
  }

  async function load(cursor?: string) {
    return api.functional.problem
      .list(getConnection(), {
        all: true,
        cursor,
      })
      .then((response) => response.problems);
  }

  let problemsEntries = [load()];
</script>

<UserOnly>
  <h2 class="mb-4">All Problems</h2>
  <Problems
    pages={problemsEntries}
    paging
    on:loadMore={(e) => onLoadMore(e.detail)}
    on:clickProblem={(e) => goto(`${base}/problems/${e.detail.id}`)}
  />
</UserOnly>
