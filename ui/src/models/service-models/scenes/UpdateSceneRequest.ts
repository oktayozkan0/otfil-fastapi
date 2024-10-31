import { enmSceneType } from "../../enums/sceneType";

export class mdlUpdateSceneRequest {
    story_slug?: string;
    scene_slug?: string
    title?: string
    text?: string
    x?: number
    y?: number
    type?: enmSceneType
}