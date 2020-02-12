<template>
    <div :class="windowClasses" :style="windowStyle">
        <div class="header" :style="headerStyle" @mousedown.self="startDrag">
            <div class="header-left dead">
                <i :class="[iconClass, 'header-icon dead']"/>
                <span class="header-title text95">{{ title }}</span>
            </div>
            <button @click="$emit('close')" class="cross"/>
        </div>
        <div :class="['content', {'content--flexColumn': flexContent}]" :style="contentStyle">
            <slot/>
        </div>
    </div>
</template>
<script>
    module.exports = {
        props: [
            'scroll',
            'iconClass',
            'title',
            'background',
            'flexContent',
            'size',
            'spawnOffset'
        ],
        data() {
            return {
                dragging: false,
                mousePosition: {
                    x: 0,
                    y: 0
                },
                windowTop: 0,
                windowLeft: 0
            };
        },
        computed: {
            windowClasses() {
                const classes = ['window'];
                if (this.size === 'large') {
                    classes.push('window--large');
                }
                return classes;
            },
            windowStyle() {
                return {
                    top: `${this.windowTop}px`,
                    left: `${this.windowLeft}px`
                };
            },
            headerStyle() {
                let backgroundColor = '#0100a8';
                if (this.background === 'gray' || this.background === 'grey') {
                    backgroundColor = '#808080';
                }

                return {
                    backgroundColor
                }
            },
            contentStyle() {
                let backgroundColor = 'black';
                if (this.background === 'gray' || this.background === 'grey') {
                    backgroundColor = '#c0c0c0';
                }

                return {
                    overflowY: this.scroll ? 'auto' : 'hidden',
                    backgroundColor
                }
            }
        },
        methods: {
            startDrag() {
                this.dragging = true;
            },
            stopDrag() {
                this.dragging = false;
            },
            mouseMove(event) {
                let newMousePosition = { x: event.clientX, y: event.clientY };
                if (this.dragging) {
                    this.windowLeft += newMousePosition.x - this.mousePosition.x;
                    this.windowTop += newMousePosition.y - this.mousePosition.y;
                }

                this.mousePosition = newMousePosition;
            }
        },
        mounted() {
            document.addEventListener('mousemove', this.mouseMove);
            document.addEventListener('mouseup', this.stopDrag);

            let offset = !this.spawnOffset ? { x: 0, y: 0 } : this.spawnOffset;
            let spawnTop = Math.round(this.$el.parentNode.offsetHeight * .5) + offset.y;
            this.windowTop = spawnTop;

            let spawnLeft = Math.round(this.$el.parentNode.offsetWidth * .5) + offset.x;
            this.windowLeft = spawnLeft;
        },
        destroyed() {
            document.removeEventListener('mousemove', this.mouseMove);
            document.removeEventListener('mouseup', this.stopDrag);
        }
    };
</script>
<style scoped lang="scss">
    @import "icons";

    $borderColor: #bfc7c9;
    $borderTopColor: #eff0f1;
    $borderBottomColor: #66656d;
    $borderRightColor: #3c3c40;

    .window {
        position: absolute;
        z-index: 10;
        width: 360px;
        height: 180px;
        border-top: 1px solid $borderTopColor;
        border-left: 1px solid $borderTopColor;
        border-right: 1px solid $borderRightColor;
        border-bottom: 1px solid $borderBottomColor;
        box-shadow: 0.5px 0.5px 0px 0px #393939;
        background: black;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        box-sizing: border-box;
        transform: translate(-50%, -50%);

        &--large {
            width: 600px;
            height: 420px;
        }
    }

    .header {
        flex: 0 0 18px;
        width: 100%;
        background-color: #0100a8;
        border: 1px solid $borderColor;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 2px;
    }

    .cross {
        background-image: url(/image/close.png);
        background-size: cover;
        flex: 0 0 13px;
        padding: 0;
        border: 0;
        height: 13px;
        position: relative;
        top: .5px;
        outline: 0;
    }

    .content {
        width: 100%;
        border: 1px solid $borderColor;
        box-sizing: border-box;
        flex: 1 1 auto;

        &--flexColumn {
            display: flex;
            flex-direction: column;
        }
    }

    .header-left {
        display: flex;
        align-items: center;
    }

    .header-icon {
        width: 15px;
        height: 15px;
        margin-left: 3px;
        margin-right: 3px;
    }

    .header-title {
        font-size: 12px;
        font-weight: bold;
    }
</style>