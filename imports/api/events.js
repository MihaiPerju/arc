import EventEmitter from 'event-emitter';

const Dispatcher = new EventEmitter();
export default Dispatcher;

const Events = {
    USER_REGISTERED: 'user_registered'
};

export { Dispatcher, Events }