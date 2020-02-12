<template>
    <Window @close="exit"
            background="gray"
            iconClass="icon-core"
            title="Reactor control">
        <div class="meters">
            <div class="meter" v-for="reactor, index in reactors">
                <div :style="getLevelStyle(reactor)" class="level"/>
                <button :disabled="buttonsAreDisabled || !reactorsThatCanBeCooledIndicies.includes(index)"
                        @click="coolReactorAtIndex(index)"
                        class="coolButton"></button>
            </div>
        </div>
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
        data() {
            return {
                meterLevel: .1,
                levelIntervalId: null
            };
        },
        computed: {
            ...mapReactorState([
                'reactors',
                'failures'
            ]),
            ...mapReactorGetters([
                'reactorsThatCanBeCooledIndicies',
            ]),
            buttonsAreDisabled() {
                return this.failures.meters && Math.random() < .95;
            }
        },
        methods: {
            ...mapReactorActions([
                'coolReactorAtIndex',
            ]),
            exit() {
                this.$emit('close');
            },
            getLevelStyle(reactor) {
                let red = reactor.level >= .7
                    ? 200 + Math.floor(55 * ((reactor.level - .7) / .7))
                    : 0;
                let blue = reactor.level >= .7 ? 0 : 255;

                let heightInPixels = reactor.level * 100;
                if (this.failures.meters && Math.random() < .99) {
                    heightInPixels = Math.round(3 * Math.random());
                    red = 0;
                    blue = 255;
                }

                return {
                    height: `${heightInPixels}px`,
                    backgroundColor: `rgb(${red}, 0, ${blue})`
                };
            }
        },
        mounted() {
            this.levelIntervalId = setInterval(() => {
                this.meterLevel = Math.min(1, this.meterLevel + 0.01);
            }, 60);
        },
        destroyed() {
            if (this.levelIntervalId) {
                clearInterval(this.levelIntervalId);
            }
        },
        components: {
            Window
        }
    }
</script>
<style lang="scss" scoped>
    .meters {
        display: flex;
    }

    .meter {
        display: flex;
        align-items: flex-end;
        width: 20px;
        height: 100px;
        background: white;
        border: 1px solid gray;
        position: relative;
    }

    .level {
        flex: 1 1 auto;
    }

    .coolButton {
        width: 20px;
        height: 20px;
        position: absolute;
        top: calc(100% + 4px);
        background: red;
        border-radius: 50%;
    }

    .coolButton[disabled] {
        width: 20px;
        height: 20px;
        position: absolute;
        top: calc(100% + 4px);
        background: grey;
        border-radius: 50%;
    }
</style>