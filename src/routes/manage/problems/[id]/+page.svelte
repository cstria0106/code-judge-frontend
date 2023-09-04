<script lang="ts">
  import '$lib/styles/markdown.scss';
  import { page } from '$app/stores';
  import { getConnection } from '$lib/api';
  import Box from '$lib/components/layouts/Box.svelte';
  import api from '@code-judge/api';
  import { get } from 'svelte/store';
  import CodeMirror from 'svelte-codemirror-editor';
  import { markdown } from '@codemirror/lang-markdown';
  import { githubLight } from '@uiw/codemirror-theme-github';
  import _ from 'lodash';
  import BoxTitle from '$lib/components/BoxTitle.svelte';
  import Orientation from '$lib/components/layouts/Orientation.svelte';
  import { DateInput } from 'date-picker-svelte';
  import hljs from 'highlight.js';
  import { Marked } from 'marked';
  import { markedHighlight } from 'marked-highlight';
  import Fa from 'svelte-fa';
  import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
  import { Buffer } from 'buffer';
  import { filesize } from 'filesize';
  import CodeEditor from '$lib/components/CodeEditor.svelte';
  import { languageNames, type Language, languages } from '$lib/language';
  import LanguageSelector from '$lib/components/LanguageSelector.svelte';

  const id = get(page).params.id;

  const problem = api.functional.problem.manage
    .manageGet(getConnection(), id)
    .then((response) => response.problem);

  problem.then((problem) => {
    let cloned = _.cloneDeep(problem);
    originalProblem = cloned;
    cloned = _.cloneDeep(problem);
    editingProblem = {
      ...cloned,
      id: BigInt(cloned.id),
      startTime: cloned.startTime !== null ? new Date(cloned.startTime) : null,
      endTime: cloned.endTime !== null ? new Date(cloned.endTime) : null,
      description: cloned.description,
    };
  });

  type Problem = api.functional.problem.manage.manageGet.Output['problem'];
  let originalProblem: Problem;
  let editingProblem: {
    id: bigint;
    name: string;
    startTime: Date | null;
    endTime: Date | null;
    description: string;
    artifacts: Problem['artifacts'];
    templates: Problem['templates'];
  };

  const marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    }),
  );

  async function save() {
    await api.functional.problem.manage.manageUpdate(getConnection(), id, {
      name: editingProblem.name,
      description: editingProblem.description,
      startTime:
        editingProblem.startTime !== undefined &&
        editingProblem.startTime !== null
          ? editingProblem.startTime.toString()
          : editingProblem.startTime,
      endTime:
        editingProblem.endTime !== undefined && editingProblem.endTime !== null
          ? editingProblem.endTime.toString()
          : editingProblem.endTime,
      templates: editingProblem.templates,
      artifacts: {
        inputs: {
          public: editingProblem.artifacts.inputs.public,
          hidden: editingProblem.artifacts.inputs.hidden,
        },
      },
    });

    history.back();
  }

  async function destroy() {
    if (
      confirm(
        'Are you sure to destroy?\nYou can empty start time to hide this problem from students.',
      )
    ) {
      await api.functional.problem.manage.manageDestroy(
        getConnection(),
        editingProblem.id.toString(),
      );
      history.back();
    }
  }

  function downloadArtifact(type: 'public' | 'hidden') {
    downloadBase64(
      originalProblem.artifacts.inputs[type],
      `${originalProblem.name}-input-${type}.bin`,
    );
  }

  function downloadBase64(s: string, name: string) {
    const buffer = Buffer.from(s, 'base64');
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = name;
    link.click();
  }

  let fileInput: HTMLInputElement;

  async function openFiles(): Promise<File[]> {
    return new Promise((resolve, reject) => {
      const onChange = () => {
        fileInput.removeEventListener('change', onChange);
        fileInput.removeEventListener('cancel', onCancel);
        if (fileInput.files === undefined) return reject();
        if (fileInput.files === null) return reject();
        resolve([...fileInput.files]);
      };

      const onCancel = () => {
        fileInput.removeEventListener('change', onChange);
        fileInput.removeEventListener('cancel', onCancel);
        resolve([]);
      };
      fileInput.addEventListener('change', onChange);
      fileInput.addEventListener('cancel', onCancel);
      fileInput.click();
    });
  }

  async function uploadArtifact(type: 'public' | 'hidden') {
    const files = await openFiles();
    if (files.length === 0) return;

    const file = files[0];
    const base64 = new Buffer(await file.arrayBuffer()).toString('base64');

    editingProblem.artifacts.inputs[type] = base64;
  }

  function base64Size(s: string) {
    return filesize(Math.floor((s.length / 4) * 3));
  }

  function cancelUploadArtifact(type: 'public' | 'hidden') {
    editingProblem.artifacts.inputs[type] =
      originalProblem.artifacts.inputs[type];
  }

  let editingJudgeCodeLanguage: Language = 'C';
  let editingProblemCodeLanguage: Language = 'C';
</script>

<input type="file" bind:this={fileInput} hidden />

{#await problem then}
  <Orientation vertical>
    <Orientation horizontal>
      <Box class="w-[600px]">
        <LanguageSelector
          bind:language={editingJudgeCodeLanguage}
          {languages}
        />
        <CodeEditor
          title="Judge"
          language={editingJudgeCodeLanguage}
          bind:code={editingProblem.templates.judge[editingJudgeCodeLanguage]}
        />
      </Box>

      <Box class="w-[600px]">
        <LanguageSelector
          bind:language={editingProblemCodeLanguage}
          {languages}
        />
        <CodeEditor
          title="Solution template"
          language={editingProblemCodeLanguage}
          bind:code={editingProblem.templates.solution[
            editingProblemCodeLanguage
          ]}
        />
      </Box>
    </Orientation>
    <Orientation horizontal>
      <Box class="w-[600px] p-4 overflow-x-scroll whitespace-nowrap">
        <div class="markdown">
          {@html marked.parse(editingProblem.description)}
        </div>
      </Box>
      <Box class="w-[600px]">
        <BoxTitle>Edit {originalProblem.name}</BoxTitle>
        <div class="grid grid-cols-[auto_1fr] items-center gap-4">
          <label for="name">Name</label>
          <input id="name" type="text" bind:value={editingProblem.name} />
          <label for="start-time">Start time</label>
          <div class="no-default-button-style">
            <DateInput
              bind:value={editingProblem.startTime}
              placeholder="Draft"
            />
          </div>
          <label for="end-time">End time</label>
          <div class="no-default-button-style">
            <DateInput
              bind:value={editingProblem.endTime}
              placeholder="Permanent"
            />
          </div>
          <div class="label">Public input file</div>
          <div class="grid grid-cols-[auto_1fr] items-center gap-x-2">
            {#if editingProblem.artifacts.inputs.public === originalProblem.artifacts.inputs.public}
              <button on:click={() => uploadArtifact('public')}>Upload</button>
              <button on:click={() => downloadArtifact('public')}
                >Download ({base64Size(
                  originalProblem.artifacts.inputs.public,
                )})</button
              >
            {:else}
              <button
                class="col-span-2"
                on:click={() => cancelUploadArtifact('public')}
              >
                Cancel ({base64Size(editingProblem.artifacts.inputs.public)})
              </button>
            {/if}
          </div>
          <div class="label">Hidden input file</div>
          <div class="grid grid-cols-[auto_1fr] items-center gap-x-2">
            {#if editingProblem.artifacts.inputs.hidden === originalProblem.artifacts.inputs.hidden}
              <button on:click={() => uploadArtifact('hidden')}>Upload</button>
              <button on:click={() => downloadArtifact('hidden')}
                >Download ({base64Size(
                  originalProblem.artifacts.inputs.hidden,
                )})
              </button>
            {:else}
              <button
                class="col-span-2"
                on:click={() => cancelUploadArtifact('hidden')}
              >
                Cancel ({base64Size(editingProblem.artifacts.inputs.hidden)})
              </button>
            {/if}
          </div>
        </div>
        <BoxTitle>Description (Markdown)</BoxTitle>
        <div class="no-default-styles">
          <CodeMirror
            lang={markdown()}
            value={editingProblem.description}
            on:change={(e) => {
              editingProblem.description = e.detail;
            }}
            theme={githubLight}
            lineWrapping={true}
          />
        </div>
        <div class="flex flex-row mt-4 gap-x-2">
          <button on:click={save}>Save</button>
          <button class="w-auto bg-red-600" on:click={destroy}>
            <Fa icon={faTrashAlt} /> Destroy
          </button>
        </div>
      </Box>
    </Orientation>
  </Orientation>
{/await}

<style lang="scss" scoped>
  :root {
    --date-input-width: 100%;
  }
</style>
