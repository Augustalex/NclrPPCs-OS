<template>
    <div class="outerDisplay">
        <div class="container container--large">
            <BlueScreen class="crt" v-if="blueScreen"/>
            <div v-else class="display crt screen">
                <div class="desktop">
                    <component
                            v-for="app in apps"
                            :is="app.component"
                            :app="app"
                            @close="closeApp(app)"/>
                    <div class="desktop-apps">
                        <button @click="startNewApp('cmd')" class="appIcon">
                            <i class="appIcon-image icon-dos"/>
                            <span class="appIcon-name">Command</span>
                        </button>
                        <button @click="startNewApp('reactorControl')" class="appIcon">
                            <i class="appIcon-image icon-core"/>
                            <span class="appIcon-name">Reactor Control</span>
                        </button>
                        <button @click="startNewApp('emailPro')" class="appIcon">
                            <i class="appIcon-image icon-email"/>
                            <span class="appIcon-name">Email Pro</span>
                        </button>
                        <button @click="startNewApp('ie')" class="appIcon">
                            <i class="appIcon-image icon-dos"/>
                            <span class="appIcon-name">Internet Explorer</span>
                        </button>
                    </div>
                </div>
                <div class="footerWrapper">
                    <div class="footer">
                        <button class="startButton"/>
                        <div class="footer-tabs">
                            <div v-for="app in apps" class="footer-tab">
                                <i v-if="app.iconClass" :class="[app.iconClass, 'footer-tabIcon']"/>
                                {{ app.name }}
                            </div>
                        </div>
                        <div class="clock">
                            {{ clockText }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const Vuex = require('vuex');
    const BlueScreen = require('./BlueScreen.vue').default;
    const {
        mapState: mapWindowsState,
        mapGetters: mapWindowsGetters,
        mapActions: mapWindowsActions
    } = Vuex.createNamespacedHelpers('windows');
    const {
        mapGetters: mapReactorGetters,
    } = Vuex.createNamespacedHelpers('reactor');

    module.exports = {
        computed: {
            ...mapWindowsState([
                'apps',
                'blueScreen'
            ]),
            ...mapWindowsGetters([
                'latestNotification'
            ]),
            ...mapReactorGetters([
                'clockText',
            ]),
        },
        methods: {
            ...mapWindowsActions([
                'markNotificationAsRead',
                'startNewApp',
                'closeApp'
            ])
        },
        components: {
            BlueScreen
        }
    }
</script>
<style lang="scss" scoped>
    @import url('https://fonts.googleapis.com/css?family=VT323');
    @import "icons";
    @import "windows";
    @import "crt";
</style>