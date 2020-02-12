module.exports = function () {

    let lastSave = Date.now();
    let lastTickTime = Date.now();

    return {
        namespaced: true,
        name: 'reactor',
        state: {
            halt: false,
            level: 1,
            coolCount: 0,
            reactors: [
                { level: .4, sentNotification: false }
            ],
            failures: {
                meters: false
            },
            timeTilMetersStopWorking: Infinity,
            gameTime: 0
        },
        getters: {
            clockText,
            reactorsThatCanBeCooledIndicies
        },
        actions: {
            init,
            tick,
            promote,
            coolReactorAtIndex
        }
    }

    function reactorsThatCanBeCooledIndicies(state) {
        return state.reactors
            .map((r, i) => ({ level: r.level, index: i }))
            .filter(({ level }) => level >= .7)
            .map(({ index }) => index);
    }

    function clockText(state) {
        const time = state.gameTime;
        const seconds = (Math.floor(time / 1000) % 60).toString();
        const minutes = Math.floor(time / (60 * 1000)).toString();
        return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }

    function init({ state, dispatch }) {
        // state.timeTilMetersStopWorking = 2 * 60 * 1000; //Otherwise tick method overrides applied state
        state.timeTilMetersStopWorking = 60 * 1000; //Otherwise tick method overrides applied state
        applyState(state, getState());

        console.log('state.timeTilMetersStopWorking', state.timeTilMetersStopWorking)
        setInterval(() => {
            dispatch('tick');
        }, 50);
    }

    function tick({ state, dispatch, rootState }) {
        if (state.halt) return;

        let now = Date.now();
        let deltaTime = now - lastTickTime;
        state.gameTime += deltaTime;
        state.timeTilMetersStopWorking -= deltaTime;
        if (state.timeTilMetersStopWorking <= 0) {
            state.timeTilMetersStopWorking = Infinity;
            state.failures.meters = true;
        }

        for (const reactor of state.reactors) {
            reactor.level = Math.min(1, reactor.level + .001);
            if (reactor.level >= .7 && !reactor.sentNotification) {
                reactor.sentNotification = true;
                dispatch('windows/pushNotification', 'Warning! Reactor is overheating.', { root: true });
            }

            if (reactor.level === 1 && !rootState.windows.blueScreen) {
                dispatch('windows/showBlueScreen', null, { root: true });
                rootState.windows.redirectToMeltdown = true;
            }
        }

        if (Date.now() - lastSave > 500) {
            lastSave = Date.now();
            storeState(state);

            if (localStorage.getItem('fixedSystem') === 'fixed') {
                state.failures.meters = false;
            }
        }

        lastTickTime = now;
    }

    function coolReactorAtIndex({ state, dispatch }, index) {
        let reactor = state.reactors[index]
        if (reactor.level > .7) {
            reactor.level = 0;
            reactor.sentNotification = false;
        }

        state.coolCount++;
        if (state.coolCount >= state.reactors.length) {
            state.coolCount = 0;
            dispatch('promote');
        }
    }

    function promote({ state, dispatch }) {
        const count = Math.ceil(state.level * 2) - 1;
        for (let i = 0; i < count; i++) {
            state.reactors.push({ level: (.01 * i) });
        }
        state.level += 1;

        if (state.level === 8) {
            dispatch('email/receiveEmail', {
                from: 'Friend',
                subject: 'You can make it stop',
                body: 'You can stop time. Type "_accrdctm" into the "Command" app. To go back in time, type "europop".'
            }, { root: true });
        }
        else {
            dispatch('email/receiveEmail', {
                from: 'Boss',
                subject: `Promotion to level ${state.level}`,
                body: 'You\'ve been doing a good job, the board have decided do give you some more responsibility. Maybe next time you\'ll get a raise!'
            }, { root: true });
        }
    }

    function applyState(currentState, newState) {
        Object.keys(newState).forEach(key => {
            currentState[key] = newState[key];
        });
    }

    function getState() {
        const reactorStateJSON = localStorage.getItem('reactorState');
        const reactorState = JSON.parse(reactorStateJSON);
        if (typeof reactorState !== 'object' || !reactorState) {
            return {};
        }
        return reactorState;
    }

    function storeState(state) {
        localStorage.setItem('reactorState', JSON.stringify(state));
    }
};