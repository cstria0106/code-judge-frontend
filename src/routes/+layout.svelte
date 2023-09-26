<script>
  import '../app.css';
  // import '../default-styles.scss';
  import 'carbon-components-svelte/css/white.css';

  import { Toaster } from 'svelte-french-toast';
  import FetchUser from '$lib/components/loaders/FetchUser.svelte';
  import Loading from '$lib/components/guards/AfterLoad.svelte';
  import CheckConnection from '$lib/components/loaders/CheckConnection.svelte';
  import EndOfLoading from '$lib/components/loaders/EndOfLoading.svelte';
  import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
  import {
    Content,
    Grid,
    Header,
    HeaderAction,
    HeaderActionLink,
    HeaderNav,
    HeaderNavItem,
    HeaderPanelLink,
    HeaderPanelLinks,
    HeaderUtilities,
    SideNav,
    SideNavItems,
    SideNavLink,
  } from 'carbon-components-svelte';
  import { loginToken } from '$lib/store';
  import { reloadApp } from '$lib/app';
  import { base } from '$app/paths';
  import { Code } from 'carbon-icons-svelte';

  let userMenuOpened = false;
  let sideNavOpened = false;

  function logout() {
    loginToken.set(null);
    reloadApp();
  }
</script>

<Toaster />

<CheckConnection>
  <FetchUser>
    <EndOfLoading />
  </FetchUser>
</CheckConnection>

<Loading>
  <Header href="/" bind:isSideNavOpen={sideNavOpened}>
    <span slot="company"><Code /> Algorithm</span>

    <HeaderUtilities>
      <HeaderAction bind:isOpen={userMenuOpened} icon={UserAvatarFilledAlt}>
        <HeaderPanelLinks>
          <HeaderPanelLink
            href={`${base}/my/edit`}
            on:click={() => {
              userMenuOpened = false;
            }}>Edit</HeaderPanelLink
          >
          <HeaderPanelLink on:click={logout}>Logout</HeaderPanelLink>
        </HeaderPanelLinks>
      </HeaderAction>
    </HeaderUtilities>
  </Header>
  <SideNav bind:isOpen={sideNavOpened}>
    <SideNavItems>
      <SideNavLink text="Problems" href={`${base}/`} />
      <SideNavLink text="Submits" href={`${base}/submits`} />
    </SideNavItems>
  </SideNav>
  <Content>
    <Grid fullWidth>
      <slot />
    </Grid>
  </Content>
</Loading>
