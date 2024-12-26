import { FileUpload, useFileUpload } from "@ark-ui/react/file-upload";
import { LuGithub } from "react-icons/lu";

import { useEffect, useState } from "react";
import Logo from "./assets/logo.png";
import ImageCompare from "./components/ImageCompare";
import ImageModificationTable from "./components/ImageModificationTable";
import { DitheringMethod, ditherImage } from "./utils/dithering";

const FileUploadPage = () => {
    const [originalImageURL, setOriginalImageURL] = useState<string | null>(null);
    const [ditheringMethod, setDitheringMethod] = useState<DitheringMethod>(DitheringMethod.FloydSteinberg);
    const [ditheredImage, setDitheredImage] = useState<string | null>(null);

    const fileUpload = useFileUpload({ maxFiles: 1, accept: "image/*", disabled: !!originalImageURL });
    const isFileUploaded = fileUpload.acceptedFiles.length > 0;

    useEffect(() => {
        setOriginalImageURL(isFileUploaded ? URL.createObjectURL(fileUpload.acceptedFiles[0]) : null);
    }, [isFileUploaded, fileUpload.acceptedFiles]);

    useEffect(() => {
        const processDithering = async () => {
            if (!isFileUploaded) return;

            try {
                const file = fileUpload.acceptedFiles[0];
                const dataUrl = await ditherImage(file, ditheringMethod);
                setDitheredImage(dataUrl);
            } catch (error) {
                console.error("Failed to process image:", error);
                // TODO: Show error message to the user
            }
        };

        processDithering();
    }, [isFileUploaded, ditheringMethod, fileUpload.acceptedFiles]);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="bg-base-100 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <img src={Logo} alt="Dithered" className="h-6" />
                    </div>

                    <a
                        href="https://github.com/exler/dithered"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                    >
                        <LuGithub className="w-6 h-6" />
                    </a>
                </div>
            </header>

            {/* Main content */}
            <main>
                <FileUpload.RootProvider value={fileUpload}>
                    <FileUpload.Dropzone className="w-full border-4 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-96 transition-colors border-neutral bg-base-200">
                        {!isFileUploaded ? (
                            <>
                                <FileUpload.Trigger className="btn btn-primary">Choose file(s)</FileUpload.Trigger>
                                <FileUpload.Label className="text-center text-base-content/70">
                                    or drag and drop files anywhere on the page
                                </FileUpload.Label>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary mb-4 mr-auto"
                                    onClick={fileUpload.clearFiles}
                                >
                                    Clear image
                                </button>
                                {originalImageURL && ditheredImage && (
                                    <ImageCompare beforeImage={originalImageURL} afterImage={ditheredImage} />
                                )}
                            </>
                        )}

                        <FileUpload.HiddenInput />
                    </FileUpload.Dropzone>
                </FileUpload.RootProvider>

                <div className="mb-4">
                    <label className="label">
                        <span className="label-text">Dithering Method</span>
                        <select
                            className="select select-bordered w-full max-w-xs"
                            value={ditheringMethod}
                            onChange={(e) => setDitheringMethod(e.target.value as DitheringMethod)}
                        >
                            <option value="floydSteinberg">Floyd-Steinberg</option>
                            <option value="stucki">Stucki</option>
                        </select>
                    </label>
                </div>

                <ImageModificationTable />
            </main>

            {/* Usage section */}
            <section className="bg-base-200 py-12">
                <div className="container mx-auto px-8">
                    <h2 className="text-2xl font-bold mb-4">Usage</h2>
                    <p className="text-base-content/70">
                        Upload an image using the file picker or drag and drop. Select your preferred dithering method
                        from the dropdown menu. The original and dithered versions of your image will be displayed for
                        comparison. Floyd-Steinberg dithering tends to create a more uniform pattern, while Stucki
                        dithering can preserve more detail in some cases.
                    </p>
                </div>
            </section>

            <footer className="flex items-center justify-end gap-1 p-4 text-xs">
                <span className="text-neutral-500">© {new Date().getFullYear()}</span>{" "}
                <a href="https://kamilmarut.com">KAMILMARUT.COM</a>
            </footer>
        </div>
    );
};

export default FileUploadPage;
