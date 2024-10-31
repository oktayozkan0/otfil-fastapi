export class mdlUser {
    id: number;
    email: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;

    constructor(
        id: number,
        email: string,
        username: string,
        password: string,
        first_name: string,
        last_name: string
    ) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
    }

    // Parola hassas bir bilgi olduğu için istersen şifreyi gizleyebilirsin
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            username: this.username,
            first_name: this.first_name,
            last_name: this.last_name,
            // password alanı istenirse kaldırılabilir
        };
    }
}