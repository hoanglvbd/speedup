module.exports = {
    future: {
        // removeDeprecatedGapUtilities: true,
        // purgeLayersByDefault: true,
        // defaultLineHeights: true,
        // standardFontWeights: true
    },
    purge: [],
    theme: {
        extend: {
            colors: {
                main: "#5e338c",
                main_darker: "#4a0099",
                main_lighter: "#a572db"
            },
            maxHeight: {
                56: "14rem"
            },
            spacing: {
                72: "18rem",
                84: "21rem",
                90: "22.5rem",
                96: "24rem",
                108: "27rem",
                120: "30rem",
                132: "33rem",
                144: "36rem",
                156: "39rem",
                168: "42rem",
                172: "44rem",
                174: "45rem",
                176: "48rem"
            }
        }
    },
    plugins: [],
    variants: {},
    /*  corePlugins: {
        container: false,
    }, */
    purge: [
        "./storage/framework/views/*.php",
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.vue"
    ]
};
