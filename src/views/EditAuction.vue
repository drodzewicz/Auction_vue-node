<template>
    <div class="box">
        <div class="new-auction-container">
            <h2>Edit Auction</h2>
            <button
                class="secondary-btn delete-btn"
                type="submit"
                @click="deleteAuction"
            >Delete Auction</button>
            <text-input
                v-for="field in mainFields"
                v-model="field.value"
                :key="field.name"
                :value="field.value"
                :name="field.name"
                :type="field.type"
                :required="field.validation.required"
                :validation="field.validation"
                v-on:validateField="validateAuctionFields"
            />
            <area-text
                v-model="description.value"
                :value="description.value"
                :name="description.name"
                :required="description.required"
                :validation="description.validation"
                v-on:validateField="validateAuctionFields"
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
                    v-on:validateField="validateAuctionFields"
                />
            </div>

            <button class="primary-btn" type="submit" @click="updateAuction" :disabled="!isReadyToUpdate || spinner">
              Update
              <spinner-2 v-if="spinner"/>
            </button>
        </div>
    </div>
</template>

<script>
import { TextInput, AreaText, SwitchButton } from "@/components/Inputs";
import { mapGetters } from "vuex";
import { Spinner2 } from "@/components/Spinners";
import { bus } from "../main";

export default {
    name: "EditAuction",
    components: {
        TextInput,
        AreaText,
        Spinner2,
        SwitchButton
    },
    data () {
        return {
            spinner: false,
            id: "",
            author: "",
            buyer: "",
            startDate: "",
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
                    isValid: true,
                    name: "name",
                    value: "",
                    validation: {
                        required: true
                    }
                },
                {
                    isValid: true,
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
                isValid: true,
                name: "description",
                value: "",
                validation: {
                    required: true
                }
            },
            isAuction: true,
            dateFields: [
                {
                    isValid: true,
                    name: "start date",
                    value: "",
                    type: "Date",
                    validation: {
                        required: true
                    }
                },
                {
                    isValid: true,
                    name: "start time",
                    value: "",
                    type: "Time",
                    validation: {
                        required: true
                    }
                },
                {
                    isValid: true,
                    name: "end date",
                    value: "",
                    type: "Date",
                    validation: {
                        required: true
                    }
                },
                {
                    isValid: true,
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
    created () {
        this.getAuctionInfo();
    },
    methods: {
        ...mapGetters(["getUser"]),
        async getAuctionInfo () {
            try {
                const response = await this.$http.get(`/api/auction/${this.$route.params.id}`);
                const { _id, author, buyer, name, description, image, price, tags, endDate, startDate } = response.data;
                this.id = _id;
                this.author = author.username;
                this.buyer = buyer !== undefined ? buyer.username : undefined;

                this.mainFields[0].value = image;
                this.mainFields[1].value = name;
                this.mainFields[2].value = price.toString();
                this.mainFields[3].value = tags.join(" ");

                this.description.value = description;
                this.isAuction = endDate !== undefined;

                this.startDate = new Date(startDate);
                this.dateFields[0].value = startDate !== undefined ? startDate.substring(0, 10) : "";
                this.dateFields[1].value = startDate !== undefined ? new Date(startDate).toLocaleTimeString("it-IT") : "";
                this.dateFields[2].value = startDate !== undefined ? endDate.substring(0, 10) : "";
                this.dateFields[3].value = startDate !== undefined ? new Date(endDate).toLocaleTimeString("it-IT") : "";

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
        async updateAuction () {
            const updatedAuction = {
                name: this.mainFields[1].value,
                description: this.description.value,
                tags: this.mainFields[3].value.split(" "),
                image: this.mainFields[0].value,
                price: parseFloat(this.mainFields[2].value),
                startDate: this.isAuction ? `${this.dateFields[0].value} ${this.dateFields[1].value}` : undefined,
                endDate: this.isAuction ? `${this.dateFields[2].value} ${this.dateFields[3].value}` : undefined
            };
            try {
                const response = await this.$http.put(`/api/auction/${this.id}`, updatedAuction);
                bus.$emit("changeMessage", "succesfully updated auction", "success");
                this.$router.push(`/auction/${response.data.auction._id}`);
            } catch (error) {
                let errorMsg = "something went wrong";
                if (error.response.data.msg.endDate !== undefined) {
                    errorMsg = error.response.data.msg.endDate;
                } else if (error.response.data.msg.startDate !== undefined) {
                    errorMsg = error.response.data.msg.startDate;
                }
                bus.$emit("changeMessage", errorMsg, "error");
            }
        },
        async deleteAuction () {
            try {
                const response = await this.$http.delete(`/api/auction/${this.$route.params.id}`);
                bus.$emit("changeMessage", response.data.msg, "success");
                this.$router.push("/profile/my-auctions");
            } catch (error) {
                if (error.response.data.msg !== "" || error.response.data.msg !== undefined) {
                    bus.$emit("changeMessage", error.response.data.msg, "error");
                }
            }
        },
        validateAuctionFields (fieldName, val) {
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
        isReadyToUpdate () {
            const mainFieldValid = this.mainFields.reduce((sum, next) => sum && next.isValid, true);
            let dateFieldsValidation = this.dateFields.reduce((sum, next) => sum && next.isValid, true);
            dateFieldsValidation = this.isAuction ? dateFieldsValidation : true;
            const descriptionValid = this.description.isValid;
            return mainFieldValid && descriptionValid && dateFieldsValidation;
        },
        isUserAuthor () {
            return this.getUser() === this.author;
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
.new-auction-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .delete-btn {
        margin: 1rem 0;
    }

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
