<script lang="ts">
  import { base } from '$app/paths';
  import { page, navigating } from '$app/stores';

  let path = $page.url.pathname;

  $: if ($navigating) {
    path = $page.url.pathname;
  }

  const menus = [
    {
      name: 'Problems',
      href: `${base}/home`,
    },
    {
      name: 'Submits',
      href: `${base}/submits`,
    },
  ];
</script>

<div class="w-full py-6 flex">
  <a class="flex-1" href="{base}/home">Algorithm</a>
  <div class="flex gap-x-4">
    {#each menus as menu}
      <a
        href={menu.href}
        class={path === menu.href ? 'text-blue-600' : undefined}
      >
        {menu.name}
      </a>
    {/each}
  </div>
</div>
