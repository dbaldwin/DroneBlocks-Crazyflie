export default class MotionCommander {

    constructor(bluetooth, commander) {
        this.VELOCITY = 0.2;
        this.RATE = 360.0/5;
        this.DEFAULT_HEIGHT = 0.5;
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

    up(distance_m=this.DEFAULT_HEIGHT, velocity=this.VELOCITY) {
        console.log("going up with velocity: " + velocity);
        this.move_distance(0.0, 0.0, distance_m, velocity)
    }

    move_distance(distance_x_m, distance_y_m, distance_z_m, velocity=this.VELOCITY) {

        let distance = Math.sqrt(distance_x_m * distance_x_m + distance_y_m * distance_y_m + distance_z_m * distance_z_m);
        let flight_time = distance / velocity;

        let velocity_x = velocity * distance_x_m / distance;
        let velocity_y = velocity * distance_y_m / distance;
        let velocity_z = velocity * distance_z_m / distance;

        console.log(distance);
        console.log(flight_time);
        console.log(velocity_x);
        console.log(velocity_y);
        console.log(velocity_z);

        //this.start_linear_motion(velocity_x, velocity_y, velocity_z)
        //time.sleep(flight_time)
        //this.stop()
    }

    start_linear_motion(velocity_x_m, velocity_y_m, velocity_z_m) {

    }

    

}