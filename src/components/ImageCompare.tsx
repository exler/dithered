import { useEffect, useRef, useState } from "react";
import { LuChevronsLeftRightEllipsis } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

type ImageCompareProps = {
    beforeImage: string;
    afterImage: string;
    className?: string;
};
const ImageCompare = ({ beforeImage, afterImage, className }: ImageCompareProps) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (event: MouseEvent | TouchEvent) => {
        if (!isDragging) return;

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        const position = ((x - rect.left) / rect.width) * 100;

        // Clamp the position between 0 and 100
        setSliderPosition(Math.min(Math.max(position, 0), 100));
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>handleMove is not going to change.</explanation>
    useEffect(() => {
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener("mousemove", handleMove);
            window.addEventListener("touchmove", handleMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchend", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchmove", handleMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className={twMerge(
                "relative w-full h-96 aspect-auto overflow-hidden rounded-lg cursor-ew-resize select-none",
                className,
            )}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
        >
            {/* Overlay layer - Dithered image */}
            <div className="absolute top-0 left-0 w-full h-full">
                <img src={afterImage} alt="After" className="absolute top-0 left-0 w-full h-full object-cover" />
            </div>

            {/* Base layer - Original image */}
            <img
                src={beforeImage}
                style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                }}
                alt="Before"
                className="absolute top-0 left-0 w-full h-full object-cover"
            />

            {/* Slider line */}
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
            >
                {/* Slider handle */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <LuChevronsLeftRightEllipsis className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCompare;
