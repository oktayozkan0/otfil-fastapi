export class mdlUpdateStoryRequest {
    slug: string;
    title: string;
    description: string;

    constructor(slug: string, title: string, description: string) {
        this.slug = slug;
        this.title = title;
        this.description = description;
    }
}