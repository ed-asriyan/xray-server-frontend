<script lang="ts">
    import { useRouter } from '@dvcol/svelte-simple-router/router';
    import LogoEmoji from '../components/logo-emoji.svelte';
    import ChangePassword from './change-password.svelte';
    import { database } from '../stores/database';
    import { configurationStore } from '../stores/configuration';

    const router = useRouter();

    let showPasswordModal = $state(false);
</script>

<h1 class="uk-heading-large uk-text-center"><LogoEmoji/></h1>
<h1 class="uk-heading-small uk-text-center">Anywhere VPN</h1>
<div class="text-muted text-center uk-margin-bottom uk-text-center">Безопасный и анонимный ВПН</div>

<ChangePassword bind:show={showPasswordModal}/>

<div class="uk-grid-column-small uk-child-width-1-1@s uk-child-width-1-2@s" uk-grid>
  <div>
    <div class="uk-card uk-card-primary uk-card-hover uk-card-body uk-card-small cursor uk-text-left" onclick={() => router.push({ path: '/instruction' })}>
      <h5 class="uk-card-title">🚀&nbsp;&nbsp;Подключить ВПН</h5>
      <p>Доступно гигабайт: <b>∞</b></p>
    </div>
  </div>
  <div>
    <div class="uk-card uk-card-secondary uk-card-hover uk-card-body uk-card-small cursor uk-text-left" onclick={() => router.push({ path: '/children' })}>
      <h5 class="uk-card-title">👥&nbsp;&nbsp;Поделиться ВПНом</h5>
      <p>Вы <b>разблокировали</b> интернет <b>
        {#await $database.descendantsCount()}
          <div uk-spinner="ratio: 0.6"></div>
        {:then { count }} 
          {count}
        {:catch error}
          ??
        {/await}
      </b> людям</p>
    </div>
  </div>
  <div>
    <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-card-small cursor uk-text-left" onclick={() => router.push({ path: '/faq' })}>
      <h5 class="uk-card-title">❓&nbsp;&nbsp;FAQ</h5>
      <p>Ответы на вопросы</p>
    </div>
  </div>
  <div>
    <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-card-small cursor uk-text-left" onclick={() => window.open('https://t.me/AnywhereVPN', '_blank')}>
      <h5 class="uk-card-title">📣&nbsp;&nbsp;Телеграм канал</h5>
      <p>Следите за обновлениями</p>
    </div>
  </div>
  {#if !$configurationStore.hideChangePassword}
    <div>
      <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-card-small cursor uk-text-left" onclick={() => showPasswordModal = true}>
        <h5 class="uk-card-title">🔐&nbsp;&nbsp;Сменить пароль</h5>
        <p>Чтобы никто не украл Ваш ВПН</p>
      </div>
    </div>
  {/if}
  <div>
    <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-card-small cursor uk-text-left" onclick={() => router.push({ path: '/add-to-home-screen' })}>
      <h5 class="uk-card-title">💾&nbsp;&nbsp;Добавить на рабочий стол</h5>
      <p>Чтобы не потерять ВПН</p>
    </div>
  </div>
</div>

<div class="uk-text-center uk-margin-large-top uk-margin-bottom uk-text-small">
  User ID:<br/><b>{$configurationStore.uuid}</b>
</div>
