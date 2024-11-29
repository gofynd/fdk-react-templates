# FDK React Templates

## Overview

FDK React Templates is a React component library designed specifically for Skyfire. It includes a collection of reusable components, tools, and utilities to streamline the development process. This library is built with Webpack to handle JavaScript, TypeScript, CSS, and other assets, making it efficient and easy to maintain.

## Features

- **Dynamic Entry Points:** Automatically includes all `.jsx` files from the `src` directory.
- **Optimized Output Configuration:** Outputs files to the `dist` directory, maintaining the relative path structure.
- **Support for CSS and Less:** Handles both CSS modules and global CSS, as well as Less files.
- **Comprehensive Asset Management:** Supports various asset types including fonts and SVGs.
- **Powerful Plugins:** Utilizes `CleanWebpackPlugin` and `MiniCssExtractPlugin` for efficient build processes.
- **Advanced Optimization:** Configured with Terser for JavaScript minification and optimized chunk splitting.

## Installation

### Prerequisites

- Node.js (v18 or later recommended)
- npm (v8 or later)
- fdk-cli
- All the external packages in themes node modules 
### Installation Steps For Use

1. Install the package in react theme repositary.
    ````bash
    npm install github:gofynd/fdk-react-templates.git#V.X.X.X
    ````
    Replace V.X.X.X.X with proper version.
    Example : 
    
    ````bash 
    npm install github:gofynd/fdk-react-templates.git#V.1.0.0
    ````
2. Use in your Component 
    ```jsx
    import ProductListing from "fdk-react-templates/Astra/pages/product-listing/product-listing.js";
    ````

### Installation Steps For development 

1. Clone the repository:
   ```bash
   git clone https://github.com/gofynd/fdk-react-templates.git
   cd fdk-react-templates
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Build for Production

To build the project for production, run:
```bash
npm run build
```
This will generate the output in the `dist` directory.

### Development

For development, use:
To test locally package in your local system before publishing npm package in your local theme repo, run: \r
```bash
npm i "src url of fdk-react-templates"
```

This will install the development package in your projects node_modules.

## Project Structure

- **src/**: Source files including JavaScript/TypeScript, CSS, Less, and assets.
- **dist/**: Output directory for the production build.
- **webpack.config.js**: Webpack configuration file.

## Webpack Configuration

### Entry Points

The entry points are dynamically generated by including all `.jsx` files from the `src` directory:
```javascript
entry: () => {
    const entryFiles = glob.sync('./src/**/*.jsx');
    const entry = {};
    entryFiles.forEach(file => {
        entry[file.replace('src', '')] = file;
    });
    return entry;
},
```

### Output

The output is configured to generate files in the `dist` directory, maintaining the relative path structure:
```javascript
output: {
    path: path.resolve(__dirname, "dist"),
    filename: (chunkInfo) => {
        const getNameFromPath = (path) => path.replace(/\.jsx$/, "");
        chunkInfo.chunk.name = getNameFromPath(chunkInfo.chunk.name);
        return '[name].js';
    },
    libraryTarget: "umd",
    library: "firestone",
    umdNamedDefine: true,
    globalObject: 'typeof self !=="undefined" ? self : this',
    clean: true,
    publicPath: './',
},
```

### Plugins

The configuration includes several plugins to enhance the build process:
- `CleanWebpackPlugin`: Cleans the `dist` directory before each build.
- `MiniCssExtractPlugin`: Extracts CSS into separate files, supporting both modules and global CSS.

### Loaders

Various loaders are configured to handle different types of files:
- `babel-loader`: Transpiles JavaScript and TypeScript files using Babel presets.
- `css-loader`, `style-loader`, `postcss-loader`: Handles CSS files with support for CSS modules.
- `less-loader`: Compiles Less files, with support for both modules and global styles.
- `@svgr/webpack`: Processes SVG files to be used as React components.
- `asset/resource`: Manages font files and other static assets.

### Externals

Certain libraries are treated as external dependencies to reduce the bundle size So make sure to add them in your package.json:
```javascript
externals: {
    react: "react",
    "react-router-dom": "react-router-dom",
    'fdk-core/components': 'fdk-core/components',
    'fdk-core/utils': 'fdk-core/utils',
    'awesome-snackbar': 'awesome-snackbar',
    'react-outside-click-handler': 'react-outside-click-handler'
}
```

### Optimization

The project uses Terser for minification and optimizes chunk splitting:
```javascript
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
}
```
## Components 

1. [Blog](src/pages/blog/README.md)
2. [Cart](src/pages/cart/README.md)
3. [Checkout](src/pages/checkout/README.md)
4. [ContactUs](src/pages/contact-us/README.md)
5. [EditProfile](src/pages/edit-profile/README.md)
6. [Faq](src/pages/faq/README.md)
7. [ForgotPassword](src/pages/forgot-password/README.md)
8. [Login](src/pages/login/README.md)
9. [OrderStatus](src/pages/order-status/README.md)
10. [Order](src/pages/order/README.md)
11. [ProductListing](src/pages/product-listing/README.md)
12. [Profile](src/pages/profile/README.md)
13. [UserRegister](src/pages/register/README.md)
14. [SetPassword](src/pages/set-password/README.md)
15. [SharedCart](src/pages/shared-cart/README.md)
16. [VerifyEmail](src/pages/verify-email/README.md)
17. [Wishlist](src/pages/wishlist/README.md)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact

For any questions or feedback, please contact Prashant Pandey at [prashantpandey@gofynd.com](mailto:prashantpandey@gofynd.com).

---

This README provides a detailed overview of the FDK React Templates library, including installation, usage, and configuration details. Ensure to update any placeholders with actual information specific to your project.