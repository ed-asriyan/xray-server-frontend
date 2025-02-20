<script lang="ts">
  import { onMount } from 'svelte';
  import { Database } from './database';
  import type { Config } from './config';
  import Account from './account/index.svelte';

  interface Props {
      config: Config;
  }

  let { config }: Props = $props();

  interface Params {
    uuid: string;
    password: string;
    consent: boolean;
  }

  const parseHash = function(): Params {
    if (!parseHash.value) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      parseHash.value = {
        uuid: params.get('uuid') || window.location.hash.substring(1).split('?')[0],
        password: params.get('password') || '',
        consent: params.get('consent') === 'false' ? false : true,
      };
      // invalidate location so that users cannot share personal links
      window.history.pushState({}, '', '/#do-not-share-your-personal-link');
    }
    return parseHash.value;
  };

  const params = parseHash();

  let database: Database = $state(null);

  onMount(async () => {
    if (params.password) {
      try {
        database = await auth(params.password);
      } catch (e) {
      }
    }
    if (database) return;

    const savedPassword = localStorage.getItem('password');
    if (savedPassword) {
      try {
        database = await auth(savedPassword);
      } catch (e) {
      }
    }
    if (database) return;

    try {
      database = await auth(params.uuid);
    } catch (e) {
    }
    if (database) return;
  });

  let isLoading = $state(false);
  const auth = async function(password: string): Promise<Database> {
    isLoading = true;
    try {
      const result = await Database.connect(config, params.uuid, password);
      localStorage.setItem('password', password);
      return result;
    } finally {
      isLoading = false;
    }
  };

  let isPasswordInvalid: boolean = $state(false);

  const onSumbut = async function(e: Event) {
    const password = e.target.password.value;

    try {
      database = await auth(password);
    } catch (e) {
      isPasswordInvalid = true;
    }
  };
</script>

{#if database}
  <Account database={database} consent={params.consent}/>
{:else}
  <div class="uk-flex uk-flex-center uk-flex-middle" style="height: 100vh;">
    <form class="uk-form-stacked" on:submit|preventDefault={onSumbut}>
      <div class="uk-margin">
        <label class="uk-form-label" for="password">Пароль</label>
        <div class="uk-form-controls">
          <input class="uk-input" id="password" type="password" required disabled={isLoading} />
        </div>
      </div>
      <div class="uk-margin">
        <button class="uk-button uk-button-primary" type="submit" disabled={isLoading}>
          {#if isLoading}
            <div uk-spinner="ratio: 0.7" class="uk-margin-right"></div> 
            Думаю думалку...
          {:else}
            Войти
          {/if}
        </button>
      </div>
      {#if isPasswordInvalid}
        <div class="uk-margin uk-text-danger">
          Неверный пароль. Попробуйте еще раз.
        </div>
      {/if}
    </form>
  </div>
{/if}
