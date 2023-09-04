<script lang="ts">
  import { goto } from '$app/navigation';
  import { getConnection } from '$lib/api';
  import { reloadApp } from '$lib/app';
  import Box from '$lib/components/layouts/Box.svelte';
  import { resolveErrorMessage } from '$lib/error';
  import { loginToken } from '$lib/store';
  import api, { HttpError } from '@code-judge/api';
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

<Box>
  <div class="flex flex-col justify-center gap-y-4">
    <input bind:value={id} type="text" placeholder="ID" />
    <input bind:value={password} type="password" placeholder="Password" />
    <button on:click={login} type="button">Sign In</button>
  </div>
</Box>
