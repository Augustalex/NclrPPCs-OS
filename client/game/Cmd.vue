<template>
    <Window :scroll="true"
            @click.native="consoleClick"
            @close="exit"
            iconClass="icon-dos"
            title="Command">
        <pre @click="consoleClick">{{ output }}</pre>
        <pre @click="consoleClick">{{ input }}<span :style="cursorStyle" class="cursor"/></pre>
        <input @blur="inputBlur"
               @focus="inputFocus"
               @keydown.enter="submitInput"
               class="hiddenInput"
               placeholder="> "
               ref="textarea"
               v-model="input"/>
    </Window>
</template>
<script>
    const Window = require('./Window.vue').default;
    const Vuex = require('vuex');
    const {
        mapState: mapReactorState,
        mapGetters: mapReactorGetters,
        mapMutations: mapReactorMutations,
        mapActions: mapReactorActions
    } = Vuex.createNamespacedHelpers('reactor');

    module.exports = {
        name: 'Cmd',
        data() {
            return {
                output: 'Command 1.0',
                input: '',
                cursorVisible: false,
                inputHasFocus: false,
                crashTimeout: null
            };
        },
        computed: {
            cursorStyle() {
                return {
                    visibility: this.cursorVisible ? 'visible' : 'hidden'
                };
            }
        },
        methods: {
            ...mapReactorActions([
                'promote',
            ]),
            consoleClick() {
                this.$refs.textarea.focus();
            },
            inputFocus() {
                this.inputHasFocus = true;
            },
            inputBlur() {
                this.inputHasFocus = false;
            },
            submitInput() {
                let input = this.input;
                this.input = '';

                this.outputLine(input);

                let handlerName = Object.keys(this)
                    .filter(key => typeof this[key] === 'function')
                    .find(key => input.startsWith(key));

                if (handlerName) {
                    let args = input.slice((handlerName + ' ').length).split(' ');
                    this[handlerName](...args);
                }
                else {
                    this.outputLine('Unknown command');
                }
            },
            exit() {
                this.$emit('close');
            },
            help() {
                this.outputLine(
                    Object.keys(this)
                        .filter(key => typeof this[key] === 'function')
                        .join('\n')
                );
            },
            echo(...words) {
                let line = words.join(' ')
                this.outputLine(line);
            },
            clear() {
                this.output = '';
            },
            outputLine(line) {
                this.output += `\n${line}`;

                setTimeout(() => {
                    let content = this.$el.querySelector('.content')
                    content.scrollTop = content.scrollHeight;
                });
            },
            nqkfx() {
                this.$store.state.reactor.reactors.forEach(reactor => {
                    reactor.level = 0;
                });
                this.$store.state.reactor.failures.meters = false;
                localStorage.setItem('fixedSystem', 'fixed');
                this.$store.dispatch(
                    'windows/pushNotification',
                    'Missing DLL file "NuclearControll.DLL". Run command "hlcw -fix --all" to repair and restart.',
                    { root: true }
                );

                this.crashTimeout = setTimeout(() => {
                    this.$store.dispatch('windows/showBlueScreen');
                }, 10 * 1000);
            },
            _accrdctm() {
                this.$store.state.reactor.halt = true;
            },
            europop() {
                this.$store.dispatch('windows/showBlueScreen');
            },
            hlcw(...args) {
                if (args[0] === '-fix' && args[1] === '--all') {
                    if (this.crashTimeout) {
                        clearTimeout(this.crashTimeout);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                    else {
                        this.$store.dispatch(
                            'windows/pushNotification',
                            'Hacker alert. Running self destruct bat file.',
                            { root: true }
                        );
                        setTimeout(() => {
                            this.$store.dispatch('windows/showBlueScreen');
                        }, 3000);
                    }
                }
            },
            npp(...args) {
                if (args[0] === '--force') {
                    this.$store.dispatch('windows/showBlueScreen');
                }
                else if (args[0] === '-s') {
                    this.$store.state.reactor.reactors.push(...[
                        { level: .85 },
                        { level: .84 },
                        { level: .83 },
                        { level: .82 },
                        { level: .81 },
                        { level: .8 },
                        { level: .8 },
                        { level: .79 },
                        { level: .78 },
                        { level: .77 },
                        { level: .76 },
                        { level: .75 },
                        { level: .74 },
                        { level: .73 },
                        { level: .72 },
                        { level: .71 },
                        { level: .79 },
                        { level: .78 },
                        { level: .77 },
                        { level: .76 },
                        { level: .75 },
                        { level: .74 },
                        { level: .73 },
                        { level: .72 },
                        { level: .71 },
                        { level: .7 },
                        { level: .7 },
                        { level: .7 },
                        { level: .7 },
                        { level: .7 },
                        { level: .7 },
                        { level: .7 },
                        { level: .7 },
                        { level: .7 },
                        { level: .7 },
                        { level: .7 },
                    ]);
                }
            }
        },
        mounted() {
            this.$refs.textarea.focus();
            this.blinkIntervalId = setInterval(() => {
                this.cursorVisible = this.inputHasFocus && !this.cursorVisible;
            }, 500);
        },
        destroyed() {
            clearInterval(this.blinkIntervalId);
        },
        components: {
            Window
        }
    }
</script>
<style lang="scss" scoped>
    .hiddenInput {
        display: block;
        width: 0;
        height: 0;
        padding: 0;
        margin: 0;
        border: none;
    }

    pre {
        color: white;
        padding: 0 0 0 2px;
        margin: 0;
    }

    .cursor {
        position: relative;
        left: 1px;
        top: 2px;
        display: inline-block;
        background-color: white;
        width: 6px;
        height: 12px;
    }
</style>