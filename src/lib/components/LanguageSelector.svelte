<script lang="ts">
  import { languageNames } from '$lib/language';
  import { Row, Select, SelectItem } from 'carbon-components-svelte';

  export let languages: readonly string[] = [];
  export let language: string = '';

  export let labelText: string = '';
</script>

<Row>
  <Select {labelText} class="px-4 py-1" bind:selected={language}>
    {#each languages as language}
      <SelectItem value={language}>{languageNames[language]}</SelectItem>
    {/each}
  </Select>
</Row>
