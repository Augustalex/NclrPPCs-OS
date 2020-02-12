const Vue = require('vue');
const Vuex = require('vuex');
const PortalVue = require('portal-vue');
const vClickOutside = require('v-click-outside');
const Router = require('./Router.js');
const RootStore = require('./RootStore.js');
const GamePage = require('./game/GamePage.js');

let rootStore;

Vue.use(Vuex);
Vue.use(PortalVue);
Vue.use(vClickOutside);
bootstrap();

function bootstrap() {
    rootStore = createStores();
    initRouter();
}

function initRouter() {
    const pagesByName = {
        'game': GamePage
    };
    const pageDependencies = { rootStore };
    const router = Router({ pagesByName, pageDependencies });

    router.route('game');
}

function createStores() {
    return RootStore();
}