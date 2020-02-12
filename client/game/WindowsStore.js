const Cmd = require('./Cmd.vue').default;
const ReactorControl = require('./ReactorControl.vue').default;
const EmailPro = require('./EmailPro.vue').default;
const InternetExplorer = require('./InternetExplorer.vue').default;
const Warning = require('./Warning.vue').default;

module.exports = function () {

    return {
        namespaced: true,
        name: 'windows',
        state: {
            apps: [],
            notifications: [],
            spawnOffset: {
                x: 0,
                y: -0
            },
            blueScreen: false,
            redirectToMeltdown: false
        },
        getters: {
            latestNotification
        },
        actions: {
            pushNotification,
            markNotificationAsRead,
            startNewApp,
            _appendApp,
            closeApp,
            reset,
            showBlueScreen
        }
    }

    function pushNotification({ state, dispatch }, text) {
        dispatch('sound/playAlert', null, { root: true });
        dispatch('_appendApp', {
            id: getId(),
            name: 'Warning',
            iconClass: 'icon-warning',
            component: Warning,
            data: { text }
        });
    }

    function latestNotification(state) {
        return state.notifications[0];//Not really the latest though, but eh
    }

    function markNotificationAsRead({ state }) {
        return state.notifications.shift();
    }

    function startNewApp({ state, dispatch }, name) {
        if (name === 'cmd') {
            dispatch('_appendApp', {
                id: getId(),
                name: 'COMMAND',
                iconClass: 'icon-dos',
                component: Cmd
            });
        }
        else if (name === 'reactorControl') {
            dispatch('_appendApp', {
                id: getId(),
                name: 'Reactor Control',
                iconClass: 'icon-core',
                component: ReactorControl
            });
        }
        else if (name === 'emailPro') {
            dispatch('_appendApp', {
                id: getId(),
                name: 'Email Pro',
                iconClass: 'icon-email',
                component: EmailPro
            });
        }
        else if (name === 'ie') {
            dispatch('_appendApp', {
                id: getId(),
                name: 'Internet Explorer',
                iconClass: 'icon-dos',
                component: InternetExplorer
            });
        }
    }

    function _appendApp({ state }, app) {
        Object.assign(app, { spawnOffset: { ...state.spawnOffset } });
        state.apps.push(app);
        let spawnOffset = state.spawnOffset;
        if (spawnOffset.x >= 100 || spawnOffset.y <= -100) {
            state.spawnOffset = { x: 0, y: 0 };
        }
        else {
            state.spawnOffset = { x: spawnOffset.x + 10, y: spawnOffset.y - 10 };
        }
    }

    function closeApp({ state }, app) {
        state.apps = state.apps.filter(a => a !== app);
        let spawnOffset = state.spawnOffset;
        // if (spawnOffset.x <= 0 || spawnOffset.y >= 0) return;
        //
        // state.spawnOffset = { x: spawnOffset.x - 10, y: spawnOffset.y + 10 };
        // console.log('CLOSE APP NEW SPAWN OFFSET', JSON.stringify(state.spawnOffset, null, 4))
    }

    function reset({ state }) {
        localStorage.removeItem('readEmails');
        localStorage.removeItem('reactorState');
        localStorage.removeItem('emailState');
        localStorage.removeItem('password');
        localStorage.removeItem('fixedSystem');

        if (state.redirectToMeltdown) {
            window.location.reload(); //Find video to redirect to if there is time... probably not.
        }
        window.location.reload();
    }

    function showBlueScreen({ state, dispatch }) {
        state.blueScreen = true;
        dispatch('sound/playAlert', null, { root: true });
    }

    function getId() {
        return Date.now().toString() + Math.round(Math.random() * 10000).toString();
    }
};