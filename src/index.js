import * as PIXI from "pixi.js";
import initRenderer from "./initRenderer";
import preloadResources from "./preloadResources";
import getTexture from "./getTexture";
import dat from "dat-gui";

// "Global" variables we need to use across multiple functions
let demoStage, strokeContainer;

const APP = {
    x: null,
    y: null,
    spacing: 1,
    brush: 0,
    brushTex: [],
    penDown: false,
    brushAlpha: null,
    brushFilter: {uniforms: {}, shaderCode: null, shader: null},
    stroke: [],
    AddStrokeNode: function (_x, _y) {
        APP.stroke.push({x: _x, y: _y});
        let tex = APP.brushTex[APP.brush];
        let spr = new PIXI.Sprite(tex);
        spr.scale.set((APP.brush > 0) ? 0.1 : 0.5);
        spr.anchor.set(0.5,0.5);
        spr.position = new PIXI.Point(_x, _y);
        spr.filters = [APP.brushFilter.shader];
        // spr.cacheAsBitmap = true;

        strokeContainer.addChild(spr);
    },
    drawStart: function () {
        APP.stroke = [];
        APP.penDown = true;
        strokeContainer.removeChildren();
    },
    drawStop: function () {
        APP.penDown = false;
    },
    SetupGUI: function () {
        const gui = new dat.GUI();
        //gui.add(APP, 'spacing').min(0.01).max(10.0);
        gui.add(APP.brushFilter.shader.uniforms, 'u_redness').min(0.0).max(1.0).name("Value");
        gui.add(APP.brushFilter.shader.uniforms, 'u_alpha').min(0.0).max(1.0).name("Alpha");
        gui.add(APP, 'brush', {ghost: 0, brush1: 1, brush2: 2, shaderEllipse: 3});
        // gui.add(APP.brushFilter.uniforms.u_scale, 'value').min(0.0).max(2.0).name("scale");
    },
};


// Define the main game loop
const redraw = (time, renderer) => {

    // Redraw when browser is ready
    requestAnimationFrame(t => redraw(t, renderer));

    if (APP.penDown) {
        const m = renderer.plugins.interaction.mouse.global;
        APP.AddStrokeNode(m.x, m.y);
    }
    renderer.render(demoStage);
};

/**
 *  Set up the game after the window and resources have finished loading.
 *  Creates the renderer, sets up the stages, and performs the initial render.
 */
const setup = () => {

    APP.brushFilter.uniforms.u_alpha = {type: '1f', value: 1.0};
    APP.brushFilter.uniforms.u_redness = {type: '1f', value: 1.0};
    // APP.brushFilter.uniforms.u_brushTex = {type: 'sampler2D', value: APP.brushTex[0]};
    APP.brushFilter.shaderCode = document.getElementById( 'fragShader' ).innerHTML;
    APP.brushFilter.shader = new PIXI.Filter(null, APP.brushFilter.shaderCode, APP.brushFilter.uniforms);

    const renderer = initRenderer();
    renderer.plugins.interaction.on("mousedown", APP.drawStart);
    renderer.plugins.interaction.on("mouseup", APP.drawStop);

    APP.SetupGUI();

    // Create a container object called the `stage`
    demoStage = new PIXI.Container();
    strokeContainer = new PIXI.Container();

    APP.brushTex.push(getTexture("images/ghost.png"));
    APP.brushTex.push(getTexture("images/b1.png"));
    APP.brushTex.push(getTexture("images/b2.png"));
    demoStage.addChild(strokeContainer);

    // demoStage.addChild(ghostSprite);

    // Perform initial render
    redraw(-1, renderer);
};

/* ---------- Initialisation ---------- */

// Wait until the page is fully loaded
window.addEventListener("load", () => {

    // List of resources to load
    const resources = ["images/ghost.png","images/b1.png", "images/b2.png" ];

    // Then load the images
    preloadResources(resources, () => {

        // Then run the setup() function
        setup();
    });
});

