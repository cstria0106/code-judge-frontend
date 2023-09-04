<script lang="ts">
  import { languageNames } from '$lib/language';

  export let languages: readonly string[] = [];
  export let language: string = '';
</script>

<select class="px-4 py-1" bind:value={language}>
  {#each languages as language}
    <option value={language}>{languageNames[language]}</option>
  {/each}
</select>
