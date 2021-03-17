import VirtualStick from './virtualstick';
import Commander from './commander';
import Bluetooth from './bluetooth';

window.init = function() {

    let commander = new Commander();
    let bluetooth = new Bluetooth(commander);
    let vs = new VirtualStick(bluetooth, commander);

    document.getElementById('connect').addEventListener('click', () => {
        bluetooth.connect();
    });
    
}