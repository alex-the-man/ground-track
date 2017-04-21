var path = require("path");

var config = {
  entry: ["./src/components/App.tsx"],

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },

  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
};

module.exports = config;
