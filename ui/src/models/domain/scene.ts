import { enmSceneType } from "../enums/sceneType"
import { Choice } from "./choice"

export interface Scene {
    slug: string
    title: string
    img: string
    text: string
    x: number
    y: number
    type: enmSceneType
    choices: Choice[]
}