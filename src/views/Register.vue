<template>
    <div class="register-container">
            <h2 class="form-title">
                 <img src="@/assets/user-icon-2.svg" alt="user" >
                <span>Register</span>
            </h2>
            <form class="register-form">
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
                <button class="primary-btn" type="submit" :disabled="!isReadyToSent || spinner" @click="registerUser">
                    Register
                    <spinner-2 v-if="spinner" />
                </button>
            </form>
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
                    name: "Username",
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
                    name: "Password",
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
                    name: "Repeat password",
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
        async registerUser (event) {
            event.preventDefault();
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
                if (err.response.data.err) this.loginFields[0].error = err.response.data.msg.username || "";
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
        margin-top: 3rem;

        .form-title {
            $font-size: 1.3rem;
             background: #ECEBF1;
             color: $main-dark-blue;
             padding: 0.2rem 1rem;
             border-radius: 5px;
             display: flex;
             flex-direction: row;
             place-items: center;
             margin-bottom: 2rem;
             img {
                 height: $font-size;
                 width: $font-size;
                 margin-right: 0.4rem;
             }
             span {
                 font-size: $font-size;
             }
        }
        .register-form {
            min-width: 15rem;
            max-width: 50rem;
            display: flex;
            flex-direction: column;
            .primary-btn {
                align-self: center;
                .spinner-2 {
                    position: absolute;
                }
            }
        }
        #registration-link {
            color: $main-dark-blue;
            align-self: center;
            font-size: 0.9rem;
            margin-top: 1.5rem;
        }
    }
</style>
