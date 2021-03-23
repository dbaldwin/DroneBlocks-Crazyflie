export default class Queue {

    constructor() {
        this.queue = [];
    }

    put(item) {
        this.queue.push(item);
    }

    get() {

        if (!this.isEmpty()) {
            return this.queue.shift();
        } else {
            return 'empty';
        }
    }

    isEmpty() {
        return this.queue.length == 0;
    }


}