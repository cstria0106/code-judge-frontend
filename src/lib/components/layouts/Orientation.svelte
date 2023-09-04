<script lang="ts">
  export let horizontal: boolean = false;
  export let vertical: boolean = true;
</script>

<div
  class={`flex gap-4 ${
    horizontal ? 'flex-row h-full' : vertical ? 'flex-col w-full' : ''
  }`}
>
  <slot />
</div>
