import CsvParseService from "./CsvParseService";

export default class PaymentService {
    //For placement file
    static upload(results, importRules, facilityId) {
        const payment = PaymentService.convertToPayment(results, importRules, facilityId);
    }

    static convertToPayment(results, importRules, facilityId) {
        const payments = [];
        let rules = {};
        if (importRules.hasHeader) {
            const header = results[0];
            results.splice(0, 1);
            //Need to convert the rules\
            rules = CsvParseService.convertImportingRules(importRules, header);
        }
        // console.log(importRules);
        // console.log(rules);
        for (let i = 0; i < results.length - 1; i++) {
            const newPayment = PaymentService.createPayment(results[i], importRules, facilityId, rules);
            payments.push(newPayment);
        }
        return payments;
    }

    static createPayment(data, importRules, facilityId, rules) {
        let payment = {};

        payment.facilityId = facilityId;
        for (key in importRules) {
            //Get the normal fields
            if (key !== 'newInsBal') {
                let value;
                if (rules.newImportRules) {
                    value = CsvParseService.convertToType(key, data[rules.newImportRules[key] - 1]);
                } else {
                    value = CsvParseService.convertToType(key, data[importRules[key] - 1]);
                }
                payment[key] = value;

            }
            else {
                //Get the insurance fields
                payment[key] = [];
                for (index in importRules[key]) {
                    let insuranceFields = importRules[key][index];
                    if (rules.newImportRules) {
                        insuranceFields = rules.newImportRules[key][index];
                    }
                    payment[key].push({
                        insBal: CsvParseService.convertToType('insBal', data[insuranceFields.insBal - 1])
                    })
                }
            }
        }
        if (rules.metaRules) {
            payment.metaData = {};
            for (key in rules.metaRules) {
                let metaValue = CsvParseService.convertToType(key, data[rules.metaRules[key] - 1]);
                payment.metaData[key] = metaValue;
            }
        }
        console.log(payment);
        // return payment;
    }
}