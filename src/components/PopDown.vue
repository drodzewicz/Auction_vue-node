<template>
    <div @click="goToLink" class="pop-down-overlay" :class="{link: !!link}">
        <div class="pop-down-container" :class="[{show}, messageType]" >
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
            timer: "",
            link: undefined
        };
    },
    created () {
        bus.$on("changeMessage", (message, type, link) => {
            this.show = message !== this.content;
            this.content = message;
            this.messageType = type;
            this.link = link;
        });
    },
    updated () {
        this.timer = setTimeout(() => {
            this.content = "";
            this.messageType = "";
            this.show = false;
            this.link = undefined;
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
        },
        goToLink () {
            if (this.link) {
                this.$router.push(this.link).catch(() => {});
            }
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
    &.link {
      cursor: pointer;
    }
    .pop-down-container {
        top: 0;
        background: rgb(211, 211, 211);
        position: fixed;
        width: 30rem;
        padding: 0.2rem 0.4rem;
        border-radius: 10px;
        box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.462);
        border: 1px solid grey;
        display: flex;
        flex-grow: 1;
        z-index: 5;
        transform: translateY(-150%);
        transition: 0.3s all ease-in-out;
        @include mobile {
            width: 20rem;
        }
        &.show {
          transform: translateY(100%);
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
