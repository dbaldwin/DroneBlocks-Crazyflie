export default class MotionCommander {

    constructor(bluetooth, commander) {
        this.VELOCITY = 0.2;
        this.RATE = 360.0/5;
        this.bluetooth = bluetooth;
        this.commander = commander;
        this.isFlying = false;
    }

    takeOff() {

        if (this.isFlying) {
            throw new Error("Already flying!");
        }

        this.up()

    }

    up(distance_m, velocity=this.VELOCITY) {
        console.log("going up with velocity: " + velocity);
    }

    

}