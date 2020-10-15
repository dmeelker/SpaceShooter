import { LevelSpec } from "../Levels";

const level: LevelSpec = [
    {
        progress: 1,
        enemies: [
            {y: 50, speed: 20}
        ]
    },
    {
        progress: 2000,
        enemies: [
            {y: 50, speed: 20}
        ]
    },
    {
        progress: 4000,
        enemies: [
            {y: 50, speed: 20}
        ]
    },
    {
        progress: 10000,
        enemies: [
            {y: 20, speed: 20, angle: 170},
            {y: 40, speed: 40},
            {y: 60, speed: 40},
            {y: 80, speed: 20, angle: 190}
        ]
    }
];

export default level;