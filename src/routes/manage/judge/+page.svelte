<script lang="ts">
  import api from '@code-judge/api';
  import {
    Button,
    ButtonSet,
    Column,
    DataTable,
    TextArea,
  } from 'carbon-components-svelte';
  import { getConnection } from '../../../lib/api';
  import { filesize } from 'filesize';

  import Papa from 'papaparse';
  import moment from 'moment';
  import type { Language } from '../../../lib/language';

  let ids = '';

  let searchResult: Record<
    string,
    api.functional.submit.manage.manageList.Output['submits'][number]
  > = {};

  let notFound: string[] = [];

  let running = false;
  let complete = 0;
  let total = 0;

  async function search() {
    const filteredIds = ids
      .split(/\s+/)
      .map((id) => id.trim())
      .filter((id) => id.length > 0)
      .filter((id, index, self) => self.indexOf(id) === index);

    const result = await Promise.all(
      filteredIds.map((id) =>
        api.functional.submit.manage
          .manageList(getConnection(), {
            searchId: id,
            take: 2,
          })
          .then((result) => ({ searchId: id, ...result })),
      ),
    );

    for (const item of result) {
      if (item.count === 1) {
        searchResult = {
          ...searchResult,
          [item.searchId]: item.submits[0],
        };
      } else {
        notFound = [...notFound, item.searchId];
      }
    }
  }

  async function reset() {
    searchResult = {};
  }

  async function run(
    submit: api.functional.submit.manage.manageList.Output['submits'][number],
  ) {
    return api.functional.submit.manage.judge
      .manageJudge(getConnection(), {
        problemId: submit.problem.id,
        code: submit.code,
        language: submit.language,
        inputId: 'public',
      })
      .then(({ result }) => ({
        submitId: submit.id,
        type: result.type,
        result: result.type === 'COMPLETE' ? result.result.type : '',
        problemId: submit.problem.id,
        problemName: submit.problem.name,
        userId: submit.user.id,
        userName: submit.user.name,
        ...(result.type === 'COMPLETE' && result.result.type === 'SUCCESS'
          ? {
              time: `${result.result.time}ms`,
              memory: filesize(result.result.memory),
            }
          : {
              time: '',
              memory: '',
            }),
      }));
  }

  async function runAll() {
    running = true;
    total = Object.keys(searchResult).length;

    const result: Awaited<ReturnType<typeof run>>[] = [];
    for (const submit of Object.values(searchResult)) {
      result.push(await run(submit));
      complete += 1;
    }

    const csvString = Papa.unparse(result, { header: true });
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(csvString),
    );

    const filename = `judge-${moment(new Date()).format('YYMMDDHHmmss')}.csv`;
    element.setAttribute('download', filename);
    element.click();
    running = false;
  }
</script>

<Column>
  <h2 class="mb-4">Judge</h2>
  {#if Object.keys(searchResult).length === 0}
    <TextArea class="mb-2 h-[500px]" bind:value={ids} />
    <div class="text-xs">
      Enter submit id (or part of id) separated by whitespace
    </div>
    <ButtonSet class="justify-end">
      <Button on:click={search}>Search</Button>
    </ButtonSet>
  {:else if !running}
    <DataTable
      class="mb-4"
      headers={[
        {
          key: 'id',
          value: 'ID',
        },
        {
          key: 'username',
          value: 'Submitter Name',
        },
        {
          key: 'result',
          value: 'Result',
        },
        {
          key: 'time',
          value: 'Time',
        },
        {
          key: 'memory',
          value: 'Memory',
        },
      ]}
      rows={Object.values(searchResult).map((e) => ({
        id: e.id,
        username: e.user.name,
        result:
          e.status.type === 'COMPLETE' ? e.status.result.type : e.status.type,
        ...(e.status.type === 'COMPLETE' && e.status.result.type === 'SUCCESS'
          ? {
              time: `${e.status.result.time}ms`,
              memory: filesize(e.status.result.memory),
            }
          : {
              time: '',
              memory: '',
            }),
      }))}
    />
    {#if notFound.length > 0}
      <div>
        <div class="mb-1">Not found or multiple</div>

        {#each notFound as id}
          <div
            class="text-xs bg-red-500 text-white inline-block rounded-md p-1 mr-1 mb-1"
          >
            {id}
          </div>
        {/each}
      </div>
    {/if}
    <ButtonSet class="justify-end">
      <Button kind="primary" on:click={runAll}>Run all</Button>
      <Button kind="danger" on:click={reset}>Reset</Button>
    </ButtonSet>
  {:else}
    <div class="text-center text-xl">Running... ({complete}/{total})</div>
  {/if}
</Column>
