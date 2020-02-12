const emailDataJson = require('./emailData.json');

module.exports = function () {

    return {
        namespaced: true,
        name: 'email',
        state: {
            ...emailDataJson
        },
        getters: {},
        actions: {
            init,
            receiveEmail
        }
    }

    function init({ state }) {
        applyState(state, getState());
    }

    function receiveEmail({ state, dispatch }, { from, subject, body }) {
        setTimeout(() => {
            state.inbox.emails.unshift({ read: false, subject, body, from });

            dispatch('windows/pushNotification', 'You got mail', { root: true });
            storeState(state);
        }, 2000);
    }

    function applyState(currentState, newState) {
        Object.keys(newState).forEach(key => {
            currentState[key] = newState[key];
        });
    }

    function getState() {
        const emailStateJSON = localStorage.getItem('emailState');
        const emailState = JSON.parse(emailStateJSON);
        if (typeof emailState !== 'object' || !emailState) {
            return {};
        }
        return emailState;
    }

    function storeState(state) {
        localStorage.setItem('emailState', JSON.stringify(state));
    }
};