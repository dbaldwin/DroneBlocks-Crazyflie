import VirtualStick from './virtualstick';
import Commander from './commander';
import Bluetooth from './bluetooth';
import MotionCommander from './cflib/motion_commander'
//import GamePad from './gamepad';

window.init = function() {

    let commander = new Commander();
    let bluetooth = new Bluetooth(commander);
    let vs;
    let mc;

    if (document.location.href.indexOf('droneblocks.html') > -1) {
        mc = new MotionCommander(bluetooth, commander);
        document.getElementById('launch').addEventListener('click', () => {
            mc.takeOff();
        });
    } else {
        vs = new VirtualStick(bluetooth, commander);
    }

    document.getElementById('connect').addEventListener('click', () => {
        bluetooth.connect();
    });
    
}