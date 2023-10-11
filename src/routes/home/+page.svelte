<script lang="ts">
  import { goto } from '$app/navigation';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
  import FetchUser from '$lib/components/loaders/FetchUser.svelte';
  import api from '@code-judge/api';
  import { getConnection } from '$lib/api';
  import Problems from '$lib/components/Problems.svelte';
  import { base } from '$app/paths';
  import {
    Button,
    ButtonSet,
    Column,
    ToastNotification,
  } from 'carbon-components-svelte';

  const problems = api.functional.problem
    .list(getConnection(), {})
    .then((response) => response.problems);
</script>

<FetchUser force />

<UserOnly let:user>
  <!-- slot null check가 자동으로 안돼서 임시로 넣어야 함 -->
  {#if user !== null}
    <Column>
      <ToastNotification
        fullWidth
        kind="warning"
        title="PS 관련 질문은 이루리 혹은 조교의 연락처로 질문 부탁드립니다."
        caption={new Date().toLocaleString()}
      />
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
