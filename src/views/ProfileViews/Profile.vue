<template>
    <profile-sub-page title="Profile" :isLoaded="spinner">
        <div slot="content" class="profile-content">
            <VImage :imageUrl="GET_USER().avatar" defaultImage="/default_avatar_image.svg" class="user-avatar" />
            <form>
                 <text-input
                    v-model="newImage"
                    :value="newImage"
                    name="avatar url"
                />
                <button class="primary-btn" type="submit" :disabled="spinner" @click="submitImageChange">
                    Update avatar
                    <spinner-2 v-if="spinner"/>
                </button>
            </form>
        </div>
    </profile-sub-page>
</template>

<script>
import ProfileSubPage from "./ProfileSubPage";
import VImage from "@/components/VImage";
import { TextInput } from "@/components/Inputs";
import { Spinner2 } from "@/components/Spinners";
import { mapGetters } from "vuex";

export default {
    name: "Profile",
    components: {
        ProfileSubPage,
        VImage,
        Spinner2,
        TextInput
    },
    data () {
        return {
            spinner: false,
            newImage: ""
        };
    },
    methods: {
        ...mapGetters(["GET_USER"]),
        async submitImageChange (e) {
            e.preventDefault();
            try {
                await this.$http.put("/api/user/changeAvatar", { avatarImage: this.newImage });
                this.$store.commit("UPDATE_AVATAR", this.newImage);
            } catch (error) {
                console.log("ERRR");
            }
        }
    }
};
</script>

<style lang="scss">
    .profile-content {
        display: flex;
        flex-direction: column;
        .user-avatar {
            object-fit: cover;
            height: 10rem;
            width: 10rem;
            margin-bottom: 0.5rem;
            border-radius: 5px;
        }
    }
</style>
