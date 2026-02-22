import { useEffect, useRef } from "react";
import init, { start_game } from '../wasm/runner/runner.js';

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
        <div className="game-wrapper">
            <div id="wasm-canvas-container" className="runner" />
        </div>
    );
}