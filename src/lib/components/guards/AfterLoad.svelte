<script lang="ts">
  import { load } from '$lib/store';
  import Fa from 'svelte-fa';
  import { BarsRotateFade } from 'svelte-svg-spinners';
  import { get } from 'svelte/store';
  import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

  if (get(load).type === 'should_be_loaded') {
    load.set({ type: 'loading' });
  }
</script>

{#if $load.type === 'loading'}
  <div class="flex w-screen min-h-screen justify-center items-center">
    <BarsRotateFade size={32} color="#333" />
  </div>
{:else if $load.type === 'error'}
  <div
    class="flex flex-col w-screen min-h-screen justify-center items-center text-sm text-gray-400"
  >
    <Fa icon={faXmarkCircle} class="text-2xl mb-1" />
    {$load.reason}
  </div>
{:else if $load.type === 'loaded'}
  <slot />
{/if}
