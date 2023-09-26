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
  import {
    Button,
    ButtonSet,
    Column,
    FileUploader,
    FormLabel,
    InlineLoading,
    Loading,
    Row,
    TextInput,
  } from 'carbon-components-svelte';
  import { Save, TrashCan } from 'carbon-icons-svelte';

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
          public:
            (editingProblem.artifacts.inputs.public?.length ?? 0) > 0
              ? editingProblem.artifacts.inputs.public
              : null,
          hidden:
            (editingProblem.artifacts.inputs.hidden?.length ?? 0) > 0
              ? editingProblem.artifacts.inputs.hidden
              : null,
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

  function downloadInput(type: 'public' | 'hidden') {
    // downloadBase64(
    //   originalProblem.artifacts.inputs[type],
    //   `${originalProblem.name}-input-${type}.bin`,
    // );
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
    const connection = getConnection();

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${connection.host}/storage`, {
      headers: connection.headers,
      method: 'POST',
      body: formData,
    });

    if (response.status === 201) {
      const body = (await response.json()) as { id: string };
      editingProblem.artifacts.inputs[type] = body.id;
    }
  }

  function cancelUploadArtifact(type: 'public' | 'hidden') {
    editingProblem.artifacts.inputs[type] =
      originalProblem.artifacts.inputs[type];
  }

  let editingJudgeCodeLanguage: Language = 'C';
  let editingProblemCodeLanguage: Language = 'C';
</script>

<input type="file" bind:this={fileInput} hidden />

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
            <FormLabel for="public-input">Public Input</FormLabel>
            <FileUploader on:change={({ detail }) => {}} buttonLabel="Upload"
              >Upload</FileUploader
            >
          </Column>
          <Column class="flex-grow-0">
            <FormLabel for="hidden-input">Hidden Input</FormLabel>
            <FileUploader on:change={({ detail }) => {}} buttonLabel="Upload" />
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
    <Row>
      <Column>
        <ButtonSet class="justify-end">
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
