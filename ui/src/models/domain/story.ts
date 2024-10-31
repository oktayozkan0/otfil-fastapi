import { Author } from "./author"
import { Category } from "./category"
import { Scene } from "./scene"

export class Story {
    slug: string;
    title: string;
    description: string;
    id: number;
    img: string

    constructor(slug: string, title: string, description: string, id: number, img: string) {
        this.slug = slug;
        this.title = title;
        this.description = description;
        this.id = id;
        this.img = img;
    }
}