<template>
    <Window :flexContent="true"
            @close="close"
            background="gray"
            iconClass="icon-email"
            title="Email Pro">
        <div class="container container--large">
            <div class="menu">
                <button :class="getMenuItemClass(item)"
                        :value="item.value"
                        @click="view = item.value"
                        v-for="item in menuItems">
                    {{ item.text }}
                </button>
            </div>
            <div class="emailViewer" v-if="view === 'readEmail'">
                <div class="emailViewer-menu">
                    <div @click="view = 'inbox'" class="emailViewer-backIcon"><</div>
                    <div class="emailViewer-title">
                        {{emailOpen.from}}:
                        <strong>{{emailOpen.subject}}</strong>
                    </div>
                </div>
                <div class="emailViewer-body">
                    {{ emailOpen.body }}
                </div>
            </div>
            <div v-else class="viewer">
                <div v-for="viewItem in views" v-if="viewItem.key === view" :class="viewItem.key">
                    <div @click="readEmail(email)" class="email" v-for="email in emails">
                        <i class="email-read" v-if="email.read"/>
                        <i class="email-unread" v-else/>
                        <span class="email-subject">{{ email.subject }}</span>
                        <span class="email-from">– {{ email.from }}</span>
                    </div>
                </div>
            </div>
        </div>
    </Window>
</template>
<script>
    const Window = require('./Window.vue').default;
    const Vuex = require('vuex');
    const {
        mapState: mapEmailState,
        mapGetters: mapEmailGetters,
        mapMutations: mapEmailMutations,
        mapActions: mapEmailActions
    } = Vuex.createNamespacedHelpers('email');

    module.exports = {
        data() {
            return {
                view: 'inbox',
                emailOpen: null
            };
        },
        computed: {
            ...mapEmailState([
                'deletedItems',
                'inbox',
                'outbox',
                'sentItems'
            ]),
            menuItems() {
                return [
                    { text: 'Deleted Items', value: 'deletedItems' },
                    { text: 'Inbox', value: 'inbox' },
                    { text: 'Outbox', value: 'outbox' },
                    { text: 'Sent items', value: 'sentItems' },
                ]
            },
            views() {
                return [
                    { key: 'deletedItems', emails: this.deletedItems.emails },
                    { key: 'inbox', emails: this.inbox.emails },
                    { key: 'outbox', emails: this.outbox.emails },
                    { key: 'sentItems', emails: this.sentItems.emails },
                ]
            },
            emails() {
                return this.views
                    .find(v => v.key === this.view)
                    .emails
                    .slice()
                    .map(email => {
                        return {
                            ...email,
                            read: this.getIsEmailRead(email)
                        };
                    })
                //Sort unread at the top
                // .sort((a, b) => {
                //     return (a.read ? 1 : 0) - (b.read ? 1 : 0);
                // });
            }
        },
        methods: {
            close() {
                this.$emit('close');
            },
            readEmail(email) {
                this.emailOpen = email;
                this.view = 'readEmail';

                if (!this.getIsEmailRead(email)) {
                    let item = localStorage.getItem('readEmails')
                    if (!item) item = '[]';

                    let readEmails = JSON.parse(item);
                    readEmails.push(`${email.subject}:${email.from}`);
                    localStorage.setItem('readEmails', JSON.stringify(readEmails));
                }
            },
            getIsEmailRead(email) {
                let item = localStorage.getItem('readEmails')
                if (!item) item = '[]';

                let readEmails = JSON.parse(item);
                return readEmails.includes(`${email.subject}:${email.from}`);
            },
            getMenuItemClass(item) {
                if (this.view === item.value) return ['selected'];
                return [];
            }
        },
        components: {
            Window
        }
    }
</script>
<style lang="scss" scoped>
    .container {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
    }

    .menu {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid gray;
        height: 24px;
        box-sizing: border-box;
        border-bottom: 1px solid gray;
        flex: 0 0 auto;
    }

    .menu button {
        border: 0;
        background: transparent;
        height: 21px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        justify-content: center;
        font-size: 11px;

        &.selected {
            font-weight: bold;
            background-color: #000080;
            color: white;
        }

        &:focus, &:hover, &:active {
            background-color: #000080;
            color: white;
        }
    }

    .viewer {
        flex: 1 1 auto;
        display: flex;
        overflow-y: auto;
        align-items: stretch;
        background: white;
    }

    .emailViewer, .inbox {
        font-family: "MS Sans Serif", serif;
        background: white;
        flex: 1 0 auto;
        padding-top: 5px;
    }

    .emailViewer-menu {
        display: flex;
        flex-direction: row;
    }

    .emailViewer-title {
        font-size: 16px;
    }

    .emailViewer-backIcon {
        font-size: 14px;
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-right: 5px;
        margin-left: 10px;
        font-weight: bold;
        font-family: consolas, serif;
    }

    .emailViewer-body {
        padding-left: 40px;
        padding-top: 10px;
        font-size: 14px;
        font-family: "Times New Roman", serif;
    }

    .email {
        font-family: "MS Sans Serif", serif;
        color: black;
        padding: 5px 5px 5px 20px;
        cursor: pointer;

        * {
            user-select: none;
        }

        &:focus, &:hover, &:active {
            background-color: #000080;
            color: white;
        }
    }

    .email-read {
        &::after {
            display: inline-block;
            content: '';
            -webkit-border-radius: 0.375rem;
            border-radius: 0.375rem;
            height: 5px;
            width: 5px;
            margin-right: 5px;
            border: 1px solid #000000;
            position: relative;
            top: -1px;

            .email:hover & {
                border: 1px solid #FFF;
            }
        }
    }

    .email-unread {
        &::before {
            display: inline-block;
            content: '';
            -webkit-border-radius: 0.375rem;
            border-radius: 0.375rem;
            height: 5px;
            width: 5px;
            margin-right: 5px;
            background: #000000;
            position: relative;
            top: -1px;

            .email:hover & {
                border: 1px solid #000;
            }
        }
    }

    .email-from {
        font-size: 12px;
    }

    .email-subject {
        font-size: 14px;
        font-weight: bold;
    }
</style>