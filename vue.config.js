module.exports = {
    outputDir: "~@/../server/public",
    devServer: {
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": "true" },
        host: "0.0.0.0",
        port: 8080,
        hotOnly: false
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `
        @import "~@/scss/_common.scss";
        `
            }
        }
    }
};
