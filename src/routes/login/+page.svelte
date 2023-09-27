<script lang="ts">
  import { getConnection } from '$lib/api';
  import { reloadApp } from '$lib/app';
  import { resolveErrorMessage } from '$lib/error';
  import { loginToken } from '$lib/store';
  import api, { HttpError } from '@code-judge/api';
  import {
    Button,
    Column,
    Form,
    PasswordInput,
    TextInput,
  } from 'carbon-components-svelte';
  import toast from 'svelte-french-toast';

  let id: string = '';
  let password: string = '';

  async function login() {
    try {
      // Login
      const result = await api.functional.auth.login(getConnection(true), {
        id,
        password,
      });

      // And store token
      loginToken.set(result.token);

      reloadApp();
    } catch (e) {
      if (e instanceof HttpError) {
        if (e.status === 400) {
          toast.error(`Failed to login: ${resolveErrorMessage(e)}`);
        }
      }
    }
  }
</script>

<Column>
  <Form class="flex flex-col gap-y-4">
    <TextInput labelText="ID" bind:value={id} />
    <PasswordInput labelText="Password" bind:value={password} />
    <div class="flex flex-col items-end">
      <Button class="flex" on:click={login}>Login</Button>
    </div>
  </Form>
</Column>
