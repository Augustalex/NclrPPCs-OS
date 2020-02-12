module.exports = function () {
    return {
        namespaced: true,
        name: 'sound',
        state: {},
        actions: {
            playBoot,
            playAlert
        },
    }

    function playBoot() {
        const audio = new Audio('/sound/start.mp3');
        audio.play();
    }

    function playAlert() {
        const audio = new Audio('/sound/error.mp3');
        audio.play();
    }
};