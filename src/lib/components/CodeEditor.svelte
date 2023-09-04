<script lang="ts">
  import { cpp } from '@codemirror/lang-cpp';
  import { java } from '@codemirror/lang-java';
  import BoxTitle from './BoxTitle.svelte';
  import CodeMirror from 'svelte-codemirror-editor';
  import type { Language } from '$lib/language';

  export let code: string | undefined;

  export let title: string = '';
  export let language: Language = 'C';

  function getCodeMirrorLanguage(id: Language) {
    switch (id) {
      case 'C':
      case 'CPP':
        return cpp();
      case 'JAVA':
        return java();
      default:
        throw new Error();
    }
  }

  export let readonly: boolean = false;
</script>

<BoxTitle>{title}</BoxTitle>
<div class="flex flex-row gap-x-4" />
<div class="no-default-styles">
  <CodeMirror
    lang={getCodeMirrorLanguage(language)}
    value={code}
    on:change={(e) => {
      code = e.detail;
    }}
    {readonly}
  />
</div>
