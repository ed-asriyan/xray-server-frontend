<script lang="ts">
    import * as UIkit from 'uikit';
    import type { User, Database } from '../database';

    interface Props {
        user: User | null;
        database: Database;
    }

    let { user = $bindable(), database }: Props = $props();

    let isLoading = $state(false);

    let modal = $state(null);

    $effect(() => {
        if (user) {
            UIkit.modal(modal).show();
        } else {
            UIkit.modal(modal).hide();
        }
    });

    const copyToClipboard = function (text: string): void {
        navigator.clipboard.writeText(text).then(() => {
            UIkit.notification('Ссылка скопирована в буфер обмена', { status: 'success' });
        }).catch(err => {
            UIkit.notification('Ошибка. Скопируй вручную', { status: 'danger' });
        });
    };

    const generateShareLink = function (): string {
        return `https://${location.host}#${user?.childUuid}`;
    };

    const canShare: boolean = Boolean(navigator.share);
    const linkClick = function (): void {
        const url = generateShareLink();
        if (canShare) {
            navigator.share({
                title: 'ВПН',
                url,
            });
        } else {
            copyToClipboard(url);
        }
    };

    const rename = async function (): Promise<void> {
        if (!user) return;

        try {
            const newName = prompt('Введите новое имя:', user.name);
            if (newName) {
                await database.renameConfig(user.childUuid, newName);
                UIkit.notification('Имя изменено', { status: 'success' });
                user = { ...user, name: newName };
            }
        } catch (e) {
            console.error(e);
            alert('Ошибка');
        }
    };
</script>

<div bind:this={modal} uk-modal>
    {#if user}
        <div class="uk-modal-dialog uk-modal-body">
            <h2 class="uk-modal-title">
                Пользователь: <b>{ user.name }</b>
                <button class="uk-button uk-button-default" onclick={rename}>✍🏻 Переименовать</button>
            </h2>
            <p class="uk-text-small uk-text-muted">Дата приглашения: { user.createdAt.toLocaleString() }</p>
            {#if isLoading}
                <div uk-spinner></div>
            {:else}
                <p>Поделись ссылкой с пользователем. Когда он перейдёт по ней, он получит персональный ВПН и инструкцию по установке</p>
                <div class="uk-text-center uk-margin-bottom">
                    <code onclick={() => copyToClipboard(generateShareLink())} class="uk-margin-bottom uk-link" uk-tooltip="Скопировать">{ generateShareLink() }</code>
                    <button class="uk-button uk-button-primary uk-button-smasll uk-text-truncate uk-margin-top" onclick={() => linkClick()}>👉 &nbsp Поделиться ссылкой &nbsp 👈</button>
                </div>
                <div>
                    <p>Правила:</p>
                    <ul>
                        <li>Если одним ВПНом будут пользоваться несколько людей, он будет <b>заблокирован</b></li>
                        <li>Если ВПНом не будут пользоваться более одного <b>месяца</b>, он может быть <b>отключён</b></li>
                    </ul>
                </div>
                <button class="uk-button uk-button-default" onclick={() => user = null}>Закрыть</button>
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    code {
        text-wrap: auto;
    }
</style>
