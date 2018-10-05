// import ParseService from "/imports/api/facilities/server/services/CsvParseService";
// import { chai } from "meteor/practicalmeteor:chai";

// describe("Create Task from CSV", function() {
//   it("Must create a account from an CSV ", function() {
//     //Given input
//     const input = [
//       "AcnxX49kFFBTDxF5m",
//       "M",
//       "M",
//       "4",
//       "01/02/2018",
//       "12/02/2015",
//       "7",
//       "8",
//       "12/02/2015",
//       "10",
//       "11",
//       "12",
//       "13",
//       "14",
//       "15",
//       "16",
//       "17",
//       "18",
//       "19"
//     ];

//     //Given importing rules
//     const importingRules = {
//       acctNum: 1,
//       facCode: 2,
//       ptType: 3,
//       ptName: 4,
//       dischrgDate: 5,
//       fbDate: 6,
//       acctBal: 7,
//       finClass: 8,
//       admitDate: 9,
//       medNo: 10,
//       insName: 11,
//       insName2: 12,
//       insName3: 13,
//       insCode: 14,
//       insCode2: 15,
//       insCode3: 16,
//       insBal: 17,
//       insBal2: 18,
//       insBal3: 19
//     };
//     const rules = { importingRules };
//     const facilityId = "abcdefghijklmnop";
//     const output = ParseService.createAccount(
//       input,
//       importingRules,
//       true,
//       facilityId,
//       rules
//     );

//     delete output.dischrgDate;
//     delete output.admitDate;
//     delete output.fbDate;

//     let expectedOutput = {
//       facilityId: "abcdefghijklmnop",
//       acctNum: "AcnxX49kFFBTDxF5m",
//       facCode: "M",
//       ptType: "M",
//       ptName: 4,
//       acctBal: 7,
//       finClass: 8,
//       medNo: 10,
//       insName: 11,
//       insName2: 12,
//       insName3: 13,
//       insCode: 14,
//       insCode2: 15,
//       insCode3: 16,
//       insBal: 17,
//       insBal2: 18,
//       insBal3: 19
//     };

//     let test = () => {
//       for (let key in output) {
//         if (output[key] != expectedOutput[key]) {
//           return false;
//         }
//       }
//       return true;
//     };

//     // assert that test is true
//     chai.assert(test() === true);
//   });
// });
