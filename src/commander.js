import struct from './struct'

export default class Commander {

    constructor() {
        this.timer;
        this.command;
        this.exChar;
        this.writePermission = true;
        this._throttle = 0;
    }

    run(exChar) {
        this.exChar = exChar;
        this.timer = setInterval(() => {
            this.command = struct.pack('<BfffH', [0x30, 0, 0, 0, this._throttle]);
            this.writeArrayToChar(this.command);
            console.log(this._throttle);
        }, 250);
    }

    writeArrayToChar(data) {
        // Is this necessary?
        'use strict';

        console.log(">" + data)
        
        return new Promise((resolve, reject) => {
            console.log(this.writePermission);
            if(this.writePermission) {
                this.writePermission = false;
                console.log("about to write")
                this.exChar.writeValue(data).then(() => {
                    this.writePermission = true;
                    console.log("success");
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

}