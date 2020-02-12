module.exports = function (deps) {

    return {
        namespaced: true,
        state: {
            scene: 'boot',
            wrongPassword: false,
            showLoginInput: false,
            showLoginMessage: false
        },
        getters: {},
        mutations: {},
        actions: {
            init,
            updateState,
            login,
            showLogin
        }
    };

    function init({ state, dispatch }) {
        let timeoutId = setTimeout(() => {
            document.removeEventListener('keydown', keydownListener);
            dispatch('showLogin');
        }, 10000);

        let keydownCount = 0;
        const keydownListener = e => {
            let validKeys = ['Enter', 'Space', ' ', 'Esc', 'Escape', 'Tab', 'tab', 'escape', 'esc', 'ctrl', 'Control', 'CTRL', 'LCTRL', 'lctrl']
            if (validKeys.includes(e.key)) {
                keydownCount++;
            }
            if (keydownCount >= 13) {
                clearTimeout(timeoutId);
                document.removeEventListener('keydown', keydownListener);
                dispatch('showLogin');
            }
        };
        document.addEventListener('keydown', keydownListener);
    }

    function showLogin({ state, dispatch }) {
        state.showLoginMessage = false;
        state.showLoginInput = false;
        state.scene = 'login';
        dispatch('sound/playBoot', null, { root: true });

        setTimeout(() => {
            state.showLoginMessage = true;
        });
        setTimeout(() => {
            state.showLoginInput = true;
        }, 6000);
    }

    function login({ state, rootState }, password) {
        if (rootState.windows.blueScreen) {
            state.scene = 'windows';
            return;
        }

        let storedPassword = localStorage.getItem('password');
        if (!storedPassword || password === storedPassword) {
            localStorage.setItem('password', password);
            state.scene = 'windows';
        }
        else {
            state.wrongPassword = true;
        }
    }

    function updateState({ state }, mergeData) {
        for (const key of Object.keys(mergeData)) {
            state[key] = mergeData[key]
        }
    }
}