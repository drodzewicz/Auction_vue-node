<template>
    <profile-sub-page title="Profile" :isLoaded="spinner">
        <div slot="content" class="profile-content">
            <VImage :imageUrl="imageLink" defaultImage="/default_avatar_image.svg" class="user-avatar" />
            <form>
                 <text-input
                    v-model="imageLink"
                    :value="imageLink"
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
            imageLink: ""
        };
    },
    methods: {
        submitImageChange (e) {
            e.preventDefault();
            console.log("submitting");
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
