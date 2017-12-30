import moment from 'moment';

if (Meteor.isServer) {
    const now = moment();
    const tomorrow = now.add('1', 'days');
    //if is our needed hour
    if (now.hour()) {

        //Check the week day.
        switch (now.day()) {
            case 0:
            //Sunday
            //FIRE!
            case 1:
            //Monday
            //FIRE!
            case 2:
            //Tuesday
            //FIRE!
            case 3:
            //Wednesday
            //FIRE!
            case 4:
            //Thursday
            //FIRE!
            case 5:
            //Friday
            //FIRE!
            case 6:
            //Saturday
            //FIRE!
        }

        //Check the day of Month
        if (now.date() === 1) {
            //FIRE!
        }

        if ([28, 29, 30, 31].includes(now.date())) {
            //28,29,30,31 can be last days. If the next day is the first
            // day of month then it's the last day of the actual month
            if (tomorrow.date() === 1) {
                //FIRE!

            }

        }

        //Check the day of the year
        if (now.dayOfYear() === 1) {
            //Beginning of the year
            //FIRE!
        }
        if (tomorrow.dayOfYear() === 1) {
            //If the next day is the first day of year now is the End of the actual year
            //FIRE!
        }
    }
}