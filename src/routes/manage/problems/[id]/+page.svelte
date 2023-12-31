<script lang="ts">
  import '$lib/styles/markdown.scss';
  import { page } from '$app/stores';
  import { getConnection } from '$lib/api';
  import pako from 'pako';
  import api from '@code-judge/api';
  import { get } from 'svelte/store';
  import CodeMirror from 'svelte-codemirror-editor';
  import { markdown } from '@codemirror/lang-markdown';
  import { githubLight } from '@uiw/codemirror-theme-github';
  import _ from 'lodash';
  import { DateInput } from 'date-picker-svelte';
  import hljs from 'highlight.js';
  import { Marked } from 'marked';
  import { markedHighlight } from 'marked-highlight';
  import { filesize } from 'filesize';
  import CodeEditor from '$lib/components/CodeEditor.svelte';
  import LanguageSelector from '$lib/components/LanguageSelector.svelte';
  import {
    Button,
    ButtonSet,
    Column,
    FileUploader,
    FileUploaderButton,
    FormLabel,
    InlineLoading,
    NumberInput,
    Row,
    TextInput,
  } from 'carbon-components-svelte';
  import Save from 'carbon-icons-svelte/lib/Save.svelte';
  import { loginToken } from '../../../../lib/store';
  import toast from 'svelte-french-toast';
  import { languages, type Language } from '$lib/language';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  const id = get(page).params.id;

  const problem = api.functional.problem.manage
    .manageGet(getConnection(), id)
    .then((response) => response.problem);

  problem.then((problem) => {
    let cloned = _.cloneDeep(problem);
    cloned = _.cloneDeep(problem);
    editingProblem = {
      ...cloned,
      id: BigInt(cloned.id),
      startTime: cloned.startTime !== null ? new Date(cloned.startTime) : null,
      endTime: cloned.endTime !== null ? new Date(cloned.endTime) : null,
      description: cloned.description,
      timeLimit: cloned.timeLimit,
      memoryLimit: cloned.memoryLimit / 1000,
    };
  });

  type Problem = api.functional.problem.manage.manageGet.Output['problem'];
  let editingProblem: {
    id: bigint;
    name: string;
    startTime: Date | null;
    endTime: Date | null;
    description: string;
    artifacts: Problem['artifacts'];
    templates: Problem['templates'];
    memoryLimit: number;
    timeLimit: number;
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
    const {
      name,
      description,
      startTime,
      endTime,
      templates,
      artifacts,
      memoryLimit,
      timeLimit,
    } = editingProblem;

    await api.functional.problem.manage.manageUpdate(getConnection(), id, {
      name,
      description,
      startTime:
        startTime !== undefined && startTime !== null
          ? startTime.toString()
          : startTime,
      endTime:
        endTime !== undefined && endTime !== null
          ? endTime.toString()
          : endTime,
      templates,
      artifacts: {
        inputs: {
          public:
            (artifacts.inputs.public?.length ?? 0) > 0
              ? artifacts.inputs.public
              : undefined,
          hidden:
            (artifacts.inputs.hidden?.length ?? 0) > 0
              ? artifacts.inputs.hidden
              : undefined,
        },
      },
      timeLimit,
      memoryLimit: memoryLimit * 1000,
    });

    toast.success('Successfully saved.');
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

  async function removeInput(type: 'public' | 'hidden') {
    if (
      confirm(
        'Are you sure to remove this input file? You can not revert this action.',
      )
    ) {
      editingProblem.artifacts.inputs[type] = undefined;
    }
  }

  async function uploadInput(type: 'public' | 'hidden', file: File) {
    // Upload file
    const { uploadUrl, id: fileId } = await api.functional.storage.create(
      getConnection(),
      {
        filename: file.name,
      },
    );

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: pako.gzip(await file.arrayBuffer()),
    });

    // Set file id
    if (response.status === 200) {
      editingProblem.artifacts.inputs[type] = fileId;
      toast.success('Successfully uploaded.');
    } else {
      toast.error('Failed to upload.');
    }
  }

  async function downloadInput(fileId: string): Promise<void> {
    const { downloadUrl, filename } = await api.functional.storage.get(
      getConnection(),
      fileId,
    );

    const buffer = await fetch(downloadUrl)
      .then((response) => response.arrayBuffer())
      .then((buffer) => pako.ungzip(buffer));
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([buffer]));
    link.download = filename;
    link.click();
    link.href = '';
  }

  let editingJudgeCodeLanguage: Language = 'C';
  let editingProblemCodeLanguage: Language = 'C';
</script>

<svelte:window
  on:beforeunload|preventDefault={(e) => {
    e.preventDefault();
    e.returnValue = true;
    return 'Are you sure to leave this page?';
  }}
/>

{#await problem}
  <InlineLoading />
{:then problem}
  <Column>
    <Row>
      <Column class="flex flex-col gap-y-4">
        <TextInput labelText="Name" bind:value={editingProblem.name} />
        <div>
          <FormLabel for="start-time">Start time</FormLabel>
          <DateInput
            bind:value={editingProblem.startTime}
            placeholder="Draft"
          />
        </div>
        <div>
          <FormLabel for="end-time">End time</FormLabel>
          <DateInput
            bind:value={editingProblem.endTime}
            placeholder="Permanent"
          />
        </div>
        <Row>
          <Column class="flex-grow-0">
            <NumberInput
              bind:value={editingProblem.timeLimit}
              hideSteppers
              label="Time Limit (milliseconds)"
            />
          </Column>
          <Column class="flex-grow-0">
            <NumberInput
              bind:value={editingProblem.memoryLimit}
              hideSteppers
              label="Memory Limit (kilobytes)"
            />
            <FormLabel class="mt-1">
              {filesize(editingProblem.memoryLimit * 1000)}
            </FormLabel>
          </Column>
        </Row>
        <Row class="mb-4">
          <Column class="flex-grow-0">
            <FormLabel for="public-input">Public Input</FormLabel>
            {#if editingProblem.artifacts.inputs.public === undefined}
              <FileUploader
                on:change={({ detail }) => {
                  uploadInput('public', detail[0]);
                }}
                buttonLabel="Upload"
              />
            {:else}
              <Button
                kind="danger"
                size="small"
                on:click={() => {
                  removeInput('public');
                }}
                class="w-full"
              >
                Remove
              </Button>

              <Button
                size="small"
                class="w-full"
                on:click={() => {
                  downloadInput(editingProblem.artifacts.inputs.public);
                }}
              >
                Download
              </Button>
            {/if}
          </Column>
          <Column class="flex-grow-0">
            <FormLabel for="hidden-input">Hidden Input</FormLabel>
            {#if editingProblem.artifacts.inputs.hidden === undefined}
              <FileUploader
                on:change={({ detail }) => {
                  uploadInput('hidden', detail[0]);
                }}
                buttonLabel="Upload"
              />
            {:else}
              <Button
                kind="danger"
                size="small"
                on:click={() => {
                  removeInput('hidden');
                }}
                class="w-full"
              >
                Remove
              </Button>
              <Button
                size="small"
                class="w-full"
                on:click={() => {
                  downloadInput(editingProblem.artifacts.inputs.hidden);
                }}
              >
                Download
              </Button>
            {/if}
          </Column>
        </Row>
      </Column>
    </Row>
    <Row class="mb-4">
      <Column>
        <LanguageSelector
          labelText="Select Judge Template Language"
          bind:language={editingJudgeCodeLanguage}
          {languages}
        />
        <CodeEditor
          title="Judge Template"
          language={editingJudgeCodeLanguage}
          bind:code={editingProblem.templates.judge[editingJudgeCodeLanguage]}
        />
      </Column>
      <Column>
        <LanguageSelector
          labelText="Select Solution Template Language"
          bind:language={editingProblemCodeLanguage}
          {languages}
        />
        <CodeEditor
          title="Solution Template"
          language={editingProblemCodeLanguage}
          bind:code={editingProblem.templates.solution[
            editingProblemCodeLanguage
          ]}
        />
      </Column>
    </Row>
    <Row class="mb-4">
      <Column>
        <FormLabel>Description</FormLabel>
        <Row>
          <Column>
            <CodeMirror
              lang={markdown()}
              value={editingProblem.description}
              on:change={(e) => {
                editingProblem.description = e.detail;
              }}
              theme={githubLight}
              lineWrapping={true}
            />
          </Column>

          <Column>
            <div
              class="markdown border border-gray-300 border-solid p-4 rounded-lg"
            >
              {@html marked.parse(editingProblem.description)}
            </div>
          </Column>
        </Row>
      </Column>
    </Row>
    <Row class="mt-[350px]">
      <Column>
        <ButtonSet class="justify-end">
          <Button
            kind="tertiary"
            on:click={() => {
              goto(`${base}/problems/${problem.id}`);
            }}>Go to problem</Button
          >
          <Button kind="danger" on:click={destroy} icon={TrashCan}
            >Destroy
          </Button>
          <Button kind="primary" on:click={save} icon={Save}>Save</Button>
        </ButtonSet>
      </Column>
    </Row>
  </Column>
{/await}

<style lang="scss" scoped>
  :root {
    --date-input-width: 100%;
  }
</style>
