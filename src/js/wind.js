/* global p2 */
export default {
    create() {
        const obj = Object.create(this);
        // obj.vector = new p2.vec2();
        obj.vector = p2.vec2.fromValues(0, 0.1);

        return obj;
    },
    getAngleDegrees() {
        const angle = Math.atan2(this.vector[0], this.vector[1]);
        return angle * (180 / Math.PI);
    },
    changeWind() {
        // this.vector.setLength(0.01);
        // this.vector.setAngle(Math.random() * Math.PI * 2);
    },
};
