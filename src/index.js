import nipplejs from 'nipplejs';
import Bluetooth from './bluetooth';

window.init = function() {

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

    left.on('move', function (evt, nipple) {
        leftdx = nipple.position.x;
        leftdy = nipple.position.y;
        
        var throttle = ((nipple.distance * Math.sin(nipple.angle.radian)) / size);
        var yaw = ((nipple.distance * Math.cos(nipple.angle.radian)) / size);

        //console.log(nipple.distance);
        //console.log(nipple.distance);
        
        console.log("throttle: " + throttle + ", yaw: " + yaw);

    });

    document.getElementById('connect').addEventListener('click', () => {
        new Bluetooth().connect();
    });

}