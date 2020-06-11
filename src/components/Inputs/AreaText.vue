<template>
    <div class="text-area">
        <label for="username">{{`${(validation && validation.required) ? "* " : ""} ${name}:`}}</label>
        <textarea
            :name="name"
            :class="{error: error.length > 0}"
            :value="value"
            @input="updateValue($event.target.value)"
        ></textarea>
        <span class="error-msg">{{error}}</span>
    </div>
</template>

<script>
import checkValidation from "@/_helper/validation";

export default {
    name: "AreaText",
    props: {
        value: {
            type: String
        },
        name: {
            type: String
        },
        validation: {
            type: Object
        }
    },
    data () {
        return {
            error: ""
        };
    },
    methods: {
        updateValue (value) {
            if (this.validation !== undefined) {
                this.error = checkValidation(value, this.validation);
            }

            this.$emit("input", value);
            this.$emit("validateField", this.name, this.error.length === 0);
        }
    }
};
</script>

<style lang="scss" >
.text-area {
    display: flex;
    flex-direction: column;
    height: 6rem;
    position: relative;

    label {
        font-size: 0.9rem;
        margin-bottom: 0.2rem;
    }
    .error-msg {
        font-family: "Roboto", sans-serif;
        font-size: 0.7rem;
        margin-top: 0.3rem;
        color: red;
    }
    textarea {
        font-family: "Roboto", sans-serif;
        border: none;
        background: rgb(235, 235, 235);
        border-bottom: solid 3px $main-dark-blue;
        height: 1.5rem;
        padding: 0.2rem 0.5rem;
        outline: none;
        border-radius: 5px 5px 0 0;
        position: relative;
        width: 100%;
        box-sizing: border-box;
        resize: none;
        &:focus {
            background: rgb(216, 216, 216);
        }
        &.error {
            border-color: red;
        }
    }
}
</style>
