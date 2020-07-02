<template>
    <div class="box">
        <div class="register-container">
            <h2>Register</h2>

            <text-input
                v-for="field in loginFields"
                v-model="field.value"
                :key="field.name"
                :value="field.value"
                :name="field.name"
                :type="field.type"
                :validation="field.validation"
                :error="field.error"
                :required="field.validation.required"
                v-on:validateField="validateFieldLogin"
            />
            <button class="primary-btn" :disabled="!isReadyToSent || spinner" @click="registerUser">
              Register
              <spinner-2 v-if="spinner" />
            </button>
        </div>
    </div>
</template>

<script>
import { TextInput } from "@/components/Inputs";
import { Spinner2 } from "@/components/Spinners";
import { bus } from "../main";
export default {
    name: "Register",
    components: {
        TextInput,
        Spinner2
    },
    data () {
        return {
            spinner: false,
            loginFields: [
                {
                    isValid: false,
                    name: "username",
                    value: "",
                    error: "",
                    validation: {
                        required: true,
                        spaces: false,
                        minLength: 3,
                        maxLength: 15
                    }
                },
                {
                    isValid: false,
                    name: "password",
                    value: "",
                    error: "",
                    type: "password",
                    validation: {
                        required: true,
                        spaces: false,
                        minLength: 5
                    }
                },
                {
                    isValid: false,
                    name: "repeat password",
                    value: "",
                    error: "",
                    type: "password",
                    validation: {
                        matchString: "",
                        required: true,
                        spaces: false,
                        minLength: 5
                    }
                }
            ]
        };
    },
    methods: {
        async registerUser () {
            this.spinner = true;
            try {
                await this.$http.post("/api/auth/register", {
                    username: this.loginFields[0].value,
                    password: this.loginFields[1].value
                });
                bus.$emit("changeMessage", "succefully registered", "success");
                this.spinner = false;
                this.$router.push("/login");
            } catch (err) {
                const errorMsg = err.response.data.msg;
                for (const err in errorMsg) {
                    this.loginFields = this.loginFields.map(field =>
                        field.name === err
                            ? { ...field, error: errorMsg[err] }
                            : field
                    );
                }
                this.spinner = false;
            }
        },
        validateFieldLogin (fieldName, val) {
            this.loginFields = this.loginFields.map(field => {
                if (fieldName === field.name) {
                    return { ...field, isValid: val };
                } else {
                    return field;
                }
            });
        }
    },
    computed: {
        matchPassword () {
            return this.loginFields[1].value;
        },
        isReadyToSent () {
            return this.loginFields.reduce(
                (sum, next) => sum && next.isValid,
                true
            );
        }
    },
    watch: {
        matchPassword (newVal) {
            this.loginFields[2].validation.matchString = newVal;
        }
    }
};
</script>

<style lang="scss">
.register-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 25rem;

    .text-input {
        width: 20rem;

        @include mobile {
            width: 100%;
        }
    }

    .primary-btn {
        margin-top: 1rem;
        font-size: 1.5rem;
        position: relative;
        .spinner-2 {
          position: absolute;
        }
    }
}
</style>
