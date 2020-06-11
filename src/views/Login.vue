<template>
    <div class="box">
        <div class="login-container">
            <h2>Login</h2>

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

            <button class="primary-btn" type="submit" :disabled="!isReadyToSent" @click="login">Login</button>
        </div>
    </div>
</template>

<script>
import { TextInput } from "@/components/Inputs";
import { mapMutations, mapGetters } from "vuex";
export default {
    name: "Login",
    components: {
        TextInput
    },
    data () {
        return {
            loginFields: [
                {
                    isValid: false,
                    name: "username",
                    value: "",
                    error: "",
                    validation: {
                        required: true,
                        spaces: false
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
                        spaces: false
                    }
                }
            ]
        };
    },
    methods: {
        ...mapGetters(["getUser"]),
        ...mapMutations(["UPDATE_USER"]),
        validateFieldLogin (fieldName, val) {
            this.loginFields = this.loginFields.map(field => {
                if (fieldName === field.name) {
                    return { ...field, isValid: val };
                } else {
                    return field;
                }
            });
        },
        async login () {
            try {
                const response = await this.$http.post("/api/auth/login", {
                    username: this.loginFields[0].value,
                    password: this.loginFields[1].value
                });
                this.$sock.open();
                this.UPDATE_USER(response.data.user.username);
                this.$router.push("/");
            } catch (error) {
                this.UPDATE_USER(null);
                if (error.response.status === 401) {
                    this.loginFields = this.loginFields.map(field => ({
                        ...field,
                        error: "bad login"
                    }));
                }
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
    }
}
</style>
