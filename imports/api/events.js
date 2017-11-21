import EventEmitter from 'event-emitter';

const Dispatcher = new EventEmitter();
export default Dispatcher;

const Events = {
};

export { Dispatcher, Events }