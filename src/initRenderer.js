import * as PIXI from "pixi.js";

/**
 *  Creates the Renderer
 *
 *  @returns {PIXIRenderer}
 */
const initRenderer = () => {

    // Create the renderer (auto detect Canvas / WebGL)
    const renderer = new PIXI.WebGLRenderer(640, 320, {
        antialias: false,
        transparent: false,
        resolution: 1,
        backgroundColor: 0xFFFFFF
    });

    // Style the renderer
    renderer.view.className = "renderArea";

    // Add to the DOM
    document.getElementById("main").appendChild(renderer.view);

    // Return the reference of the renderer
    return renderer;
};

export default initRenderer;
