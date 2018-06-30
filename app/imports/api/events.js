import EventEmitter from 'event-emitter';

const Dispatcher = new EventEmitter();
export default Dispatcher;

const Events = {
    ACCOUNT_ACTION_ADDED: 'account_action_added'
};

export { Dispatcher, Events }