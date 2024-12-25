/* References:
 * https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html
 */

import { convertImageDataToDataURL, getImageDataFromFile } from "./image";

export enum DitheringMethod {
    FloydSteinberg = "floydSteinberg",
    Stucki = "stucki",
}

type ImageProcessor = (imageData: ImageData) => ImageData;
const floydSteinberg: ImageProcessor = (imageData) => {
    const data = new Uint8ClampedArray(imageData.data);
    const { width, height } = imageData;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            // Get original pixel values
            const oldR = data[idx];
            const oldG = data[idx + 1];
            const oldB = data[idx + 2];

            // Convert to binary (0 or 255)
            const newR = oldR < 128 ? 0 : 255;
            const newG = oldG < 128 ? 0 : 255;
            const newB = oldB < 128 ? 0 : 255;

            // Set new pixel values
            data[idx] = newR;
            data[idx + 1] = newG;
            data[idx + 2] = newB;

            // Calculate error
            const errR = oldR - newR;
            const errG = oldG - newG;
            const errB = oldB - newB;

            // Distribute error to neighboring pixels
            if (x + 1 < width) {
                data[idx + 4] += (errR * 7) / 16;
                data[idx + 5] += (errG * 7) / 16;
                data[idx + 6] += (errB * 7) / 16;
            }
            if (y + 1 < height) {
                if (x > 0) {
                    data[idx + width * 4 - 4] += (errR * 3) / 16;
                    data[idx + width * 4 - 3] += (errG * 3) / 16;
                    data[idx + width * 4 - 2] += (errB * 3) / 16;
                }
                data[idx + width * 4] += (errR * 5) / 16;
                data[idx + width * 4 + 1] += (errG * 5) / 16;
                data[idx + width * 4 + 2] += (errB * 5) / 16;
                if (x + 1 < width) {
                    data[idx + width * 4 + 4] += (errR * 1) / 16;
                    data[idx + width * 4 + 5] += (errG * 1) / 16;
                    data[idx + width * 4 + 6] += (errB * 1) / 16;
                }
            }
        }
    }
    return new ImageData(data, width, height);
};

const stucki: ImageProcessor = (imageData) => {
    const data = new Uint8ClampedArray(imageData.data);
    const { width, height } = imageData;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            // Similar to Floyd-Steinberg but with different error distribution
            const oldR = data[idx];
            const oldG = data[idx + 1];
            const oldB = data[idx + 2];

            const newR = oldR < 128 ? 0 : 255;
            const newG = oldG < 128 ? 0 : 255;
            const newB = oldB < 128 ? 0 : 255;

            data[idx] = newR;
            data[idx + 1] = newG;
            data[idx + 2] = newB;

            const errR = (oldR - newR) / 42;
            const errG = (oldG - newG) / 42;
            const errB = (oldB - newB) / 42;

            // Stucki error distribution pattern
            const pattern = [
                [0, 0, 0, 8, 4],
                [2, 4, 8, 4, 2],
                [1, 2, 4, 2, 1],
            ];

            for (let i = 0; i < pattern.length; i++) {
                for (let j = 0; j < pattern[i].length; j++) {
                    const factor = pattern[i][j];
                    if (factor === 0) continue;

                    const targetX = x + j - 2;
                    const targetY = y + i;

                    if (targetX >= 0 && targetX < width && targetY < height) {
                        const targetIdx = (targetY * width + targetX) * 4;
                        data[targetIdx] += errR * factor;
                        data[targetIdx + 1] += errG * factor;
                        data[targetIdx + 2] += errB * factor;
                    }
                }
            }
        }
    }
    return new ImageData(data, width, height);
};

export const ditherImage = async (file: File, ditheringMethod: DitheringMethod): Promise<string> => {
    const imageData = await getImageDataFromFile(file);
    const processor = ditheringMethod === DitheringMethod.FloydSteinberg ? floydSteinberg : stucki;
    const ditheredData = processor(imageData);
    return convertImageDataToDataURL(ditheredData);
};
