import { Scene } from "../../domain/scene";

export class mdlGetScenesResponse {
    items: Scene[];
    total: number;
    limit: number;
    offset: number;

    constructor(items: Scene[], total: number, limit: number, offset: number) {
        this.items = items;
        this.total = total;
        this.limit = limit;
        this.offset = offset;
    }
}