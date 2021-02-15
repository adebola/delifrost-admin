export class User {

    constructor(public userId: number,
                public username: string,
                public email: string,
                public fullName: string,
                public telephone: string,
                public address: string,
                public organization: string,
                private _token: string,
                private _tokenExpirationDate: Date) {}

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }

        return this._token;
    }

    get tokenExpirationDate() {
        return this._tokenExpirationDate;
    }
}
