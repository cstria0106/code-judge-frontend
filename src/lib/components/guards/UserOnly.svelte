<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { currentUser } from '$lib/store';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  export let afterOk: (() => void) | null = null;

  onMount(() => {
    const user = get(currentUser);
    if (user === null) goto(`${base}/login`);

    afterOk?.();
  });
</script>

{#if $currentUser !== null}
  <slot user={$currentUser} />
{/if}
