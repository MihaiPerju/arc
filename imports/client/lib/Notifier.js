class Notifier {
    constructor() {
        this.notifier = null;
    }

    errorDefault(err) {
        // TODO: send log to our server
        this.error('An error occured. Try again later or contact our team.');
    }

    error(msg) {
        if (!this.notifier) {
            return;
        }

        if (!msg) {
            msg = 'Something wrong happened';
        }

        this.notifier.addNotification({
            level: 'error',
            message: msg,
        });
    }

    success(msg) {
        if (!this.notifier) {
            return;
        }

        this.notifier.addNotification({
            level: 'success',
            message: msg,
        });
    }

    info(msg) {
        this.notifier.addNotification({
            level: 'info',
            message: msg,
        });
    }

    addNotification(notificationObject) {
        if (!this.notifier) {
            return;
        }

        this.notifier.addNotification(notificationObject);
    }

    setRef(ref) {
        this.notifier = ref;
    }
}

export default new Notifier();