<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
</script>

<UserOnly
  afterOk={() => {
    goto(`${base}/home`);
  }}
/>
