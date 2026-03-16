import { useEffect, useRef } from "react";
import init, { start_game } from '../wasm/runner/runner.js';
import '../styles/Runner.css';

let cachedWasmContainer: HTMLDivElement | null = null;
let isWasmInitialized = false;

export default function Runner() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        if (!cachedWasmContainer) {
            cachedWasmContainer = document.createElement('div');
            cachedWasmContainer.id = 'wasm-canvas-container';
            if (!mountRef.current.contains(cachedWasmContainer)) {
                mountRef.current.appendChild(cachedWasmContainer);
            }

            if (!isWasmInitialized) {
                isWasmInitialized = true;
                init().then(() => start_game());
            }
        } else {
            if (!mountRef.current.contains(cachedWasmContainer)) {
                mountRef.current.appendChild(cachedWasmContainer);
            }
        }
    }, []);

    return (
        <div className="runner-section">
            <style>{`
                #wasm-canvas-container {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                #wasm-canvas-container canvas {
                    max-width: 100% !important;
                    height: auto !important;
                }
            `}</style>
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
                <div ref={mountRef} />
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