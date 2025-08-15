import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import ImageViewerStyle from "./ImageViewer.module.scss";
import mosiakmotiv from "../assets/mosaikmotiv.webp";
import { Circle } from "./Circle";
import {viewerSizeSignal, circlesSignal, addCircle} from "../store/signals";
import { useSignals } from "@preact/signals-react/runtime";

export function ImageViewer() {
    useSignals();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([entry]) => {
            const cr = entry.contentRect;
            viewerSizeSignal.value = { width: cr.width, height: cr.height };

            if (
                cr.width > 0 &&
                cr.height > 0 &&
                circlesSignal.value.length === 0
            ) {
                addCircle()
            }
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);

    return (
        <Box ref={ref} className={ImageViewerStyle.imageViewer}>
            <img alt="mosaikmotiv" src={mosiakmotiv} />
            {circlesSignal.value.map((circle) => (
                <Circle key={circle.id} circle={circle} />
            ))}
        </Box>
    );
}
