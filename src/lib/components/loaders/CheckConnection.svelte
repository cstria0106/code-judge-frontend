<script lang="ts">
  import { getConnection } from '$lib/api';
  import { load } from '$lib/store';
  import api from '@code-judge/api';
  import { onMount } from 'svelte';

  let loaded = false;

  onMount(async () => {
    try {
      await api.functional.ping(getConnection(true));
      loaded = true;
    } catch (e) {
      load.set({ type: 'error', reason: 'Failed to connect to server' });
    }
  });
</script>

{#if loaded}
  <slot />
{/if}
