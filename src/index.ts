import { ImageLoader } from "./utilities/ImageLoader";
import { FrameCounter } from "./utilities/FrameCounter";
import { Keyboard } from "./utilities/Keyboard";
import { EntityComponentSystem } from "./ecs/EntityComponentSystem";
import * as RenderSystem from "./ecs/systems/RenderSystem";
import { DimensionsComponent } from "./ecs/components/DimensionsComponent";
import { Rectangle } from "./utilities/Trig";
import { RenderComponent } from "./ecs/components/RenderComponent";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");

const frameCounter = new FrameCounter();
const images = new ImageLoader();
const keyboard = new Keyboard();
const ecs = new EntityComponentSystem();
let lastFrameTime = 0;

const tankId = ecs.allocateEntityId();

interface FrameTime {
    currentTime: number;
    timeSinceLastFrame: number;
}

async function main() {
    await loadImages();

    const dimensions = new DimensionsComponent(tankId, new Rectangle({x: 10, y: 10}, {width: 12, height: 16}));
    dimensions.center = {x: 6, y: 8};
    ecs.components.dimensionsComponents.add(dimensions);
    ecs.components.renderComponents.add(new RenderComponent(tankId, images.get("test1")));

    window.requestAnimationFrame(processFrame)
}

async function loadImages() {
    images.add("test1", "gfx/tank1.png");
    images.add("test2", "gfx/explosion.png");
    await images.load();
}

function processFrame(time: number) {
    const frameTime = updateFrameTime(time);

    update(frameTime);
    render();

    frameCounter.frame();
    window.requestAnimationFrame(processFrame)
}

function updateFrameTime(time: number) {
    const frameTime = { currentTime: time, timeSinceLastFrame: time - lastFrameTime };
    lastFrameTime = time;

    return frameTime;
}

function update(time: FrameTime) {
    const dimensions = ecs.components.dimensionsComponents.get(tankId);
    let location = dimensions.bounds.location;

    if (keyboard.isButtonDown("ArrowLeft")) {
        location.x -= time.timeSinceLastFrame * 0.2;
    }
    if (keyboard.isButtonDown("ArrowRight")) {
        location.x += time.timeSinceLastFrame * 0.2;
    }
    if (keyboard.isButtonDown("ArrowUp")) {
        location.y -= time.timeSinceLastFrame * 0.2;
    }
    if (keyboard.isButtonDown("ArrowDown")) {
        location.y += time.timeSinceLastFrame * 0.2;
    }

    // dimensions.rotationInDegrees += 1;
    // dimensions.scale.x = 1 + Math.abs((Math.sin(time.currentTime / 1000) * 5));
    // dimensions.scale.y = 1 + Math.abs((Math.sin(time.currentTime / 1000) * 5));

    keyboard.nextFrame();
}

function render() {
    context.beginPath();
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    RenderSystem.render(ecs, context);
    // let tank = images.get("test1");

    // context.drawImage(tank, location.x, location.y);

    // let explosion = images.get("test2");

    // context.drawImage(explosion, 10, 10);
}

main();