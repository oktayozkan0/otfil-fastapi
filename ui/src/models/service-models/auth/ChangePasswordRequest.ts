export class mdlChangePasswordRequest {
    old_password: string;
    new_password: string;
    confirm_new_password: string;

    constructor(old_password: string, new_password: string, confirm_new_password: string) {
        this.old_password = old_password;
        this.new_password = new_password;
        this.confirm_new_password = confirm_new_password;
    }

    // Yeni şifrenin doğrulanıp doğrulanmadığını kontrol etmek için bir validasyon metodu ekleyebiliriz
    validate(): boolean {
        if (this.new_password !== this.confirm_new_password) {
            return false;
        }
        return true;
    }
}
