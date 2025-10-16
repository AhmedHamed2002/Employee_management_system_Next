"use client";

import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";

export function ParticlesPage() {
    const particlesInit = async (engine: Engine): Promise<void> => {
    await loadSlim(engine);
    };

    const particlesOptions: object = {
    background: { color: { value: "transparent" } },
    fpsLimit: 120,
    interactivity: {
        events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
        resize: { enable: true, delay: 0.5 },
        },
        modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
        },
    },
    particles: {
        color: { value: "#3744b3" },
        links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
        },
        move: {
        enable: true,
        direction: "none",
        outModes: { default: "bounce" },
        speed: 2,
        },
        number: { value: 60, density: { enable: true, area: 800 } },
        opacity: { value: 0.5 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 5 } },
    },
    detectRetina: true,
    };

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={particlesOptions}
            className="absolute inset-0 z-0"
        />
    )

}