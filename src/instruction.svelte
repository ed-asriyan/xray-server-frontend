<script lang="ts">
    interface Props {
        uuid: string;
    }

    let { uuid }: Props = $props();

    let subscriptionUrl = $derived(`https://${location.host}/${uuid}`);
    let hiddifyUrl = $derived(`hiddify://import/${subscriptionUrl}`);

    const onConnectClick = function(): void {
        window.location.href = hiddifyUrl;
    };
</script>

<h1 class="uk-margin-large-bottom">Итак, как подключить впн:</h1>
<div class="uk-child-width-1-3@m" uk-grid>
    <div>
        <h3>1. Скачай приложение <b>Hiddify</b>:</h3>
        <div>
            <a href="https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532" target="_blank">
                <img class="download-link" src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-example-preferred_2x.png"/>
            </a>
            <a href="https://play.google.com/store/apps/details?id=app.hiddify.com" target="_blank">
                <img class="download-link" src="https://play.google.com/intl/en_us/badges/static/images/badges/ru_badge_web_generic.png"/>
            </a>
            <a href="https://apps.microsoft.com/detail/9pdfnl3qv2s5" target="_blank">
                <img class="download-link" src="https://get.microsoft.com/images/en-us%20dark.svg" width="9999"/>
            </a>
            <span>
                <a class="download-link" href="https://hiddify.com#app" target="_blank">другие платформы</a>
            </span>
        </div>
    </div>
    <div>
        <h3>2. Выключи проксирование на <b>российские</b> ресурсы</h3>
        <p class="uk-text-italic uk-text-small uk-text-muted">...чтобы не включать и выключать впн каждый раз</p>
        <ol>
            <li>Открой <b>Hiddify</b></li>
            <li>Нажми на <b>Settings</b> (кнопка с шестерёнками) внизу экрана в Hiddify</li>
            <li>Пролистай до секции <b>Route Options</b> (3-я секция)</li>
            <li>Нажми на <b>Region</b> (первый в секции)</li>
            <li>Выбери <b>Russia (ru)</b></li>
            <li>Закрой <b>Hiddify</b></li>
        </ol>
    </div>
    <div>
        <h3>3. <b>Подключи ВПН</b></h3>
        <p>
            Нажми на кнопку <b>Подключить ВПН</b> внизу.<br/>
            Откроется приложение, должно выскочить зеленое уведомление, что ВПН добавлен.
        </p>
        <div class="uk-text-center">
            <button class="uk-button uk-button-primary uk-button-large" onclick={onConnectClick}><b>Подключить ВПН</b></button>
        </div>
        <p>
            Если кнопка не работает, скопируй текст ниже и вставь его в Hiddify:
        </p>
        <p class="uk-text-center">
            <code>{subscriptionUrl}</code>
        </p>
    </div>
</div>

<style lang="scss">
    .download-link {
        max-width: 10rem;
        cursor: pointer;
    }

    code {
        text-wrap: auto;
    }
</style>