<script lang="ts">
  import api from '@code-judge/api';
  import {
    Column,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListHead,
    StructuredListRow,
  } from 'carbon-components-svelte';
  import { getConnection } from '../../../lib/api';
  import AdminOnly from '../../../lib/components/guards/AdminOnly.svelte';
  import SubmitTable from '../../submits/SubmitTable.svelte';

  const submits = api.functional.submit.manage
    .manageList(getConnection(), {})
    .then((response) =>
      response.submits.map((submit) => ({
        ...submit,
        createdAt: new Date(submit.createdAt),
      })),
    );
</script>

<AdminOnly>
  <Column>
    <h4>Submits</h4>
    {#await submits then submits}
      <SubmitTable manage {submits} />
    {/await}
  </Column>
</AdminOnly>
