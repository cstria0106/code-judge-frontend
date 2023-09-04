<script lang="ts">
  import { getConnection } from '$lib/api';
  import { currentUser, loginToken } from '$lib/store';
  import api from '@code-judge/api';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  export let force: boolean = false;
  let loaded: boolean = false;

  onMount(async () => {
    const user = get(currentUser);
    const token = get(loginToken);
    // If already logged in and user is checked
    if (force === false && user !== null) {
      loaded = true;
      return;
    }

    // If not logged in
    if (token === null) {
      loaded = true;
      return;
    }

    // If logged in but user is not fetched(checked)
    try {
      const user = await api.functional.user.my.getMyUser(getConnection());
      currentUser.set({
        id: user.id,
        name: user.name,
        shouldChangePassword: user.shouldChangePassword,
        role: user.role,
      });
    } catch (e) {}
    loaded = true;
  });
</script>

{#if loaded}
  <slot />
{/if}
