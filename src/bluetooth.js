import Commander from './commander.js'

export default class Bluetooth {

    constructor(commander) {
        this.serviceUUID = '00000201-1c7f-4f9e-947b-43b7c00a9a08';
        this.exCharUUID = '00000202-1c7f-4f9e-947b-43b7c00a9a08';
        this.txCharUUID = '00000203-1c7f-4f9e-947b-43b7c00a9a08';
        this.rxCharUUID = '00000204-1c7f-4f9e-947b-43b7c00a9a08';
        this.bluetoothDevice;
        this.mainServer;
        this.isDroneConnected = false;
        this.commander = commander;
    }

    connect() {
        let options = { filters:[{ name: "Crazyflie"}], optionalServices: [this.serviceUUID] };
        
        navigator.bluetooth.requestDevice(options).then(device => {
            
            this.bluetoothDevice = device;

            // Adding event listener to detect loss of connection
            this.bluetoothDevice.addEventListener('gattserverdisconnected', this.disconnectHandler.bind(this));

            console.log('> Found ' + this.bluetoothDevice.name);
            console.log('Connecting to GATT Server...');

            // Connect to GATT server
            return this.bluetoothDevice.gatt.connect().then(gattServer => {
                this.mainServer = gattServer;
                console.log('> Bluetooth Device connected: ');
            })
            
            // When matching device is found and selected, get the main service
            .then(server => {

                console.log('Getting main Service...');
                return this.mainServer.getPrimaryService(this.serviceUUID);

            })
            .then(service => {

                // Storing the main service object globally for easy access from other functions
                this.mainService = service;
                console.log('> serviceReturn: ' + service);

                // Get characteristics and call handler functions for both
                return Promise.all([
                    service.getCharacteristic(this.exCharUUID)
                    .then(characteristic => {
                        this.exChar = characteristic;
                        console.log('EX characteristic ok');

                        // We are connected so let's start sending setpoint messages
                        this.isDroneConnected = true;

                        // Start the commander
                        this.commander.run(this.exChar);

                    })
                    .catch(error => {
                        console.log("Failed in EX char init", error);
                    })
                ]);
            });
        });
    }

    disconnectHandler() {
        this.isDroneConnected = false;
        this.commander.kill();
    }

}