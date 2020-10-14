import { ImageLoader } from "./utilities/ImageLoader";
import { FrameCounter } from "./utilities/FrameCounter";
import { Keyboard } from "./utilities/Keyboard";
import { EntityComponentSystem } from "./ecs/EntityComponentSystem";
import * as RenderSystem from "./ecs/systems/RenderSystem";
import * as MovementSystem from "./ecs/systems/MovementSystem";
import { DimensionsComponent } from "./ecs/components/DimensionsComponent";
import { Rectangle, Vector } from "./utilities/Trig";
import { RenderComponent } from "./ecs/components/RenderComponent";
import { FrameTime } from "./utilities/FrameTime";
import { VelocityComponent } from "./ecs/components/VelocityComponent";
import { createProjectile } from "./ecs/EntityFactory";
import { SpriteSheetLoader } from "./utilities/SpriteSheetLoader";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");

const frameCounter = new FrameCounter();
const images = new ImageLoader();
const keyboard = new Keyboard();
const ecs = new EntityComponentSystem();
let lastFrameTime = 0;

const tankId = ecs.allocateEntityId();
let ships : Array<ImageBitmap>

async function main() {
    await loadImages();

    const dimensions = new DimensionsComponent(tankId, new Rectangle({x: 10, y: 10}, {width: 12, height: 16}));
    dimensions.center = {x: 6, y: 8};
    ecs.components.dimensionsComponents.add(dimensions);
    ecs.components.renderComponents.add(new RenderComponent(tankId, images.get("ship")));

    window.requestAnimationFrame(processFrame)
}

async function loadImages() {
    images.add("ship", "gfx/ship.png");
    images.add("shot", "gfx/shot.png");
    images.add("shipsheet", "gfx/16ShipCollectionPRE2.png");
    await images.load();

    const sheet = images.get("shipsheet");
    ships = await new SpriteSheetLoader().cutSpriteSheet(sheet, 10, 10);
    //console.log(sprites);
}

function processFrame(time: number) {
    const frameTime = updateFrameTime(time);

    update(frameTime);
    render();

    frameCounter.frame();
    window.requestAnimationFrame(processFrame)
}

function updateFrameTime(time: number) {
    const frameTime = new FrameTime(time, time - lastFrameTime);
    lastFrameTime = time;

    return frameTime;
}

function update(time: FrameTime) {
    const dimensions = ecs.components.dimensionsComponents.get(tankId);
    let location = dimensions.bounds.location;

    if (keyboard.isButtonDown("ArrowLeft")) {
        location.x -= time.calculateMovement(100);
    }
    if (keyboard.isButtonDown("ArrowRight")) {
        location.x += time.calculateMovement(100);
    }
    if (keyboard.isButtonDown("ArrowUp")) {
        location.y -= time.calculateMovement(100);
    }
    if (keyboard.isButtonDown("ArrowDown")) {
        location.y += time.calculateMovement(100);
    }

    if(keyboard.wasButtonPressedInFrame(" ")) {
        const tankBounds = ecs.components.dimensionsComponents.get(tankId).bounds;

        createProjectile(ecs, images, tankBounds.location, Vector.fromDegreeAngle(-25).multiplyScalar(500));
        createProjectile(ecs, images, tankBounds.location, Vector.fromDegreeAngle(0).multiplyScalar(500));
        createProjectile(ecs, images, tankBounds.location, Vector.fromDegreeAngle(25).multiplyScalar(500));
    }

    MovementSystem.update(time, ecs);
    ecs.removeDisposedEntities();

    keyboard.nextFrame();
}

function render() {
    context.beginPath();
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    RenderSystem.render(ecs, context);

    let index = 0;
    for(let ship of ships) {
        let x = (index % 10) * 20;
        let y = Math.floor(index / 10) * 20
        context.drawImage(ship, index * 20, 10);
        index++;
    }   
    //let tank = images.get("test1");

    // context.drawImage(tank, location.x, location.y);

    // let explosion = images.get("test2");

    // context.drawImage(explosion, 10, 10);

    // for(var i=0; i<10000; i++) {
    //     context.drawImage(tank, 10, 10);
    // }
}

main();