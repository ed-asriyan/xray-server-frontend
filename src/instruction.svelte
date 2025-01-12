<script lang="ts">
    import type { Config } from './database';

    interface Props {
        config: Config
    }

    let { config }: Props = $props();

    const onConnectClick = function(): void {
        window.location.href = config.hiddifyOpenUrl;
    };
</script>

<h1 class="uk-margin-large-bottom">Итак, как подключить впн:</h1>
<div class="uk-child-width-1-3@m" uk-grid>
    <div>
        <h3>Шаг 1: скачай Приложение <b>Hiddify</b>:</h3>
        <p>Как скачаешь и установишь, переходи к <b>Шагу 2</b></p>
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
        <h3>Шаг 2: выключи проксирование на <b>российские</b> ресурсы</h3>
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
        <h3>Шаг 3: <b>подключи ВПН</b></h3>
        <p>
            Нажми на кнопку <b>Подключить ВПН</b> внизу.<br/>
            Откроется приложение, должно выскочить зеленое уведомление, что ВПН добавлен.
        </p>
        <div class="uk-text-center">
            <button class="uk-button uk-button-secondary uk-button-large" onclick={onConnectClick}><b>Подключить ВПН</b></button>
        </div>
        <p>
            После этого нажми на большую кнопку <b>Connect</b> в середине экрана.
        </p>
        <p>
            Если кнопка не работает, скопируй текст ниже и вставь его в Hiddify:
        </p>
        <p class="uk-text-center">
            <code>{config.hiddifySubscriptionUrl}</code>
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