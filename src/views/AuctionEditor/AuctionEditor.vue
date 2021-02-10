<template>
        <div class="auction-editor-container">
            <form class="auction-editor-form">
                <div class="column-container">
                    <div class="primary-fields field-col">
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
                    </div>
                    <div class="seccondary-fields field-col">
                        <v-image class="product-image" :imageUrl="imageURL.value" />
                        <text-input
                            v-model="imageURL.value"
                            :value="imageURL.value"
                            :name="imageURL.name"
                            :type="imageURL.type"
                            :required="imageURL.validation.required"
                            :validation="imageURL.validation"
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
                    </div>
                </div>
                <div class="button-container">
                    <button class="primary-btn" type="submit" :disabled="!isReadyToSent || spinner" @click="submitFunction">
                        Submit
                        <spinner-2 v-if="spinner"/>
                    </button>
                    <button v-if="method==='UPDATE'" class="secondary-btn" type="button" @click="deleteProduct">
                        Delete Product
                    </button>
                </div>
            </form>
        </div>
</template>

<script>
import { TextInput, AreaText, SwitchButton } from "@/components/Inputs";
import { mapGetters } from "vuex";
import { Spinner2 } from "@/components/Spinners";
import VImage from "@/components/VImage";
import { bus } from "@/main";

export default {
    name: "AuctionEditor",
    components: {
        TextInput,
        AreaText,
        Spinner2,
        VImage,
        SwitchButton
    },
    data () {
        return {
            spinner: false,
            author: null,
            imageURL: {
                isValid: true,
                name: "Image link",
                value: "",
                validation: {
                    spaces: true
                }
            },
            mainFields: [
                {
                    isValid: false,
                    name: "Name",
                    value: "",
                    validation: {
                        required: true
                    }
                },
                {
                    isValid: false,
                    name: "Starting price",
                    value: "",
                    type: "Number",
                    validation: {
                        required: true,
                        spaces: true
                    }
                },
                {
                    isValid: true,
                    name: "Tags",
                    value: "",
                    validation: {}
                }
            ],
            description: {
                isValid: false,
                name: "Description",
                value: "",
                validation: {
                    required: true
                }
            },
            isAuction: false,
            dateFields: [
                {
                    isValid: false,
                    name: "Start date",
                    value: "",
                    type: "Date",
                    validation: {
                        required: true
                    }
                },
                {
                    isValid: false,
                    name: "Start time",
                    value: "",
                    type: "Time",
                    validation: {
                        required: true
                    }
                },
                {
                    isValid: false,
                    name: "End date",
                    value: "",
                    type: "Date",
                    validation: {
                        required: true
                    }
                },
                {
                    isValid: false,
                    name: "End time",
                    value: "",
                    type: "Time",
                    validation: {
                        required: true
                    }
                }
            ]
        };
    },
    props: {
        method: {
            type: String,
            default: "CREATE"
        }
    },
    created () {
        if (this.method === "UPDATE") {
            this.getAuctionInfo();
        }
    },
    methods: {
        ...mapGetters(["GET_USER"]),
        submitFunction (event) {
            event.preventDefault();
            const formData = {
                name: this.mainFields[0].value,
                description: this.description.value,
                tags: this.mainFields[2].value.split(" "),
                image: this.imageURL.value,
                price: parseFloat(this.mainFields[1].value),
                startDate: this.isAuction ? `${this.dateFields[0].value} ${this.dateFields[1].value}` : undefined,
                endDate: this.isAuction ? `${this.dateFields[2].value} ${this.dateFields[3].value}` : undefined
            };
            this.$emit("submitData", formData);
        },
        deleteProduct () {
            const shouldDelete = window.confirm("are you sure you want to delete this product?");
            if (shouldDelete) {
                this.$emit("deleteProduct");
            }
        },
        async getAuctionInfo () {
            try {
                const response = await this.$http.get(`/api/auction/${this.$route.params.id}`);
                const { author, buyer, name, description, image, price, tags, endDate, startDate } = response.data;
                this.author = author.username;
                this.buyer = buyer !== undefined ? buyer.username : undefined;

                this.imageURL = { ...this.imageURL, value: image, isValid: true };
                this.mainFields[0] = { ...this.mainFields[0], value: name, isValid: true };
                this.mainFields[1] = { ...this.mainFields[1], value: price.toString(), isValid: true };
                this.mainFields[2] = { ...this.mainFields[2], value: tags.join(" "), isValid: true };

                this.description = { ...this.description, value: description, isValid: true };
                this.isAuction = endDate !== undefined;

                if (endDate !== undefined) {
                    this.startDate = new Date(startDate);
                    this.dateFields[0].value = startDate !== undefined ? startDate.substring(0, 10) : "";
                    this.dateFields[0].isValid = true;
                    this.dateFields[1].value = startDate !== undefined ? new Date(startDate).toLocaleTimeString("it-IT") : "";
                    this.dateFields[1].isValid = true;
                    this.dateFields[2].value = startDate !== undefined ? endDate.substring(0, 10) : "";
                    this.dateFields[2].isValid = true;
                    this.dateFields[3].value = startDate !== undefined ? new Date(endDate).toLocaleTimeString("it-IT") : "";
                    this.dateFields[3].isValid = true;
                }

                if (!this.isUserAuthor) {
                    bus.$emit("changeMessage", "you are not authorized to do this", "error");
                    this.$router.replace("/");
                } else if (!this.isEditable) {
                    bus.$emit("changeMessage", "you can't edit this auction", "error");
                    this.$router.replace("/");
                } else if (this.isStarted) {
                    bus.$emit("changeMessage", "you can't edit auction that has already started", "error");
                    this.$router.replace("/");
                }
            } catch (error) {
                bus.$emit("changeMessage", "failed to load auction", "error");
                this.$router.replace("/error-notfound");
            }
        },
        vallidateAuctionFields (fieldName, val) {
            if (fieldName === "Description") {
                this.description.isValid = val;
            }
            if (fieldName === "Image link") {
                this.imageURL.isValid = val;
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
        },
        isUserAuthor () {
            return this.GET_USER().username === this.author;
        },
        isStarted () {
            const timeNow = new Date();
            return timeNow >= this.startDate;
        },
        isEditable () {
            return (!this.isStarted && this.isUserAuthor && (this.buyer === "" || this.buyer === undefined)
            );
        }
    }
};
</script>

<style lang="scss">
 .auction-editor-container {
     margin-top: 4rem;
     .auction-editor-form {
         margin-bottom: 1rem;
         position: relative;
         .column-container {
             display: flex;
             justify-content: center;
             flex-direction: row;
             @include mobile {
                 align-items: center;
                flex-direction: column;
             }
            .field-col {
                max-width: 20rem;
                width: 100%;
                display: flex;
                margin: 0 1rem;
                flex-direction: column;
                .switch-container {
                    width: 20rem;
                    margin-bottom: 1rem;
                }
                .text-area {
                    flex-grow: 1;
                    textarea {
                        height: 100%;
                    }
                    margin-bottom: 1rem;
                }
            }
         }

         .button-container {
             display: flex;
             align-items: center;
             justify-content: center;
             margin-top: 1rem;
             .secondary-btn {
                 margin-left: 1rem;
             }
         }
         .product-image {
             margin-bottom: 1rem;;
             height: 13rem;
             width: 20rem;
             object-fit: cover;
             box-shadow: 0 1px 3px 2px rgba(0, 0, 0, 0.24);
             border-radius: 5px;
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
 }
</style>
