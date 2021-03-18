import nipplejs from 'nipplejs';
import Bluetooth from './bluetooth';

export default class VirtualStick {

    constructor(bluetooth, commander) {

        this.bluetooth = bluetooth;
        this.commander = commander;
        this.throttle = 0; // 0 to 65535
        this.roll = 0; // -20 to 20
        this.maxRoll = 25;
        this.pitch = 0; // -20 to 20
        this.maxPitch = 25;

        const left = nipplejs.create({
            zone: document.getElementById('left_stick'),
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'red',
            size: 200
        });

        const right = nipplejs.create({
            zone: document.getElementById('right_stick'),
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'blue',
            size: 200
        });

        this.lSize = left.options.size;
        this.rSize = right.options.size;

        // Throttle/Yaw
        left.on('move', (evt, nipple) => {

            // Crazyflie expects 0-65535
            this.throttle = nipple.distance * Math.sin(nipple.angle.radian);

            var yaw = ((nipple.distance * Math.cos(nipple.angle.radian)) / this.lSize);

            // If we have a connection let's send command packets
            if (this.bluetooth.isDroneConnected) {

                if (this.throttle > 0) {
                    this.throttle = this.throttle * 650; // throttle is 0-100 * 650
                    this.commander.throttle = this.throttle;
                }
            
            }

        });

        // Reset throttle/yaw
        left.on('end', (evt, nipple) => {
            this.throttle = 0;
            this.commander.throttle = this.throttle;
        });

        // Pitch/Roll
        right.on('move', (evt, nipple) => {

            this.roll = nipple.distance * Math.cos(nipple.angle.radian) / (this.rSize/2) * this.maxRoll;
            this.pitch = nipple.distance * Math.sin(nipple.angle.radian) / (this.rSize/2) * this.maxPitch;

            this.commander.roll = parseInt(this.roll);
            this.commander.pitch = parseInt(this.pitch * -1); // Invert the pitch
            
        });

        // Reset pitch/roll
        right.on('end', (evt, nipple) => {
            this.roll = 0;
            this.pitch = 0;
            this.commander.roll = 0;
            this.commander.pitch = 0;
        });

    }


}