<template>
    <div v-if="show" class="pop-down-container" :class="[messageType]" >
        <span class="content">{{this.content}}</span>
    </div>
</template>

<script>
import { bus } from "../main";
export default {
    name: "PopDown",
    data () {
        return {
            show: false,
            content: "",
            messageType: "",
            timer: ""
        };
    },
    created () {
        bus.$on("changeMessage", (message, type) => {
            this.show = message !== this.content;
            this.content = message;
            this.messageType = type;
        });
    },
    updated () {
        this.timer = setTimeout(() => {
            this.content = "";
            this.messageType = "";
            this.show = false;
        }, 5000);
    },
    watch: {
        show (newVal, oldVal) {
            if (!newVal) {
                clearTimeout(this.timer);
            }
        }
    }
};
</script>

<style lang="scss">
    .pop-down-container {
        background: grey;
        position: absolute;
        width: 100%;
        z-index: 10;
        animation: popdown-animation 5s forwards;
        height: 1.5rem;
        &.error {
             background: #E82F2F;
             color: rgb(255, 233, 233);
        }
        &.success {
             background: #45ca4c;
             color: #202921;
        }

        @keyframes popdown-animation {
            from { transform: translateY(-100%); }
            11% {  transform: translateY(0); }
            85% {  transform: translateY(0); }
            to { transform: translateY(-100%); }
        }

        .content {
            font-size: 0.9rem;
            font-family: 'Roboto', sans-serif;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
    }
</style>
