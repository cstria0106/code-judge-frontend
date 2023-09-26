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
  import {
    Button,
    ButtonSet,
    Checkbox,
    Column,
    Row,
    Search,
    TextInput,
  } from 'carbon-components-svelte';

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

<Column>
  <h2 class="mb-4">Manage Problems</h2>
  <Row class="mb-4">
    <Column>
      <Search bind:value={$searchString} placeholder="Keyword" class="mb-4" />
      <Row>
        <Column class="flex-grow-0 whitespace-nowrap">
          <Checkbox labelText="Show ended" bind:checked={$showEnded} />
        </Column>
        <Column class="flex-grow-0 whitespace-nowrap">
          <Checkbox labelText="Show drafts" bind:checked={$showDrafts} />
        </Column>
        <Column>
          <ButtonSet class="justify-end">
            <Button on:click={create}>Create</Button>
          </ButtonSet>
        </Column>
      </Row>
    </Column>
  </Row>
  <Problems
    pages={[Promise.resolve(problems)]}
    on:clickProblem={(e) => goto(`${base}/manage/problems/${e.detail.id}`)}
  />
</Column>
