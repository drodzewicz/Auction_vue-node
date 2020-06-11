<template>
    <div class="pop-down-overlay">
        <div v-if="show" class="pop-down-container" :class="messageType">
            <span class="content">{{this.content}}</span>
            <button class="exit" @click="hideMessage"><i class="fas fa-times"></i></button>
        </div>
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
    },
    methods: {
        hideMessage () {
            this.show = false;
        }
    }
};
</script>

<style lang="scss">
.pop-down-overlay {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    .pop-down-container {
        top: 2rem;
        background: rgb(211, 211, 211);
        position: fixed;
        width: 30rem;
        padding: 0.2rem 0.4rem;
        border-radius: 10px;
        box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.462);
        border: 1px solid grey;
        display: flex;
        flex-grow: 1;
        @include mobile {
            width: 20rem;
        }

        &.success {
            background: rgb(177, 233, 177);
            border: 1px solid rgb(27, 103, 45);
            .exit,
            .content {
                color: rgb(27, 103, 45);
            }
        }
        &.error {
            background: rgb(233, 177, 177);
            border: 1px solid rgb(103, 36, 27);
            .exit,
            .content {
                color: rgb(103, 36, 27);
            }
        }
        .content {
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
        .exit {
            background: transparent;
            cursor: pointer;
            border: none;
            outline: none;
        }
    }
}
</style>
