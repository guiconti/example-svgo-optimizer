const path = require("path");
const fs = require("fs");
const SVGO = require("./lib/svgo");
const svgo = new SVGO({
    plugins: [
        { removeTitle: true },
        { convertPathData: { floatPrecision: 2 } },
        { removeViewBox: false },
        {
            cleanupIDs: {
                prefix: {
                    toString() {
                        // this makes the cleaned up IDs globally unique
                        this.counter = this.counter || 0;
                        return `id-${this.counter++}`;
                    },
                },
            },
        },
        {
            optimizeRasterImage: {
                customWidthTag: 'resizedWidth',
                customHeightTag: 'resizedHeight',
            },
        },
    ],
});

const svg = fs.readFileSync(path.resolve(__dirname, "illustration.svg"));
svgo.optimize(svg, { path: path.resolve(__dirname, "illustration.svg") }).then(
    (result) => {
        fs.writeFileSync('result.svg', result.data);
    }
);
