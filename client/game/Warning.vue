<template>
    <Window :flexContent="true"
            :spawnOffset="spawnOffset"
            @close="$emit('close')"
            background="grey">
        <div class="notification">
            <i class="icon-notification"/>
            <span class="notification-text">
                {{ text }}
            </span>
        </div>
    </Window>
</template>
<script>
    const Window = require('./Window.vue').default;
    const Vuex = require('vuex');
    const {
        mapState: mapWindowsState,
        mapGetters: mapWindowsGetters,
        mapMutations: mapWindowsMutations,
        mapActions: mapWindowsActions
    } = Vuex.createNamespacedHelpers('windows');

    module.exports = {
        props: ['app'],
        computed: {
            ...mapWindowsGetters([
                'latestNotification',
            ]),
            text() {
                return this.app.data.text;
            },
            spawnOffset() {
                if (!this.app.spawnOffset) return { x: 0, y: 0 };
                return this.app.spawnOffset;
            },
            style() {
                return {
                    top: `calc(50% + ${this.app.spawnOffset.y}px)`,
                    left: `calc(50% + ${this.app.spawnOffset.x}px)`
                };
            }
        },
        components: {
            Window
        }
    }
</script>
<style lang="scss" scoped>
    .notification {
        flex: 1 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        top: -5px;
        font-weight: bold;
        font-family: "MS Sans Serif", serif;
    }
</style>