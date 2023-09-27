<script lang="ts">
  import { cpp } from '@codemirror/lang-cpp';
  import { java } from '@codemirror/lang-java';
  import CodeMirror from 'svelte-codemirror-editor';
  import type { Language } from '$lib/language';
  import { FormLabel } from 'carbon-components-svelte';

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

<FormLabel class="mt-2">{title}</FormLabel>
<div class="border border-solid border-gray-200 rounded-md">
  <CodeMirror
    lang={getCodeMirrorLanguage(language)}
    value={code}
    on:change={(e) => {
      code = e.detail;
    }}
    {readonly}
  />
</div>
