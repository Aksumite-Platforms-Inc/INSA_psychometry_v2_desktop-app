const rules = require('./webpack.rules');
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

rules.push({
  test: /styles\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules: [
      {
        test: /\.css$/, // Process CSS files
        use: [
          "style-loader", // Injects styles into DOM
          "css-loader", // Resolves CSS imports
          "postcss-loader", // Processes Tailwind CSS via PostCSS
        ],
      },
      {
        test: /\.(ts|tsx)$/, // Handle TypeScript and TSX files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
  },
};
