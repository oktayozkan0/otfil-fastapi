import { Story } from "../../domain/story";

export class mdlGetStoriesResponse {
    items: Story[];
    total: number;
    limit: number;
    offset: number;

    constructor(items: Story[], total: number, limit: number, offset: number) {
        this.items = items;
        this.total = total;
        this.limit = limit;
        this.offset = offset;
    }
}