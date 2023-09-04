<script>
  import { getConnection } from '$lib/api';
  import BoxTitle from '$lib/components/BoxTitle.svelte';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
  import Box from '$lib/components/layouts/Box.svelte';
  import { resolveErrorMessage } from '$lib/error';
  import api, { HttpError } from '@code-judge/api';
  import toast from 'svelte-french-toast';

  let newPassword = '';
  let newPasswordAgain = '';

  function validate() {
    if (newPassword !== newPasswordAgain) {
      toast.error('New password does not match');
      return false;
    }

    return true;
  }

  async function save() {
    const ok = validate();
    if (!ok) return;

    try {
      await api.functional.user.my.updateMyUser(getConnection(), {
        password: newPassword.length > 0 ? newPassword : undefined,
      });

      history.back();
      toast.success('Successfully updated user information');
    } catch (e) {
      if (e instanceof HttpError) {
        toast.error(`Failed to update: ${resolveErrorMessage(e)}`);
      }
    }
  }
</script>

<UserOnly let:user>
  {#if user}
    <Box>
      <BoxTitle>Edit User Information</BoxTitle>
      <div
        class="w-full grid grid-cols-[auto_1fr] items-center gap-4 [&>div]:text-sm"
      >
        <div>ID</div>
        <input type="text" value={user.id} disabled />
        <div>Name</div>
        <input type="text" value={user.name} disabled />
        <div>New password</div>
        <input type="password" bind:value={newPassword} />
        <div>New password (again)</div>
        <input type="password" bind:value={newPasswordAgain} />
        <button class="col-span-2" on:click={save}> Save </button>
      </div>
    </Box>
  {/if}
</UserOnly>
