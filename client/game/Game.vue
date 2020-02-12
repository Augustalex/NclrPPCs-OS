<template>
    <div class="game">
        <h1 v-if="scene === 'loading'">LOADING</h1>
        <div v-if="scene === 'boot'" class="outerDisplay">
            <input type="checkbox" id="switch" checked>
            <div class="container container--large">
                <div class="display crt screen">
                    <img src="/image/boot.png" class="boot"/>
                </div>
            </div>
        </div>
        <div v-else-if="scene === 'login'" class="outerDisplay">
            <div class="container container--large">
                <div class="display crt screen">
                    <div class="loginWrapper">
                        <div class="login">
                            <transition name="fade">
                                <div v-if="showLoginMessage" class="login-message">
                                    <h1>
                                        NclrPPCs-OS
                                    </h1>
                                    <em>Powered by OS-95</em>
                                </div>
                            </transition>
                            <div v-if="showLoginInput">
                                <input class="login-password"
                                       placeholder="********"
                                       type="password"
                                       v-model="passwordInput"/>
                                <button @click="submitPassword"
                                        class="login-loginButton">
                                    Login
                                </button>
                            </div>
                            <div v-if="wrongPassword" class="login-wrongPassword">
                                Wrong password
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Windows v-else-if="scene === 'windows'"/>
        <portal-target name="game"/>
    </div>
</template>
<script>
    const Vuex = require('vuex');
    const Windows = require('./Windows.vue').default;

    const {
        mapState: mapGameState,
        mapActions: mapGameActions
    } = Vuex.createNamespacedHelpers('game');

    module.exports = {
        data() {
            return {
                passwordInput: ''
            };
        },
        computed: {
            ...mapGameState(['scene', 'wrongPassword', 'showLoginMessage', 'showLoginInput'])
        },
        methods: {
            ...mapGameActions([
                'login',
            ]),
            submitPassword() {
                let password = this.passwordInput;
                this.passwordInput = '';
                this.login(password);
            }
        },
        components: {
            Windows
        }
    };
</script>
<style lang="scss" scoped>
    @import "icons";
    @import "windows";
    @import "crt";

    .game {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        width: 100vw;
    }

    .loginWrapper {
        flex: 1 0 auto;
        display: flex;
        flex-direction: column;
    }

    .login {
        flex: 1 0 auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        top: -10px;
    }

    .login-message {
        font-size: 34px;
        font-family: "MS Sans Serif", sans-serif;
        position: relative;
        top: -60px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        opacity: 1;
    }

    .login-password {
        margin-right: 10px;
    }

    .login-wrongPassword {
        font-family: "MS Sans Serif", sans-serif;
        color: tomato;
        font-weight: bold;
        margin-top: 5px;
    }

    .login {
        h1 {
            margin-bottom: 0px;
        }

        em {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
        }
    }

    .boot {
        width: 100%;
        height: 100%;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 6s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }
</style>