module.exports = function(api){
  api.cache(false);
  return {
   
    "presets": [
      ["@babel/preset-env", {
        "useBuiltIns": "usage",
        "corejs": 2,
        "targets": {
          "ie": "9"
        }
      }]
    ],
    "plugins": [
      "@babel/plugin-proposal-class-properties"
    ],
    "minified": false
  }
}