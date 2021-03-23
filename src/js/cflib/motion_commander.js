import SetPointThread from './set_point_thread'

export default class MotionCommander {

    constructor(bluetooth, commander) {
        this.VELOCITY = 0.2;
        this.RATE = 360.0/5;
        this.DEFAULT_HEIGHT = 0.5;
        this.bluetooth = bluetooth;
        this.commander = commander;
        this.isFlying = false;
        this.thread;
    }

    launchMission() {
        this.takeOff();
        this.land();
    }

    takeOff() {

        if (this.isFlying) {
            throw new Error('Already flying!');
        }

        this.isFlying = true;

        this.thread = new SetPointThread();
        this.thread.start();

        console.log("take off");
        this.up(this.DEFAULT_HEIGHT, this.VELOCITY)

    }

    land() {
        console.log('land');
        if (this.isFlying) {

            // self.down()
            this.thread.stop();
            this.isFlying = false;

        }
        
    }

    up(distance_m, velocity) {
        console.log("up");
        this.move_distance(0.0, 0.0, distance_m, velocity);
    }

    async move_distance(distance_x_m, distance_y_m, distance_z_m, velocity=this.VELOCITY) {

        console.log("move distance");
        let distance = Math.sqrt(distance_x_m * distance_x_m + distance_y_m * distance_y_m + distance_z_m * distance_z_m);
        let flight_time = distance / velocity;

        let velocity_x = velocity * distance_x_m / distance;
        let velocity_y = velocity * distance_y_m / distance;
        let velocity_z = velocity * distance_z_m / distance;

        // console.log("distance: " + distance);
        // console.log("flight time: " + flight_time);
        // console.log("x vel: " + velocity_x);
        // console.log("y vel: " + velocity_y);
        // console.log("z vel: " + velocity_z);

        this.start_linear_motion(velocity_x, velocity_y, velocity_z);
        await this.sleep(flight_time * 1000);
        this.stop();

    }

    start_linear_motion(velocity_x_m, velocity_y_m, velocity_z_m) {
        /*
         Start a linear motion. This function returns immediately.

        positive X is forward
        positive Y is left
        positive Z is up

        :param velocity_x_m: The velocity along the X-axis (meters/second)
        :param velocity_y_m: The velocity along the Y-axis (meters/second)
        :param velocity_z_m: The velocity along the Z-axis (meters/second)
        :return:
        */
        console.log("starting linear motion");
        this.set_vel_setpoint(velocity_x_m, velocity_y_m, velocity_z_m, 0.0);
    }

    set_vel_setpoint(velocity_x, velocity_y, velocity_z, rate_yaw) {
        
        if (!this.isFlying) {
            console.log('Take off first!');
            return;
        }

        this.thread.set_vel_setpoint(velocity_x, velocity_y, velocity_z, rate_yaw);
    }

    stop() {
        console.log('stop');
        this.set_vel_setpoint(0.0, 0.0, 0.0, 0.0)
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}