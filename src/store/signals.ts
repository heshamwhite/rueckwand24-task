import { signal } from '@preact/signals-react';
import {CIRCLE_SIZE, circleColors, overlapsAny} from "../utils/DraggingUtils.ts";

export type CircleData = { id: number; x: number; y: number; color: string };

export const circlesSignal = signal<CircleData[]>([]);
export const selectedCircleIdSignal = signal<number | null>(null);
export const viewerSizeSignal = signal({ width: 0, height: 0 });
export const selectedMaterialIdSignal = signal<string | null>(null);

let nextCircleId = 1;


export function addCircle() {
    const { width, height } = viewerSizeSignal.value;
    const maxX = Math.max(0, width - CIRCLE_SIZE);
    const maxY = Math.max(0, height - CIRCLE_SIZE);

    if (maxX === 0 || maxY === 0) return;

    let randomX: number, randomY: number;
    let tries = 0;
    const maxTries = 100;

    do {
        randomX = Math.round(Math.random() * maxX);
        randomY = Math.round(Math.random() * maxY);
        tries++;
    } while (overlapsAny(randomX, randomY, undefined, circlesSignal.value) && tries < maxTries);

    if (tries >= maxTries) {
        console.warn('Could not place new circle without overlap.');
        return;
    }

    const color = circleColors[(nextCircleId - 1) % circleColors.length];
    const newCircle: CircleData = {
        id: nextCircleId++,
        x: randomX,
        y: randomY,
        color,
    };

    circlesSignal.value = [...circlesSignal.value, newCircle];
    selectedCircleIdSignal.value = newCircle.id;
}
