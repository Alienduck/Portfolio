import { useEffect, useRef } from "react";
import init, { start_game } from '../wasm/runner/runner.js';
import '../styles/Runner.css';

export default function Runner() {
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        init().then(() => {
            start_game();
        });
    }, []);

    return (
        <div className="runner-section">
            <div className="runner-header">
                <span className="section-tag">DEMO INTERACTIVE</span>
                <h2 className="section-title">
                    Raycaster <span className="gradient-text">en Rust</span>
                </h2>
                <p className="runner-subtitle">
                    Moteur de rendu 3D compilé en WebAssembly — Z/S pour avancer/reculer, Q/D pour tourner, A/E pour pivoter.
                </p>
            </div>
            <div className="runner-frame">
                <div id="wasm-canvas-container" />
                <div className="runner-scanline" />
                <div className="runner-corner runner-corner-tl">WASM</div>
                <div className="runner-corner runner-corner-tr">RUST</div>
                <div className="runner-corner runner-corner-bl">1280x720</div>
                <div className="runner-corner runner-corner-br">60FPS</div>
            </div>
            <p className="personnal-msg glow">
                J'ai prit une journée entière à convertir le projet en WebAssembly
            </p>
            <div className="runner-mobile-msg">
                <span>🖥️</span>
                <p>La démo interactive n'est disponible que sur desktop.</p>
            </div>
        </div>
    );
}