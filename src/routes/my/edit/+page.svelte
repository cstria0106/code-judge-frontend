<script>
  import { getConnection } from '$lib/api';
  import UserOnly from '$lib/components/guards/UserOnly.svelte';
  import { resolveErrorMessage } from '$lib/error';
  import api, { HttpError } from '@code-judge/api';
  import {
    Button,
    Form,
    PasswordInput,
    TextInput,
  } from 'carbon-components-svelte';
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
    <Form class="flex flex-col gap-y-4">
      <TextInput labelText="ID" value={user.id} readonly />
      <TextInput labelText="Name" value={user.name} readonly />
      <PasswordInput
        labelText="New password"
        helperText="Password must be at least 8 characters long"
        bind:value={newPassword}
      />
      <PasswordInput
        labelText="New password (again)"
        bind:value={newPasswordAgain}
      />
      <Button on:click={save}>Save</Button>
    </Form>
  {/if}
</UserOnly>
