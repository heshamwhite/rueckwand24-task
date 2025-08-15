import React, { type ReactElement } from "react";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useSignals } from "@preact/signals-react/runtime";
import addIcon from "../assets/plus-circle.svg";
import styles from "./CustomisationPane.module.scss";
import {
    addCircle,
    circlesSignal,
    selectedCircleIdSignal,
    viewerSizeSignal,
    selectedMaterialIdSignal,
} from "../store/signals";
import {CIRCLE_SIZE} from "../utils/DraggingUtils.ts";

const materials = [
    {
        id: "alu-classic-matt",
        title: "ALU – Classic Matt",
        desc:
            "Eine preiswerte Lösung für alle, die sich eine leicht zu reinigende und robuste Rückwand wünschen.",
    },
    {
        id: "alu-prime-lotus-seidenmatt",
        title: "ALU Prime – Lotus Seidenmatt",
        desc:
            "Die perfekte Wahl für Eleganz und besonders satte Farben. Veredelt mit unserem exklusiven Lotus Prime Shield.",
    },
    {
        id: "alu-prime-hd-glanz",
        title: "ALU Prime – HD Glanz",
        desc:
            "Die ideale Wahl für farbenfrohe und kontrastreiche Motive. Veredelt mit unserem exklusiven Lotus Prime Shield.",
    },
    {
        id: "alu-prime-metall-gebuerstet",
        title: "ALU Prime – Metall Gebürstet",
        desc:
            "Echtes haptisches Erlebnis. Besonders beliebt bei Motiven wie Holz, Metall oder Beton. Veredelt mit Lotus Prime Shield.",
    },
    {
        id: "acryl-classic",
        title: "Acryl – Classic",
        desc:
            "Perfekt für alle, die sich eine günstige Glasalternative mit 3D-Tiefenwirkung wünschen.",
    },
];

export function CustomisationPane(): ReactElement {
    useSignals();
    return (
        <Box className={styles.configurationPane}>
            <Box className={styles.configurationSection}>
                <Typography className={styles.title}>
                    Kreise.
                    <span className={styles.subtitle}> Wähle die, die am besten ins Bild passen.</span>
                </Typography>
                <CircleCoordinatesInput />
            </Box>

            <Box className={styles.configurationSection}>
                <Typography className={styles.title}>
                    Material.
                    <span className={styles.subtitle}> Passend zu deinem Stil.</span>
                </Typography>

                <Box className={styles.optionsList}>
                    {materials.map((m) => {
                        const selected = selectedMaterialIdSignal.value === m.id;
                        return (
                            <Box
                                key={m.id}
                                role="button"
                                tabIndex={0}
                                aria-pressed={selected}
                                aria-selected={selected}
                                className={`${styles.optionContainer} ${selected ? styles.selected : ""}`}
                                onClick={() => (selectedMaterialIdSignal.value = m.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        selectedMaterialIdSignal.value = m.id;
                                    }
                                }}
                            >
                                <span className={styles.optionTitle}>{m.title}</span>
                                <span className={styles.optionDesc}>{m.desc}</span>
                            </Box>
                        );
                    })}
                </Box>
                <Box className={styles.submitContainer}>
                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={() => {
                            const selectedMaterialId = selectedMaterialIdSignal.value;
                            const selectedMaterial =
                                materials.find(m => m.id === selectedMaterialId) || null;

                            const data = {
                                material: selectedMaterial
                                    ? { id: selectedMaterial.id, title: selectedMaterial.title }
                                    : null,
                                circles: circlesSignal.value.map(c => ({
                                    id: c.id,
                                    x: c.x,
                                    y: c.y,
                                    color: c.color,
                                })),
                            };

                            console.log("Customisation: ", data);
                        }}
                    >
                        Konfiguration abschließen
                    </button>
                </Box>
            </Box>
        </Box>
    );
}

export function CircleCoordinatesInput() {
    useSignals();
    const selectedCircle = circlesSignal.value.find(
        (c) => c.id === selectedCircleIdSignal.value
    );

    const { width, height } = viewerSizeSignal.value;
    const maxX = Math.max(0, width - CIRCLE_SIZE);
    const maxY = Math.max(0, height - CIRCLE_SIZE);
    const restrict = (v: number, min: number, max: number) =>
        Math.round(Math.min(Math.max(v, min), max));

    const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedCircle) return;
        const x = restrict(parseInt(e.target.value, 10) || 0, 0, maxX);
        circlesSignal.value = circlesSignal.value.map((c) =>
            c.id === selectedCircle.id ? { ...c, x } : c
        );
    };

    const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedCircle) return;
        const y = restrict(parseInt(e.target.value, 10) || 0, 0, maxY);
        circlesSignal.value = circlesSignal.value.map((c) =>
            c.id === selectedCircle.id ? { ...c, y } : c
        );
    };

    return (
        <Box>
            <Typography className={styles.text}>Abstand für Kreis</Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                    label="X"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={selectedCircle ? selectedCircle.x : 0}
                    onChange={handleXChange}
                />
                <TextField
                    label="Y"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={selectedCircle ? selectedCircle.y : 0}
                    onChange={handleYChange}
                />

                <IconButton onClick={addCircle} sx={{ ml: 1 }} aria-label="Kreis hinzufügen">
                    <img src={addIcon} style={{ width: "24px", height: "24px" }} />
                </IconButton>
            </Box>

            <Box className={styles.circleList}>
                {circlesSignal.value.map((circle) => (
                    <Box
                        key={circle.id}
                        onClick={() => (selectedCircleIdSignal.value = circle.id)}
                        className={`${styles.circleButton} ${
                            selectedCircleIdSignal.value === circle.id ? styles.selected : ""
                        }`}
                        style={{
                            backgroundColor: circle.color,
                        }}
                    >
                        <Box className={styles.circleSelect} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
