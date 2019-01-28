
export class Pixel {

    constructor(
        private _red: number,
        private _green: number,
        private _blue: number,
        private _alpha: number,
        ) {
        //default constructor
    }

    public isEqual(pixel: Pixel): Boolean {
        return this._red === pixel.getRed() &&
            this._green === pixel.getGreen() &&
            this._blue === pixel.getBlue() &&
            this._alpha === pixel.getAlpha();
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