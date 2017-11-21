import EventEmitter from 'event-emitter';

const Dispatcher = new EventEmitter();
export default Dispatcher;

const Events = {
    TASK_ACTION_ADDED: 'task_action_added'
};

export { Dispatcher, Events }