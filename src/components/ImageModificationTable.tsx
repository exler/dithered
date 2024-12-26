import type React from "react";
import { useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";
import { convertImageDataToBlob } from "../utils/image";

type FileSizes = {
    [key: string]: number;
};

interface FileComparisonProps {
    originalFileSize: number;
    originalImageData: ImageData | null;
    ditheredImageData: ImageData | null;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
};

const FileComparison: React.FC<FileComparisonProps> = ({ originalFileSize, originalImageData, ditheredImageData }) => {
    const [fileSizes, setFileSizes] = useState<FileSizes>({
        jpeg: 0,
        png: 0,
    });

    useEffect(() => {
        const calculateSizes = async () => {
            if (!originalImageData || !ditheredImageData) return;

            try {
                const [modifiedJpeg, modifiedPng] = await Promise.all([
                    convertImageDataToBlob(ditheredImageData, "image/jpeg"),
                    convertImageDataToBlob(ditheredImageData, "image/png"),
                ]);

                setFileSizes({
                    jpeg: modifiedJpeg.size,
                    png: modifiedPng.size,
                });
            } catch (error) {
                console.error("Error calculating file sizes:", error);
            }
        };

        calculateSizes();
    }, [originalImageData, ditheredImageData]);

    const handleDownload = async (format: "jpeg" | "png") => {
        if (!ditheredImageData) return;

        try {
            const mimeType = `image/${format}`;
            const blob = await convertImageDataToBlob(ditheredImageData, mimeType);

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `dithered.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error preparing download:", error);
        }
    };

    return (
        <div className="card">
            <div className="card-body p-4">
                <div className="w-full mb-4">
                    <table className="table w-full text-sm">
                        <thead>
                            <tr>
                                <th className="text-left font-medium text-gray-600 pb-2">File</th>
                                <th className="text-right font-medium text-gray-600 pb-2">Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 text-left">Original</td>
                                <td className="py-2 text-right">{formatFileSize(originalFileSize)}</td>
                            </tr>
                            <tr>
                                <td className="py-2 text-left">Dithered JPEG</td>
                                <td className="py-2 text-right">{formatFileSize(fileSizes.jpeg)}</td>
                            </tr>
                            <tr>
                                <td className="py-2 text-left">Dithered PNG</td>
                                <td className="py-2 text-right">{formatFileSize(fileSizes.png)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex gap-2 justify-center">
                    <button
                        type="button"
                        onClick={() => handleDownload("jpeg")}
                        className="btn btn-primary flex items-center gap-2"
                        disabled={!ditheredImageData}
                    >
                        <LuDownload className="w-4 h-4" />
                        Download JPG
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDownload("png")}
                        className="btn btn-primary flex items-center gap-2"
                        disabled={!ditheredImageData}
                    >
                        <LuDownload className="w-4 h-4" />
                        Download PNG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileComparison;
