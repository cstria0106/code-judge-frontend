<script lang="ts">
  import { goto } from '$app/navigation';
  import BoxTitle from '$lib/components/BoxTitle.svelte';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
  import Box from '$lib/components/layouts/Box.svelte';
  import FetchUser from '$lib/components/loaders/FetchUser.svelte';
  import Fa from 'svelte-fa';
  import {
    faUser,
    faTriangleExclamation,
    faClipboardQuestion,
    faEdit,
    faRightFromBracket,
  } from '@fortawesome/free-solid-svg-icons';
  import { loginToken } from '$lib/store';
  import { reloadApp } from '$lib/app';
  import api from '@code-judge/api';
  import { getConnection } from '$lib/api';
  import Problems from '$lib/components/Problems.svelte';
  import Orientation from '$lib/components/layouts/Orientation.svelte';
  import { base } from '$app/paths';

  const problems = api.functional.problem
    .list(getConnection(), {})
    .then((response) => response.problems);

  function logout() {
    loginToken.set(null);
    reloadApp();
  }
</script>

<FetchUser force />

<UserOnly let:user>
  <!-- slot null check가 자동으로 안돼서 임시로 넣어야 함 -->
  {#if user !== null}
    <Orientation vertical>
      <Box class="text-sm">
        <BoxTitle>
          <Fa icon={faUser} /> User Information
        </BoxTitle>
        <div class="grid grid-cols-[1fr_auto] [&>.text]:text-right gap-y-2">
          <div>ID</div>
          <div class="text">{user.id}</div>
          <div>Name</div>
          <div class="text">{user.name}</div>
        </div>

        <button
          class="mt-4"
          on:click={() => {
            goto(`${base}/my/edit`);
          }}
        >
          <Fa icon={faEdit} />
          Edit
        </button>
        <button class="mt-2" on:click={logout}>
          <Fa icon={faRightFromBracket} />
          Sign Out
        </button>
      </Box>
      {#if user.shouldChangePassword}
        <Box>
          <BoxTitle>
            <Fa icon={faTriangleExclamation} /> Alert
          </BoxTitle>
          Please change your password before use!
        </Box>
      {:else}
        <Box>
          <BoxTitle>
            <Fa icon={faClipboardQuestion} /> Active Problems
          </BoxTitle>

          <div
            class="h-[400px] overflow-y-scroll border border-gray-300 p-4 rounded-md"
          >
            <Problems
              pages={[problems]}
              on:clickProblem={(e) => goto(`${base}/problems/${e.detail.id}`)}
            />
          </div>

          <a class="block text-right mt-2 text-blue-600" href="{base}/problems">
            See all past problems
          </a>
        </Box>
      {/if}

      {#if user.role === 'ADMIN'}
        <Box>
          <BoxTitle>Admin Panel</BoxTitle>
          <div class="flex flex-row flex-wrap gap-2">
            <span>
              <button
                type="button"
                on:click={() => goto(`${base}/manage/problems`)}
              >
                Manage problems</button
              >
            </span>
            <span>
              <button
                type="button"
                on:click={() => goto(`${base}/manage/users`)}
              >
                Manage users
              </button>
            </span>
            <span>
              <button
                type="button"
                on:click={() => goto(`${base}/manage/submits`)}
              >
                Manage submits
              </button>
            </span>
          </div>
        </Box>
      {/if}</Orientation
    >
  {/if}
</UserOnly>
