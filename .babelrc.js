
module.exports = {
    "presets": ["next/babel"],
    "plugins": [
        [
            "babel-plugin-styled-components",
            {
                "ssr": true,
                "displayName": process.env.NODE_ENV === 'development',
                "fileName": process.env.NODE_ENV === 'development',
            }
        ],
        [
            "@babel/plugin-proposal-decorators",
            {
              "legacy": true
            }
        ],
    ]
}
