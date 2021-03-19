export default class GamePad {

    constructor() {

        this.controllers = {};
        this.raf = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;

        window.addEventListener("gamepadconnected", (e) => {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index, e.gamepad.id,
                e.gamepad.buttons.length, e.gamepad.axes.length);

            window.requestAnimationFrame(this.updateStatus.bind(this));
        });

        window.addEventListener("gamepaddisconnected", (e) => {
            console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);
        });

    }

    updateStatus() {

        this.scan();

        // https://luser.github.io/gamepadtest/gamepadtest.js

        window.requestAnimationFrame(this.updateStatus.bind(this));
    }

    scan() {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (var i = 0; i < gamepads.length; i++) {
        
            if (gamepads[i] && (gamepads[i].index in this.controllers)) {
                this.controllers[gamepads[i].index] = gamepads[i];
            }
        }
    }
    
}