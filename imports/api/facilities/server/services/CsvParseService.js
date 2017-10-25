export default class CsvParseService {

    static configuration = {
        hasHeader: false,
        acctNum: 1,
        facCode: 2,
        ptType: 3,
        ptName: 4,
        dischrgDate: 5,
        fbDate: 6,
        acctBal: 7,
        finClass: 8,
        admitDate: 9,
        medNo: 10,
        insName: 11,
        insName2: 12,
        insName3: 13,
        insCode: 14,
        insCode2: 15,
        insCode3: 16,
        insBal: 17,
        insBal2: 18,
        insBal3: 19,
    };


    static convertToTask(results) {
        // console.log(results.length);

        const startIndex = CsvParseService.configuration.hasHeader ? 1 : 0;

        for (let i = startIndex; i < results.length - 1; i++) {
            CsvParseService.createTask(results[i]);
        }
    }

    static createTask(data) {
        let task = {};
        for (key in CsvParseService.configuration) {
            // console.log(key);
            if (key !== 'hasHeader') {
                task[key] = data[CsvParseService.configuration[key] - 1];
            }
        }
        console.log(task);
    }
}