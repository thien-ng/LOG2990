
export class Pixel {

    constructor(
        private _red: number,
        private _green: number,
        private _blue: number,
        private _alpha: number,
        ) {
        //default constructor
    }

    public isEqual(red: number, green: number, blue: number, alpha: number): Boolean {
        return this._red === red &&
            this._green === green &&
            this._blue === blue &&
            this._alpha === alpha;
    }

    public getRed(): number {
        return this._red;
    }

    public getGreen(): number {
        return this._green;
    }

    public getBlue(): number {
        return this._blue;
    }

    public getAlpha(): number {
        return this,this._alpha
    }

}