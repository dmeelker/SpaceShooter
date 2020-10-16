import { MovementMode } from "../ecs/components/ComputerControlledShipComponent";
import { LevelSpec } from "../Levels";

const level: LevelSpec = [
    {
        progress: 1000,
        enemies: [
            {y: 50, speed: 20, movementMode: MovementMode.straightLine}
        ]
    },

    {
        progress: 10000,
        enemies: [
            {y: 50, speed: 20, movementMode: MovementMode.straightLine}
        ]
    },

    // {
    //     progress: 1,
    //     enemies: [
    //         {y: 50, speed: 20, movementMode: MovementMode.path, 
    //         path: [
    //             {x:10, y: 10},
    //             {x:10, y: 50},
    //             {x:90, y: 90}]}
    //     ]
    // },
    // {
    //     progress: 2000,
    //     enemies: [
    //         {y: 50, speed: 20, movementMode: MovementMode.straightLine}
    //     ]
    // },
    // {
    //     progress: 4000,
    //     enemies: [
    //         {y: 50, speed: 20, movementMode: MovementMode.straightLine}
    //     ]
    // },
    // {
    //     progress: 6000,
    //     enemies: [
    //         {y: 20, speed: 20, angle: 170, movementMode: MovementMode.straightLine},
    //         {y: 40, speed: 40, movementMode: MovementMode.straightLine},
    //         {y: 60, speed: 40, movementMode: MovementMode.straightLine},
    //         {y: 80, speed: 20, angle: 190, movementMode: MovementMode.straightLine}
    //     ]
    // }
];

export default level;