import { LuDownload } from "react-icons/lu";

enum DownloadFormat {
    JPG = "jpg",
    PNG = "png",
}

const FileComparison = () => {
    // TODO: Replace with props
    const fileData = {
        jpeg: {
            original: "2.5 MB",
            modified: "1.2 MB",
        },
        png: {
            original: "3.8 MB",
            modified: "2.1 MB",
        },
    };

    const handleDownload = (format: DownloadFormat) => {
        console.log(`Downloading ${format} file`);
    };

    return (
        <div className="xl:fixed bottom-4 right-4 md:w-80 w-full px-4 md:px-0 bg-base-200 rounded-md">
            <div className="card">
                <div className="card card-body p-4">
                    {/* Comparison Table */}
                    <div className="w-full mb-4">
                        <table className="table w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left font-medium text-gray-600 pb-2">Format</th>
                                    <th className="text-right font-medium text-gray-600 pb-2">Original</th>
                                    <th className="text-right font-medium text-gray-600 pb-2">Modified</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2 text-left">JPEG</td>
                                    <td className="py-2 text-right">{fileData.jpeg.original}</td>
                                    <td className="py-2 text-right">{fileData.jpeg.modified}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-left">PNG</td>
                                    <td className="py-2 text-right">{fileData.png.original}</td>
                                    <td className="py-2 text-right">{fileData.png.modified}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Download Buttons */}
                    <div className="flex gap-2 justify-center">
                        <button
                            type="button"
                            onClick={() => handleDownload(DownloadFormat.JPG)}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <LuDownload className="w-4 h-4" />
                            Download JPG
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDownload(DownloadFormat.PNG)}
                            className="flex items-center gap-2"
                        >
                            <LuDownload className="w-4 h-4" />
                            Download PNG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileComparison;
