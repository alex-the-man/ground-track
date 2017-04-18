var path = require("path");

var config = {
  entry: ["./src/App.tsx"],

  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", "html"]
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.(svg|png)?$/, loader: "file-loader" }
    ]
  },

  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
};

module.exports = config;
