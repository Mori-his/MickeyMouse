

export abstract class AlignmentGeometry {


    abstract _x: number;
    abstract _start: number;
    abstract _y: number;

    add(other: AlignmentGeometry) {
        this._x += other._x;
        this._y += other._y;
        this._start += other._start;
    }
}

export class Alignment extends AlignmentGeometry {

    constructor(
        public x: number,
        public y: number
    ) {
        super();
    }

    /**
     * 左上角
     */
    static topLeft: Alignment = new Alignment(-1.0, -1.0);

    /**
     * 沿顶部边缘的中心点
     */ 
    static topCenter: Alignment = new Alignment(0.0, -1.0);

    /**
     * 右上角
     */
    static topRight: Alignment = new Alignment(1.0, -1.0);

    /**
     * 沿左边边缘的中心点
     */
    static centerLeft: Alignment = new Alignment(-1.0, 0.0);

    /**
     * 中心点
     */
    static center: Alignment = new Alignment(0.0, 0.0);

    /**
     * 沿右边边缘的中心点
     */
    static centerRight: Alignment = new Alignment(1.0, 0.0);

    /**
     * 沿底部边缘的左边
     */
    static bottomLeft: Alignment = new Alignment(-1.0, 1.0);

    /**
     * 沿底部的中心点
     */
    static bottomCenter: Alignment = new Alignment(0.0, 1.0);

    /**
     * 沿底部的右边
     */
    static bottomRight: Alignment = new Alignment(1.0, 1.0);

    get _x() {
        return this.x;
    }
    get _start() {
        return 0
    }
    get _y() {
        return this.y;
    }
}
