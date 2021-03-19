import struct from './struct'

export default class Commander {

    constructor() {
        this.timer;
        this.command;
        this.exChar;
        this.writePermission = true;
        this._throttle = 0;
        this._yaw = 0;
        this._pitch = 0;
        this._roll = 0;

        //console.log(struct.pack('<BfffH', [0x30, 25, this._pitch, this._yaw, this._throttle]));

        // iOS packet with roll of 25
        // Write Request - Handle:0x000E - 00000202-1C7F-4F9E-947B-43B7C00A9A08 - 
        // Value: 3000 00C8 4100 0000 8000 0000 0000 00
        // 2021-03-18 12:24:49.622051-0500 Crazyflie client[6698:693935] {length = 15, bytes = 0x300000c84100000080000000000000}
        // pitch: -0.0 roll: 25.0 thrust: 0.0 yaw: 0.0

        // From web app with roll of 24
        // Write Request - Handle:0x000E - 00000202-1C7F-4F9E-947B-43B7C00A9A08 -
        // Value: 3000 00C0 4100 0000 0000 0000 0000 00
        
    }

    run(exChar) {
        this.exChar = exChar;
        this.timer = setInterval(() => {
            console.log("roll: " + this._roll + ", pitch: " + this._pitch);
            this.command = struct.pack('<BfffH', [0x30, this._roll, this._pitch, this._yaw, this._throttle]);
            this.send(this.command);
            //console.log(struct.unpack('<BfffH', this.command));
        }, 250);
    }

    send(data) {
        // Is this necessary?
        'use strict';

        //console.log(">" + data)
        
        return new Promise((resolve, reject) => {
            
            if(this.writePermission) {
                this.writePermission = false;

                this.exChar.writeValue(data).then(() => {
                    
                    this.writePermission = true;
                    //console.log("success");
                    resolve('Sending successful');

                }).catch( (error) => {
                    reject('Sending failed', error);
                })
            } else {
                reject('No permission to write');
            }
        });
    }

    kill() {
        clearInterval(this.timer);
    }

    set throttle(val) {
        this._throttle = val;
    }

    set yaw(val) {
        this._yaw = val;
    }

    set pitch(val) {
        this._pitch = val;
    }

    set roll(val) {
        this._roll = val;
    }

}