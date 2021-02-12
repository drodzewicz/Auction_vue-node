<template>
    <div class="login-container">
        <h2 class="form-title">
            <img src="@/assets/lock-icon.svg" alt="lock" >
            <span>Login</span>
        </h2>
        <form class="login-form">
            <text-input
                v-for="field in loginFields"
                v-model="field.value"
                :key="field.name"
                :value="field.value"
                :name="field.name"
                :type="field.type"
                :validation="field.validation"
                :error="field.error"
                v-on:validateField="validateFieldLogin"
            />
            <button class="primary-btn" type="submit" :disabled="!isReadyToSent || spinner" @click="login">
                Login
                <spinner-2 v-if="spinner"/>
            </button>
            <router-link id="registration-link" to="/register">Dont't have an account ?</router-link>
        </form>
    </div>
</template>

<script>
import { TextInput } from "@/components/Inputs";
import { mapMutations } from "vuex";
import { Spinner2 } from "@/components/Spinners";

export default {
    name: "Login",
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
                        spaces: false
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
                        spaces: false
                    }
                }
            ]
        };
    },
    methods: {
        ...mapMutations(["UPDATE_USER", "UPDATE_AVATAR", "UPDATE_USERID"]),
        validateFieldLogin (fieldName, val) {
            this.loginFields = this.loginFields.map(field => {
                if (fieldName === field.name) {
                    return { ...field, isValid: val };
                } else {
                    return field;
                }
            });
        },
        async login (event) {
            event.preventDefault();
            this.spinner = true;
            try {
                const response = await this.$http.post("/api/auth/login", {
                    username: this.loginFields[0].value,
                    password: this.loginFields[1].value
                });
                this.UPDATE_USER(response.data.user.username);
                this.UPDATE_AVATAR(response.data.user.avatarImage || "");
                this.UPDATE_USERID(response.data.user.id);
                this.$sock.open();
                this.spinner = false;
                this.$router.push("/");
            } catch (error) {
                this.UPDATE_USER(null);
                this.UPDATE_USERID(null);
                if (error.response.status === 401) {
                    this.loginFields = this.loginFields.map(field => ({
                        ...field,
                        error: "bad login"
                    }));
                }
                this.spinner = false;
            }
        }
    },
    computed: {
        isReadyToSent () {
            return this.loginFields.reduce((sum, next) => sum && next.isValid, true);
        }
    }
};
</script>

<style lang="scss">
    .login-container {
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
        .login-form {
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
