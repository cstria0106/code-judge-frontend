<script lang="ts">
  import api from '@code-judge/api';
  import { getConnection } from '../../../lib/api';
  import { BarsRotateFade } from 'svelte-svg-spinners';

  const users = api.functional.user
    .manageList(getConnection(), {})
    .then((response) => response.users);
</script>

{#await users}
  <BarsRotateFade size={32} color="#333" />
{:then users}
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <tr>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>{user.role}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/await}

<style lang="scss" scoped>
  table {
    @apply w-full;
    th,
    td {
      @apply border border-gray-600 p-2;
    }
  }
</style>
