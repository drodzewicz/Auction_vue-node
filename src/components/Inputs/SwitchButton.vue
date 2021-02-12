<template>
    <div class="switch-container">
        <span id="true-label">{{trueLabel}}</span>
        <button
            class="switch-body"
            type="button"
            :value="isAuction"
            :class="{on: isAuction}"
            @click="toggleSwitchState"
        >
            <div class="switch"></div>
        </button>
        <span id="false-label">{{falseLabel}}</span>
    </div>
</template>

<script>
export default {
    model: {
        prop: "isAuction",
        event: "click"
    },
    name: "SwitchButton",
    props: {
        trueLabel: {
            type: String,
            default: "on"
        },
        falseLabel: {
            type: String,
            default: "off"
        },
        isAuction: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        toggleSwitchState () {
            this.$emit("click", !this.isAuction);
        }
    }
};
</script>

<style lang="scss" >
.switch-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .switch-body {
        margin: 0 0.5rem;
        background: grey;
        width: 3.6rem;
        border-radius: 10rem;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        padding: 0.2rem 0.3rem;
        border: none;
        outline: none;
        display: flex;
        align-items: center;

        &.on {
            background: $main-dark-blue;
            .switch {
                transform: translateX(150%);
            }
        }
        .switch {
            width: 1.2rem;
            height: 1.2rem;
            border-radius: 10rem;
            background: white;
            margin: 0;
            transition: all 0.3s ease-in-out;
        }
    }
}
</style>
