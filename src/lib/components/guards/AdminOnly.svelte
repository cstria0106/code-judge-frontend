<script lang="ts">
  import { currentUser } from '$lib/store';
</script>

{#if $currentUser !== null && $currentUser.role === 'ADMIN'}
  <slot user={$currentUser} />
{/if}
