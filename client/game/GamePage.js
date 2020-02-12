const Vue = require('vue');
const GameView = require('./Game.vue').default;
const GameStore = require('./GameStore.js');
const STORES = [
    require('./WindowsStore.js'),
    require('./ReactorStore.js'),
    require('./EmailStore.js'),
    require('./SoundStore.js')
];

module.exports = function (deps) {

    const rootStore = deps.rootStore;

    let vm;

    return {
        show,
        hide
    };

    function show() {
        if (rootStore.state.game) {
            rootStore.unregister('game');
        }
        let gameStore = GameStore({ ...deps });
        rootStore.registerModule('game', gameStore);

        const stores = STORES.map(Store => Store({ ...deps }));
        stores.forEach(store => rootStore.registerModule(store.name, store));

        rootStore.dispatch('game/init');
        for (const store of stores) {
            if (!!store.actions && 'init' in store.actions) {
                rootStore.dispatch(`${store.name}/init`);
            }
        }

        vm = new Vue({
            store: rootStore,
            render(h) {
                return h(GameView, {});
            }
        });
        const hook = document.createElement('div');
        document.body.appendChild(hook);
        vm.$mount(hook);
    }

    function hide() {
        if (!vm) return;

        vm.$destroy();
        vm.$el.remove();
        vm = null;
    }
};