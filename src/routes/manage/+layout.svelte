<script>
  import AdminOnly from '$lib/components/guards/AdminOnly.svelte';
</script>

<AdminOnly>
  <slot />
</AdminOnly>
