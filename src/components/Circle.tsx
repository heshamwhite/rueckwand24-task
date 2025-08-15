// Circle.tsx
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import {
    circlesSignal,
    selectedCircleIdSignal,
    viewerSizeSignal,
} from "../store/signals";
import type { CircleData } from "../store/signals";
import { useSignals } from "@preact/signals-react/runtime";
import styles from "./Circle.module.scss";
import {CIRCLE_SIZE, overlapsAny} from "../utils/DraggingUtils.ts"; // new css module

export function Circle({ circle }: { circle: CircleData }) {
    useSignals();
    const nodeRef = useRef<HTMLDivElement>(null);
    const lastValidRef = useRef({ x: circle.x, y: circle.y });
    const [appearing, setAppearing] = useState(true); // run animation on first mount

    const clamp = (v: number, min: number, max: number) =>
        Math.round(Math.min(Math.max(v, min), max));

    const clampToBounds = (x: number, y: number) => {
        const { width, height } = viewerSizeSignal.value;
        const maxX = Math.max(0, width - CIRCLE_SIZE);
        const maxY = Math.max(0, height - CIRCLE_SIZE);
        return { x: clamp(x, 0, maxX), y: clamp(y, 0, maxY) };
    };



    const setIfAllowed = (nx: number, ny: number) => {
        const bounded = clampToBounds(nx, ny);
        if (!overlapsAny(bounded.x, bounded.y, circle.id, circlesSignal.value)) {
            lastValidRef.current = bounded;
            circlesSignal.value = circlesSignal.value.map((c) =>
                c.id === circle.id ? { ...c, ...bounded } : c
            );
            return;
        }
        circlesSignal.value = circlesSignal.value.map((c) =>
            c.id === circle.id ? { ...c, ...lastValidRef.current } : c
        );
    };

    return (
        <Draggable
            bounds="parent"
            nodeRef={nodeRef}
            position={{ x: circle.x, y: circle.y }}   // controlled
            onStart={() => {
                selectedCircleIdSignal.value = circle.id;
                lastValidRef.current = { x: circle.x, y: circle.y };
            }}
            onDrag={(_, d) => setIfAllowed(d.x, d.y)}
            onStop={(_, d) => setIfAllowed(d.x, d.y)}
            grid={[1, 1]}
        >
            <div
                ref={nodeRef}
                className={`${styles.circleOuter} ${
                    selectedCircleIdSignal.value === circle.id ? styles.isSelected : ""
                }`}
                style={{
                    width: CIRCLE_SIZE,
                    height: CIRCLE_SIZE,
                    backgroundColor: circle.color,
                }}
                onClick={() => (selectedCircleIdSignal.value = circle.id)}
            >
                {/* inner bubble handles the pop animation */}
                <div
                    className={`${styles.circleInner} ${appearing ? styles.appear : ""}`}
                    style={{backgroundColor: circle.color}}
                    onAnimationEnd={() => setAppearing(false)}
                />
            </div>
        </Draggable>
    );
}
