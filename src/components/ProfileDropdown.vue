<template>
  <div class="profile drop-down-wrapper" >
    <button class="button-wrapper" @click="toggleOpenDropDown">
        <slot  name="profile-btn"></slot>
    </button>
    <div v-if="isOpen" class="drop-down">
        <router-link to="/profile" @click.native="toggleOpenDropDown">Profile</router-link>
        <button @click="logOutUser">Logout</button>
    </div>
  </div>
</template>

<script>
export default {
    name: "ProfileDropdown",
    data () {
        return {
            isOpen: false
        };
    },
    methods: {
        toggleOpenDropDown () {
            this.isOpen = !this.isOpen;
        },
        logOutUser () {
            this.toggleOpenDropDown();
            this.$store.dispatch("LOGOUT");
        }
    }
};
</script>

<style lang="scss">
.drop-down-wrapper {
    .button-wrapper {
        border: none;
        background: transparent;
    }
}
 .drop-down {
     z-index: 99;
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     position: absolute;
     top: 3.7rem;
     background: white;
     width: 5.5rem;
     border-radius: 5px;
     overflow: hidden;
     box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.205);
      & > * {
        box-sizing: border-box;
        color: black;
        transition: all ease-in-out 0.2s;
        cursor: pointer;
        text-align: center;
        width: 100%;
        padding: 0.2rem 0.4rem;
        border: none;
        text-decoration: none;
        font-size: 1rem;
        font-family: 'Secular One', sans-serif;
        background: white;

        &:hover {
            background: rgb(239, 238, 241);
        }
      }
 }
</style>
