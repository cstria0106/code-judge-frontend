<script lang="ts">
  import { goto } from '$app/navigation';
  import { getConnection } from '$lib/api';
  import BoxTitle from '$lib/components/BoxTitle.svelte';
  import Problems from '$lib/components/Problems.svelte';
  import Box from '$lib/components/layouts/Box.svelte';
  import Orientation from '$lib/components/layouts/Orientation.svelte';
  import api from '@code-judge/api';
  import moment from 'moment';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { searchString, showDrafts, showEnded } from './store';
  import { base } from '$app/paths';

  let allProblems: api.functional.problem.manage.manageList.Output['problems'] =
    [];

  let problems: typeof allProblems = [];

  // Load on mount
  onMount(async () => {
    allProblems = await api.functional.problem.manage
      .manageList(getConnection())
      .then((response) => response.problems);
  });

  async function create() {
    const response = await api.functional.problem.manage.manageCreate(
      getConnection(),
    );
    goto(`${base}/manage/problems/${response.problem.id}`);
  }

  $: allProblems,
    $showEnded,
    $showDrafts,
    $searchString,
    (problems = allProblems.filter((problem) => {
      const now = moment();
      if (
        get(showEnded) === false &&
        moment(problem.endTime).endOf('minute').isSameOrBefore(now)
      )
        return false;

      if (get(showDrafts) === false && problem.startTime === null) return false;

      const searchStringValue = get(searchString);
      const tokens = searchStringValue.split(/\s+/);
      if (
        tokens.some(
          (token) => !problem.name.toLowerCase().includes(token.toLowerCase()),
        )
      ) {
        return false;
      }

      return true;
    }));
</script>

<Orientation vertical>
  <button on:click={create}>Create</button>

  <Box>
    <BoxTitle>Manage Problems</BoxTitle>
    <div class="flex flex-row gap-x-2 items-center mb-4">
      <label for="search">Search:</label>
      <input
        id="search"
        type="text"
        class="text-xs p-1"
        placeholder="Name"
        bind:value={$searchString}
      />
      <div class="flex-1" />
      <label for="show-all">Show ended</label>
      <input id="show-all" type="checkbox" bind:checked={$showEnded} />
      <label for="show-drafts">Show drafts</label>
      <input id="show-drafts" type="checkbox" bind:checked={$showDrafts} />
    </div>
    <div
      class="h-[400px] overflow-y-scroll border border-gray-300 p-4 rounded-md"
    >
      <Problems
        pages={[Promise.resolve(problems)]}
        on:clickProblem={(e) => goto(`${base}/manage/problems/${e.detail.id}`)}
      />
    </div>
  </Box>
</Orientation>
