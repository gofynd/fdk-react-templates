const path = require("path");
const glob = require("glob");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: () => {
    // Get all entry files using glob
    const entryFiles = glob.sync("./src/**/*.jsx", { ignore: ["**/README.*"] });
    // Create entry object dynamically
    const entry = {};
    entryFiles.forEach((file) => {
      // Adjusting the output file path to be in the 'dist' directory and maintain the relative path structure
      entry[file.replace("src", "")] = file;
    });

    return entry;
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: (chunkInfo) => {
      function getNameFromPath(path) {
        // Remove the file extension ".jsx"
        const name = path.replace(/\.jsx$/, "");

        return name;
      }
      chunkInfo.chunk.name = getNameFromPath(chunkInfo.chunk.name);
      return "[name].js";
    },
    libraryTarget: "umd",
    library: "firestone",
    umdNamedDefine: true,
    globalObject: 'typeof self !=="undefined" ? self : this',
    clean: true,
    publicPath: "./",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: (chunkInfo) => {
        function getNameFromPath(path) {
          // Remove the file extension ".jsx"
          const name = path.replace(/\.jsx$/, "");

          return name;
        }
        chunkInfo.chunk.name = getNameFromPath(chunkInfo.chunk.name);
        return "[name].css";
      },
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: true,
          keep_classnames: true,
        },
      }),
    ],
    splitChunks: {
      chunks() {
        return false;
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "defaults",
                  },
                ],
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        ],
      },
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "defaults",
                  },
                ],
                "@babel/preset-react",
              ],
            },
          },
        ],
      },
      {
        test: /\.css/,
        use: ["style-loader", "css-loader"],
      },
      // {
      // 	test: /\.css$/i,
      // 	use: [
      // 		MiniCssExtractPlugin.loader,
      // 		{
      // 			loader: 'css-loader',
      // 			options: {
      // 				modules: {
      // 					localIdentName: '[hash:base64:5]',
      // 				},
      // 			},
      // 		},
      // 		'postcss-loader',
      // 	],
      // 	exclude: /\.global\.css$/,
      // },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: false,
            },
          },
          "postcss-loader",
        ],
        include: /\.global\.css$/,
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(ttf|otf|woff|woff2|png)$/i,
        type: "asset/resource",
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]",
              },
              importLoaders: 1,
            },
          },
          "less-loader",
        ],
        exclude: /\.global\.less$/,
      },
      {
        test: /\.global\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader", // No modules configuration here
          "less-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    preferRelative: true,
  },
  externals: {
    react: "react",
    "react-router-dom": "react-router-dom",
    "fdk-core/components": "fdk-core/components",
    "fdk-core/utils": "fdk-core/utils",
    "awesome-snackbar": "awesome-snackbar",
    "react-outside-click-handler": "react-outside-click-handler",
    "react-hook-form": "react-hook-form",
    "react-range-slider-input": "react-range-slider-input",
    "card-validator": "card-validator",
    "@react-google-maps/api": "@react-google-maps/api",
    "react-google-autocomplete": "react-google-autocomplete",
    "framer-motion": "framer-motion",
    "html-react-parser": "html-react-parser",
    "google-libphonenumber": "google-libphonenumber",
    "react-international-phone": "react-international-phone",
    "@emotion/is-prop-valid": "@emotion/is-prop-valid"
  },
};