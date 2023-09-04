<script>
  import '../app.css';
  import '../default-styles.scss';

  import { Toaster } from 'svelte-french-toast';
  import FetchUser from '$lib/components/loaders/FetchUser.svelte';
  import Loading from '$lib/components/guards/AfterLoad.svelte';
  import CheckConnection from '$lib/components/loaders/CheckConnection.svelte';
  import EndOfLoading from '$lib/components/loaders/EndOfLoading.svelte';
  import Header from './Header.svelte';
</script>

<Toaster />

<CheckConnection>
  <FetchUser>
    <EndOfLoading />
  </FetchUser>
</CheckConnection>

<Loading>
  <div class="min-w-screen min-h-screen flex flex-col items-center">
    <div class="w-full flex justify-center border-b border-b-gray-200">
      <div class="w-full tablet:min-w-[800px] tablet:w-auto px-8">
        <Header />
      </div>
    </div>
    <div class={`w-full tablet:min-w-[800px] tablet:w-auto p-8`}>
      <slot />
    </div>
  </div>
</Loading>
