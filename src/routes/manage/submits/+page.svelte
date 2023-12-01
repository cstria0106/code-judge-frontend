<script lang="ts">
  import api, { HttpError } from '@code-judge/api';
  import { Column, PaginationNav } from 'carbon-components-svelte';
  import { getConnection } from '../../../lib/api';
  import AdminOnly from '../../../lib/components/guards/AdminOnly.svelte';
  import SubmitTable from '../../submits/SubmitTable.svelte';
  import { onMount } from 'svelte';
  import { debounce } from 'lodash';
  import toast from 'svelte-french-toast';
  import { resolveErrorMessage } from '../../../lib/error';

  type Submit = Omit<
    api.functional.submit.manage.manageList.Output['submits'][number],
    'createdAt'
  > & {
    createdAt: Date;
  };

  type Criteria = Pick<
    api.functional.submit.manage.manageList.Query,
    'problemId' | 'searchId' | 'statusResultType' | 'userId' | 'language'
  >;

  const criteria: Criteria = {};

  let submits: Submit[] = [];

  let count = 0;
  const take = 10;
  let page = 0;

  async function loadPage(page: number, criteria: Criteria) {
    try {
      const response = await api.functional.submit.manage
        .manageList(getConnection(), {
          skip: page * take,
          take,
          ...criteria,
        })
        .then((response) => ({
          submits: response.submits.map((submit) => ({
            ...submit,
            createdAt: new Date(submit.createdAt),
          })),
          count: response.count,
        }));

      count = response.count;
      submits = response.submits;
    } catch (e) {
      if (e instanceof HttpError) {
        if (e.status === 400) {
          toast.error(`Failed to get submits: ${resolveErrorMessage(e)}`);
        }
      }
    }
  }

  const loadPageDebounce = debounce(loadPage, 500);

  onMount(() => {
    loadPage(page, {});
  });

  function filterCriteria(criteria: Criteria): Criteria {
    return Object.fromEntries(
      Object.entries(criteria).filter(
        ([, value]) =>
          value !== undefined &&
          (typeof value !== 'string' || value.trim() !== ''),
      ),
    );
  }

  $: (() => {
    loadPageDebounce(page, filterCriteria(criteria));
  })();
</script>

<AdminOnly>
  <Column>
    <h4>Submits</h4>
    <div class="criteria">
      <label for="search-id">Submit ID</label>
      <input id="search-id" bind:value={criteria.searchId} />
      <label for="problem-id">Problem ID</label>
      <input id="problem-id" bind:value={criteria.problemId} />
      <label for="user-id">User ID</label>
      <input id="user-id" bind:value={criteria.userId} />
      <label for="language">Language</label>
      <select id="language" bind:value={criteria.language}>
        <option value={undefined}>All</option>
        <option value="C">C</option>
        <option value="CPP">C++</option>
        <option value="JAVA">Java</option>
      </select>
      <label for="type">Type</label>
      <select id="type" bind:value={criteria.statusResultType}>
        <option value={undefined}>All</option>
        <option value="FAILED">Failed</option>
        <option value="SUCCESS">Success</option>
        <option value="COMPILE_ERROR">Compile Error</option>
      </select>
    </div>
    <SubmitTable manage {submits} />
    <PaginationNav
      page={page + 1}
      total={Math.ceil(count / take)}
      on:change={(e) => {
        loadPage(e.detail.page - 1, filterCriteria(criteria));
      }}
    />
  </Column>
</AdminOnly>

<style lang="scss" scoped>
  .criteria {
    @apply mt-4 mb-6 flex flex-row items-center gap-x-4;
    input,
    select {
      @apply border border-solid border-gray-200 rounded-sm p-2;
    }
  }
</style>
