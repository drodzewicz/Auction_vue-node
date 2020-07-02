<template>
    <div class="box">
        <div class="new-auction-container">
            <h2>Create new auction</h2>

            <text-input
                v-for="field in mainFields"
                v-model="field.value"
                :key="field.name"
                :value="field.value"
                :name="field.name"
                :type="field.type"
                :required="field.validation.required"
                :validation="field.validation"
                v-on:validateField="vallidateAuctionFields"
            />
            <area-text
                v-model="description.value"
                :value="description.value"
                :name="description.name"
                :validation="description.validation"
                :required="description.validation.required"
                v-on:validateField="vallidateAuctionFields"
            />
            <switch-button v-model="isAuction" trueLabel="buy now" falseLabel="auction" />
            <div class="end-date-container" :class="{open: isAuction}">
                <text-input
                    v-for="field in dateFields"
                    v-model="field.value"
                    :key="field.name"
                    :value="field.value"
                    :name="field.name"
                    :type="field.type"
                    :required="field.validation.required"
                    :validation="field.validation"
                    v-on:validateField="vallidateAuctionFields"
                />
            </div>

            <button class="primary-btn" type="submit" :disabled="!isReadyToSent || spinner" @click="createAuction">
              Create
              <spinner-2 v-if="spinner"/>
            </button>
        </div>
    </div>
</template>

<script>
import { TextInput, AreaText, SwitchButton } from "@/components/Inputs";
import { mapGetters } from "vuex";
import { bus } from "../main";
import { Spinner2 } from "@/components/Spinners";
export default {
    name: "NewAuction",
    components: {
        TextInput,
        AreaText,
        Spinner2,
        SwitchButton
    },
    data () {
        return {
            spinner: false,
            mainFields: [
                {
                    isValid: true,
                    name: "image link",
                    value: "",
                    validation: {
                        spaces: true
                    }
                },
                {
                    isValid: false,
                    name: "name",
                    value: "",
                    validation: {
                        required: true
                    }
                },
                {
                    isValid: false,
                    name: "starting price",
                    value: "",
                    type: "Number",
                    validation: {
                        required: true,
                        spaces: true
                    }
                },
                {
                    isValid: true,
                    name: "tags",
                    value: "",
                    validation: {}
                }
            ],
            description: {
                isValid: false,
                name: "description",
                value: "",
                validation: {
                    required: true
                }
            },
            isAuction: true,
            dateFields: [
                {
                    isValid: false,
                    name: "start date",
                    value: "",
                    type: "Date",
                    validation: {
                        required: true
                    }
                },
                {
                    isValid: false,
                    name: "start time",
                    value: "",
                    type: "Time",
                    validation: {
                        required: true
                    }
                },
                {
                    isValid: false,
                    name: "end date",
                    value: "",
                    type: "Date",
                    validation: {
                        required: true
                    }
                },
                {
                    isValid: false,
                    name: "end time",
                    value: "",
                    type: "Time",
                    validation: {
                        required: true
                    }
                }
            ]
        };
    },
    created () {},
    methods: {
        ...mapGetters(["getUser"]),
        async createAuction () {
            this.spinner = true;
            try {
                const response = await this.$http.post("/api/auction", {
                    image: this.mainFields[0].value,
                    name: this.mainFields[1].value,
                    price: parseFloat(this.mainFields[2].value),
                    tags: this.mainFields[3].value.split(" "),
                    description: this.description.value,
                    startDate: this.isAuction ? `${this.dateFields[0].value} ${this.dateFields[1].value}` : undefined,
                    endDate: this.isAuction ? `${this.dateFields[2].value} ${this.dateFields[3].value}` : undefined
                });
                this.spinner = false;
                this.$router.push(`/auction/${response.data.auction._id}`);
            } catch (err) {
                let errorMsg = "something went wrong";
                if (err.response.data.msg.endDate !== undefined) {
                    errorMsg = err.response.data.msg.endDate;
                } else if (err.response.data.msg.startDate !== undefined) {
                    errorMsg = err.response.data.msg.startDate;
                }
                bus.$emit("changeMessage", errorMsg, "error");
                this.spinner = false;
            }
        },
        vallidateAuctionFields (fieldName, val) {
            if (fieldName === "description") {
                this.description.isValid = val;
            }
            this.mainFields = this.mainFields.map(field => {
                if (fieldName === field.name) {
                    return { ...field, isValid: val };
                } else {
                    return field;
                }
            });
            this.dateFields = this.dateFields.map(field => {
                if (fieldName === field.name) {
                    return { ...field, isValid: val };
                } else {
                    return field;
                }
            });
        }
    },
    computed: {
        isReadyToSent () {
            const mainFieldValid = this.mainFields.reduce((sum, next) => sum && next.isValid, true);
            let dateFieldsValidation = this.dateFields.reduce((sum, next) => sum && next.isValid, true);
            dateFieldsValidation = this.isAuction ? dateFieldsValidation : true;
            const descriptionValid = this.description.isValid;
            return mainFieldValid && descriptionValid && dateFieldsValidation;
        }
    }
};
</script>

<style lang="scss">
.new-auction-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .switch-container {
        margin: 1rem;
    }

    .text-input,
    .text-area {
        width: 20rem;
        @include mobile {
            width: 100%;
        }
    }
    .text-area {
        justify-self: center;
        height: 8rem;
        textarea {
            height: 7rem;
        }
    }

    .primary-btn {
        margin-top: 1rem;
        font-size: 1.5rem;
    }

    .end-date-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-column-gap: 1rem;
        width: 20rem;
        height: 0;
        overflow-y: hidden;
        transition: all 0.5s ease-in-out;
        margin-bottom: 1rem;

        @include mobile {
            grid-template-columns: 1fr;
        }

        .text-input {
            width: auto;
        }

        &.open {
            height: 10rem;
            @include mobile {
                height: 22rem;
            }
        }
    }
}
</style>
