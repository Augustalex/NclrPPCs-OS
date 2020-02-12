<template>
    <img class="blueScreen" src="/image/bluescreen.jpg">
</template>
<script>
    module.exports = {
        methods: {
            keydown() {
                this.$store.dispatch('windows/reset', null, { root: true });
            }
        },
        mounted() {
            document.addEventListener('keydown', this.keydown);
        },
        destroyed() {
            document.removeEventListener('keydown', this.keydown);
        }
    };
</script>
<style lang="scss" scoped>
    .blueScreen {
        width: 100%;
        height: 100%;
    }
</style>