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
  import {
    Button,
    ButtonSet,
    Column,
    Row,
    ToastNotification,
  } from 'carbon-components-svelte';
  import { WarningAltFilled } from 'carbon-icons-svelte';

  const problems = api.functional.problem
    .list(getConnection(), {})
    .then((response) => response.problems);
</script>

<FetchUser force />

<UserOnly let:user>
  <!-- slot null check가 자동으로 안돼서 임시로 넣어야 함 -->
  {#if user !== null}
    <Column>
      {#if user.shouldChangePassword}
        <ToastNotification
          fullWidth
          kind="error"
          title="Please change your password before use!"
          caption={new Date().toLocaleString()}
        />
      {:else}
        <h4 class="mb-4">Problems</h4>
        <Problems
          pages={[problems]}
          on:clickProblem={(e) => goto(`${base}/problems/${e.detail.id}`)}
        />

        <a class="block text-right mb-4" href="{base}/problems">
          See all past problems
        </a>

        {#if user.role === 'ADMIN'}
          <h4 class="mb-4">Manage</h4>
          <ButtonSet>
            <Button href={`${base}/manage/problems`}>Problems</Button>
            <Button href={`${base}/manage/users`}>Users</Button>
            <Button href={`${base}/manage/submits`}>Submits</Button>
          </ButtonSet>
        {/if}
      {/if}
    </Column>
  {/if}
</UserOnly>
