<template>
    <Window :flexContent="true" :scroll="false" @close="$emit('close')" size="large">
        <div class="bar">
            <input @keydown.enter="url = transientUrl" v-model="transientUrl"/>
        </div>
        <div v-if="url === 'http://www.justiceforearthworms.net'">
            <h1 class="ewsHeader">Earth Worms Society</h1>
            <button @click="url = 'https://paypal.com'" class="donate">DONATE</button>
            <marquee class="now"><h2>NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW
                                     NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW
                                     NOW NOW NOW NOW NOW NOW NOW
                                     NOW</h2></marquee>
        </div>
        <iframe v-else :src="url" class="ie"/>
    </Window>
</template>
<script>
    const Window = require('./Window.vue').default;

    module.exports = {
        data() {
            let transientUrl = 'https://web.archive.org/web/19961219095358/http://altavista.com/'
            return {
                transientUrl: transientUrl,
                url: transientUrl
            };
        },
        components: {
            Window
        }
    };
</script>
<style lang="scss" scoped>
    .bar {
        background: transparent;
        border: none;

        input {
            width: 100%;
            box-sizing: border-box;
        }
    }

    .ie {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        flex: 1 1 auto;
        background: transparent;
    }

    .header {
        height: 10px;
        width: 100%;
    }

    .ewsHeader {
        color: blue;
        text-shadow: 2px 2px lime;
        text-align: center;
        font-size: 3em;
        font-family: Comic Sans MS;
        margin-bottom: 37px;
    }

    .donate {
        font-size: 4em;
        position: absolute;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
        color: greenyellow;
        background: limegreen;
        z-index: 1;
    }

    .now {
        color: deeppink;
    }
</style>