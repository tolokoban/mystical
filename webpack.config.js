const FS = require("fs")
const Path = require("path")
const package = require("./package.json")
const WorkboxPlugin = require("workbox-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WebpackShellPlugin = require("webpack-shell-plugin-next")
const CopyPlugin = require("copy-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const Webpack = require("webpack")

if (typeof package.port !== "number") {
    // Define a random port number for dev server.
    package.port = 1204 + Math.floor(Math.random() * (0xffff - 1024))
    FS.writeFileSync(
        Path.resolve(__dirname, "package.json"),
        JSON.stringify(package, null, "    ")
    )
    console.log("A random port has been set for dev server:", package.port)
}

module.exports = (env) => {
    const isProdMode = env.WEBPACK_BUILD === true
    const isTestMode = !isProdMode
    if (isProdMode) {
        console.log("+-----------------+")
        console.log("| Production Mode |")
        console.log("+-----------------+")
    }
    return {
        watchOptions: {
            // Prevent infinite compiling.
            ignored: ["./dist/**/*"],
        },
        cache: {
            type: "memory",
        },
        output: {
            clean: true,
            filename: "scr/[name].[contenthash].js",
            path: Path.resolve(__dirname, "../../../backend/www/manual"),
            assetModuleFilename: "asset/[name].[hash][ext][query]",
        },
        entry: {
            app: "./src/index.tsx",
        },
        target: "web",
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".jsx", ".wasm"],
            enforceExtension: false,
            alias: {
                "tp-lib": Path.resolve(__dirname, "../../lib/tp/src"),
                "@/ui": Path.resolve(__dirname, "../../lib/tp/src/ui"),
                "@/constants": Path.resolve(__dirname, "src/constants"),
                "@/gfx": Path.resolve(__dirname, "src/gfx"),
                "@/translate": Path.resolve(__dirname, "src/translate"),
                "@/view": Path.resolve(__dirname, "src/view"),
                "@": Path.resolve(__dirname, "src"),
                react: require.resolve("react"),
            },
        },
        devtool: isTestMode ? "inline-source-map" : false,
        devServer: {
            compress: true,
            static: {
                directory: Path.resolve(__dirname, "./public"),
            },
            client: {
                logging: "verbose",
                overlay: { errors: true, warnings: false },
                progress: true,
            },
            hot: true,
            // Open WebBrowser.
            open: true,
            port: process.env.PORT || package.port,
        },
        plugins: [
            new Webpack.ProgressPlugin(),
            new CleanWebpackPlugin({
                // We don't want to remove the "index.html" file
                // after the incremental build triggered by watch.
                cleanStaleWebpackAssets: false,
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: Path.resolve(__dirname, "public"),
                        filter: async (path) => {
                            return !path.endsWith("index.html")
                        },
                    },
                ],
            }),
            new HtmlWebpackPlugin({
                meta: {
                    viewport:
                        "width=device-width, initial-scale=1, shrink-to-fit=no",
                    "theme-color": "#56abff",
                },
                template: "public/index.html",
                filename: "index.html",
                title: package.name,
                version: package.version,
            }),
            new WorkboxPlugin.GenerateSW({
                // These options encourage the ServiceWorkers to get in there fast
                // and not allow any straggling "old" SWs to hang around.
                clientsClaim: true,
                skipWaiting: true,
            }),
        ],
        optimization: {
            // Create a single runtime bundle for all chunks.
            runtimeChunk: "single",
            splitChunks: {
                // All the node_modules libs on a single file.
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "libs",
                        chunks: "all",
                    },
                },
            },
            // Prevent "libs.[contenthash].js" from changing its hash if not needed.
            moduleIds: "deterministic",
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                transpileOnly: false,
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: [
                        // devMode ?
                        {
                            loader: "style-loader",
                            options: {
                                injectType: "styleTag",
                            },
                        },
                        // : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {},
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|webp|svg)$/i,
                    // More information here https://webpack.js.org/guides/asset-modules/
                    type: "asset",
                    generator: {
                        filename: "img/[name].[hash][ext][query]",
                    },
                },
                {
                    test: /\.(eot|ttf|woff|woff2)$/i,
                    // More information here https://webpack.js.org/guides/asset-modules/
                    type: "asset/resource",
                    generator: {
                        filename: "fnt/[name].[hash][ext][query]",
                    },
                },
                {
                    test: /\.ya?ml$/,
                    type: "json",
                    use: "yaml-loader",
                },
            ],
        },
    }
}
