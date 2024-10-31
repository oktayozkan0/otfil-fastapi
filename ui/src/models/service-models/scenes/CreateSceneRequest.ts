import { enmSceneType } from "../../enums/sceneType"

export class mdlCreateSceneRequest {
    story_slug?: string
    title?: string
    text?: string
    x?: number
    y?: number
    type?: enmSceneType
}