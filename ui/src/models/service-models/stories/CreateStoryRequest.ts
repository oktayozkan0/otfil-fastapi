export class mdlCreateStoryRequest {
    title: string;
    description: string;

    constructor(title: string, description: string) {
        this.title = title;
        this.description = description;
    }

    // İsteğe bağlı validasyon metodu eklenebilir
    validate(): boolean {
        if (!this.title || !this.description) {
            return false;
        }
        return true;
    }
}
