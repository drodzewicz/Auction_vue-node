<template>
  <div class="footer">
        <a id="app-author" class="footer-item" href="https://github.com/DaRoTP">
            <img src="@/assets/user_icon.svg" alt="user" >
            <span>Author: DaRo</span>
        </a>
        <a id="app-source-code"  class="footer-item" href="https://github.com/DaRoTP/Auction_vue-node">
            <img src="@/assets/source_code_icon.svg" alt="source code" >
            <span>Source Code</span>
        </a>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss">
    .footer {
        $footer-height: 4rem;
        background: $main-dark-blue;
        color:white;
        display: flex;
        justify-content: center;
        align-items: center;
        height: $footer-height;

        .footer-item {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            margin: 0 0.4rem;
            text-decoration: none;
            color: white;
            font-size: 0.9rem;
            font-family: 'Roboto', sans-serif;
            cursor: pointer;
            img {
                margin-right: 0.5rem;
                height: 1rem;
                width: 1rem;
            }
        }
    }
</style>
