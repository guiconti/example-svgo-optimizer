"use strict";
const forceSync = require("sync-rpc");
const optimizeImage = forceSync(require.resolve("../lib/optimizeImage"));

const hrefAttr = "href";
const oldHrefAttr = "xlink:href";

exports.type = "perItem";

exports.active = false;

exports.description = "optimize raster image";

/**
 * Optimize raster images
 * Size and/or Quality
 * (only if there are custom tags on the image tag).
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @param {Object} params.customWidthTag custom image tag to define the optimized image's width
 * @param {Object} params.customHeightTag custom image tag to define the optimized image's height
 *
 * @author Guilherme Conti
 */
exports.fn = async function (item, params) {
    if (
        item.isElem("image") &&
        (item.hasAttrLocal(hrefAttr, /(\.|image\/)(jpg|png|gif)/) ||
            item.hasAttrLocal(oldHrefAttr, /(\.|image\/)(jpg|png|gif)/)) &&
        item.hasAttrLocal("width", /^\d+$/) &&
        item.hasAttrLocal("height", /^\d+$/)
    ) {
        let optimizedWidth = parseInt(item.attrs.width.value);
        let optimizedHeight = parseInt(item.attrs.height.value);
        const currentHrefAttr = item.attrs[hrefAttr] ? hrefAttr : oldHrefAttr;
        if (
            params.customWidthTag &&
            item.hasAttrLocal(params.customWidthTag, /^\d+$/)
        ) {
            optimizedWidth = parseInt(item.attrs[params.customWidthTag].value);
        }
        if (
            params.customHeightTag &&
            item.hasAttrLocal(params.customHeightTag, /^\d+$/)
        ) {
            optimizedHeight = parseInt(
                item.attrs[params.customHeightTag].value
            );
        }
        const currentBase64Image = item.attrs[currentHrefAttr].value;
        const parts = currentBase64Image.split(";");
        const mimeType = parts[0].split(":")[1];
        const imageData = parts[1].split(",")[1];
        const currentImage = new Buffer.from(imageData, "base64");
        const optimizedImage = optimizeImage({
            image: currentImage,
            mimeType,
            optimizedWidth,
            optimizedHeight,
        });
        item.attrs[currentHrefAttr].value = optimizedImage;
    }
};
