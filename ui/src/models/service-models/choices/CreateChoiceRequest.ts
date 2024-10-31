export class mdlCreateChoiceRequest {
    scene_slug: string;
    story_slug: string;
    text: string;
    next_scene_slug: string;

    constructor(scene_slug: string,
        story_slug: string,
        text: string,
        next_scene_slug: string) {
        this.scene_slug = scene_slug;
        this.story_slug = story_slug;
        this.text = text;
        this.next_scene_slug = next_scene_slug;
    }
}