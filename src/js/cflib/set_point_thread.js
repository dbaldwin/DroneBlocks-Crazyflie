import Queue from './queue'

export default class SetPointThread {

    constructor() {
        this.Z_INDEX = 3;
        this.z_base = 0.0;
        this.z_velocity = 0.0;
        this.z_base_time = 0.0;
        this.hover_setpoint = [0.0, 0.0, 0.0, 0.0];
        this.interval;
        this.queue = new Queue();
    }

    start() {

        this.interval = setInterval(() => {

            let event = this.queue.get();

            if (event != 'empty') {
                this.new_setpoint(event[0], event[1], event[2], event[3]);
            }

            this.update_z_in_setpoint();
        
            console.log(this.hover_setpoint);

        }, 250);
    
    }

    set_vel_setpoint(velocity_x, velocity_y, velocity_z, rate_yaw) {
        console.log('putting on queue: ' + [velocity_x, velocity_y, velocity_z, rate_yaw]);
        this.queue.put([velocity_x, velocity_y, velocity_z, rate_yaw]);
    }

    new_setpoint(velocity_x, velocity_y, velocity_z, rate_yaw) {
        this.z_base = this.current_z();
        this.z_velocity = velocity_z;
        this.z_base_time = new Date().getTime()/1000;
        this.hover_setpoint = [velocity_x, velocity_y, rate_yaw, this.z_base]
    }

    update_z_in_setpoint() {
        this.hover_setpoint[this.Z_INDEX] = this.current_z();
    }

    current_z() {
        let now = new Date().getTime()/1000;
        let z = this.z_base + this.z_velocity * (now - this.z_base_time);
        return z;
    }

    stop() {
        clearInterval(this.interval);
    }
}