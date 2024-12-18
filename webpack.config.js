const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "node_modules"),
    ],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              [
                "@babel/preset-react",
                {
                  runtime: "automatic", // Enables the new JSX transform
                },
              ],
              "@babel/preset-typescript",
            ],
            plugins: [
              process.env.NODE_ENV !== "production" &&
                require.resolve("react-refresh/babel"),
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    ...(process.env.NODE_ENV !== "production"
      ? [new ReactRefreshWebpackPlugin()]
      : []),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, "public"), // Serve 'public' folder statically
        publicPath: "/", // Make it available at root
      },
    ],
    hot: true, // Enable hot reloading
    port: 3000,
    open: true,
    historyApiFallback: true, // Useful for single-page applications
  },
};
