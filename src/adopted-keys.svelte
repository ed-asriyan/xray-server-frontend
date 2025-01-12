<script lang="ts">
    import * as UIkit from 'uikit';
    import { Config, Database } from './database';

    interface Props {
        database: Database;
    }

    let { database }: Props = $props();

    const responseMap: {[x: number]: string } = {
        0: 'Новый ВПН создан. Найди его в списке ниже на последней строчке и поделись с человеком',
        1: 'Внутренняя ошибка сервера. Попробуйте позже.',
        2: 'Закончились свободные ключи. Попробуйте через несколько дней.',
        3: 'Вы достигли лимита.',
    };

    let loading: boolean = $state(false);
    const adoptClick = async function(database: Database): Promise<void> {
        try {
            loading = true;
            const name = prompt('Введите имя для нового ВПН (имя будет видно только вам):');
            if (name) {
                const code = await database.adopt(name);
                const message = responseMap[code];
                if (message) {
                    alert(message);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
            refresh();
        }

    };

    let key = $state(0);
    const refresh = function(): void {
        ++key;
    };

    const copyToClipboard = function (text: string): void {
        const input = document.createElement('input');
        input.setAttribute('value', text);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        UIkit.notification('Ссылка скопирована', { status: 'success' });
    };

    const canShare: boolean = Boolean(navigator.share);
    const linkClick = function (url: string): void {
        if (canShare) {
            navigator.share({
                title: 'ВПН',
                url,
            });
        } else {
            copyToClipboard(url);
        }
    };

    const generateShareLink = function (uuid: string): string {
        return `https://${location.host}#${uuid}`;
    };

    const rename = async function (database: Database, config: Config): Promise<void> {
        try {
            const newName = prompt('Введите новое имя:', config.name);
            if (newName) {
                await database.renameConfig(config.childUuid, newName);
                UIkit.notification('Имя изменено', { status: 'success' });
            }
        } catch (e) {
            console.error(e);
            alert('Ошибка');
        } finally {
            refresh();
        }
    };
</script>

<h2>👥 Сгенерировать ВПН для друзей и знакомых</h2>
<p>Ты можешь ты можешь поделиться ВПНом с друзьями. Для этого</p>
<ol>
    <li>
        <b>Нажми</b> на кнопку:&nbsp;
        <span>
            {#if loading}
                <span uk-spinner></span>
            {:else}
                <button class="uk-widt1 uk-button uk-button-small uk-button-primary" onclick={() => adoptClick(database)}>🔄 Сгенерировать 1 новый ключ</button>
            {/if}
        </span>
        </li>
    <li><b>Скопируй</b> cамую последнюю ссылку из списка</li>
    <li><b>Поделись</b> ею с только с одним человеком через личные сообщения</li>
</ol>
<p>Правила:</p>
<ul>
    <li>Если одним ВПНом будут пользоваться несколько людей, он будет <b>заблокирован</b></li>
    <li>Если ВПНом не будут пользоваться более одного <b>месяца</b>, он может быть <b>отключён</b></li>
</ul>
<hr/>
{#key key}
    {#await database.fetchChildren()}
        <div uk-spinner></div>
    {:then { children, count }} 
        <p class="uk-text-center uk-text-bold">
            {#if children.length > 0}
                Всего ты сгенерировал(а) {count} ВПН
            {:else}
                Ты ещё не сгенерировал(а) ни одного ВПН
            {/if}
            </p>
        {#if children.length > 0}
            <div style="overflow-x: auto;">
                <table class="uk-table uk-table-small uk-table-divider">
                    <thead>
                        <tr>
                            <th>#</th>
                            <!-- <th class="uk-width-small"></th> -->
                            <th>Имя</th>
                            <th>Последний раз использовался</th>
                            <th>Дата пригашения</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each children.sort((a, b) => +a.createdAt - +b.createdAt) as child, i}
                            <tr>
                                <th>{i + 1}</th>
                                <td>
                                    <button class="uk-button uk-button-default uk-button-small uk-text-truncate" uk-tooltip="Переименовать" onclick={() => rename(database, child)}>✍🏻 Переименовать</button>

                                    &nbsp;
                                    <button class="uk-button uk-button-default uk-button-small uk-text-truncate" uk-tooltip="Скопировать" onclick={() => linkClick(generateShareLink(child.childUuid))}>📄 Поделиться ссылкой</button>
                                <!-- </td>
                                <td> -->
                                    <br class="uk-hidden@s"/>
                                    &nbsp;
                                    <span class="uk-text-truncate">{child.name || child.childUuid}</span>
                                </td>
                                <td>{child.lastUsedAt ? child.lastUsedAt.toLocaleString() : 'Никогда'}</td>
                                <td>{child.createdAt.toLocaleString()}</td>
                            </tr>
                        {/each}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        {/if}
    {:catch e}
        <div>Ошибка :(</div>
        <button class="uk-button uk-button-primary" onclick={refresh}>Обновить</button>
    {/await}
{/key}

<style lang="scss">
    table {
        // width: 100vw !important;
        max-width: 100vw;
        overflow-x: scroll;

    }
</style>