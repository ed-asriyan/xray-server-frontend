<script lang="ts">
  import Faq from './faq.svelte';
  import Instruction from './instruction/index.svelte';
  import AdoptedKeys from './children/index.svelte';
  import Consent from './consent.svelte';
  import ChangePassword from './change-password.svelte';
  import { Database } from '../database';

  interface Props {
    database: Database;
    consent: boolean;
  }

  let { database, consent }: Props = $props();

  let shareVpnElement: HTMLElement = $state(null);
</script>

{#if consent}
  <Consent />
{/if}
<div class="uk-section uk-section-muted uk-padding-remove-top">
  <div class="uk-container uk-container-xsmall uk-margin-top">
    <ChangePassword database={database}/>
    {#await database.fetchConfig()}
      <br/>
      <div uk-spinner></div>
    {:then config} 
      <Instruction config={config} shareVpnElement={shareVpnElement}/>
    {/await}
  </div>
</div>

<div class="uk-section uk-section-secondary" bind:this={shareVpnElement}>
  <div class="uk-container uk-container-xsmall">
    <AdoptedKeys database={database}/>
  </div>
</div>

<div class="uk-section uk-section-muted">
  <div class="uk-container">
    <Faq/>
  </div>
</div>
