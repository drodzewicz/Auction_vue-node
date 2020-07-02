<template>
    <div class="text-input">
        <label v-if="displayLabel" for="username">{{`${required ? "* " : ""}${name}:`}}</label>
        <input
            :min="min"
            :type="type"
            :class="{error: isValid}"
            :value="value"
            @input="updateValue($event.target.value)"
        />
        <span class="error-msg">{{dislpayError}}</span>
    </div>
</template>

<script>
import checkValidation from "@/_helper/validation";

export default {
    name: "TextInput",
    props: {
        value: {
            type: String
        },
        min: {
            type: Number,
            default: 0
        },
        type: {
            type: String,
            default: "text"
        },
        name: {
            type: String
        },
        required: {
            type: Boolean
        },
        displayLabel: {
            type: Boolean,
            default: true
        },
        validation: {
            type: Object
        },
        error: {
            type: String,
            default: ""
        }
    },
    data () {
        return {
            errorState: ""
        };
    },
    methods: {
        updateValue (value) {
            this.errorState = checkValidation(value, this.validation);
            this.$emit("input", value);
            this.$emit("validateField", this.name, this.errorState.length === 0);
        }
    },
    computed: {
        isValid () {
            return this.error !== "" || this.errorState.length > 0;
        },
        dislpayError () {
            return this.errorState !== "" ? this.errorState : this.error;
        }
    }
};
</script>

<style lang="scss" >
.text-input {
    display: flex;
    flex-direction: column;
    height: 6rem;

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
    input {
        font-family: "Roboto", sans-serif;
        border: none;
        background: rgb(235, 235, 235);
        border-bottom: solid 3px $main-dark-blue;
        height: 1.5rem;
        padding: 0.2rem 0.5rem;
        outline: none;
        border-radius: 5px 5px 0 0;
        position: relative;

        &:focus {
            background: rgb(216, 216, 216);
        }
        &.error {
            border-color: red;
        }
    }
}
</style>
