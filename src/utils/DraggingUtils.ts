import type {CircleData} from "../store/signals.ts";

export const CIRCLE_SIZE = 30;
export const R = CIRCLE_SIZE / 2;
export const COLLIDING_MARGIN = 3;

export const circleColors = [
    '#FF3B30',
    '#FF9500',
    '#FFCC00',
    '#34C759',
    '#30B0C7',
    '#5856D6',
    '#AF52DE',
    '#FF2D55',
    '#5AC8FA',
    '#A2845E',
];

export function overlapsAny(x: number, y: number,id: number|undefined, circlesList: CircleData[]): boolean {
    const cx = x + R;
    const cy = y + R;

    for (const other of circlesList) {
        if(other.id === id) continue;
        const dx = cx - (other.x + R);
        const dy = cy - (other.y + R);
        if (Math.hypot(dx, dy) < CIRCLE_SIZE + COLLIDING_MARGIN) {
            return true;
        }
    }
    return false;
}