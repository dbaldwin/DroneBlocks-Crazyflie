import nipplejs from 'nipplejs';
import Bluetooth from './bluetooth';

export default class VirtualStick {

    constructor(bluetooth, commander) {

        this.bluetooth = bluetooth;
        this.commander = commander;
        this.throttle = 0;

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

        let leftdx = 0;
        let leftdy = 0;
        const size = left.options.size;

        left.on('move', (evt, nipple) => {
            leftdx = nipple.position.x;
            leftdy = nipple.position.y;
        
            // Crazyflie expects 0-65535
            this.throttle = nipple.distance * Math.sin(nipple.angle.radian);

            var yaw = ((nipple.distance * Math.cos(nipple.angle.radian)) / size);

            // If we have a connection let's send command packets
            if (this.bluetooth.isDroneConnected) {

                if (this.throttle > 0) {
                    this.throttle = this.throttle * 650; // throttle is 0-100 * 650
                    this.commander.throttle = this.throttle;
                }
            
            }

            //console.log("throttle: " + this.throttle*650 + ", yaw2: " + yaw);
        });

        left.on('end', (evt, nipple) => {
            this.throttle = 0;
            this.commander.throttle = this.throttle;
        });

    }


}