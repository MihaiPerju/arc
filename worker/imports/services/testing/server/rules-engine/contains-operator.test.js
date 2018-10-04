import { chai } from "meteor/practicalmeteor:chai";
import RulesEngine from "../../../RulesEngine";

//An account object with all the fields
const account = {
  acctNum: "xyz",
  ptType: "xyz",
  ptName: "xyz",
  facCode: "xyz",
  state: "xyz",
  substate: "xyz",
  finClass: "xyz",
  activeInsName: "xyz",
  tickleReason: "xyz",
  workQueueId: "xyz"
};

describe("Rules Engine", function() {
  it("Should Recognise  Contains  on Account Number ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "acctNum",
            operator: "contains",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Contains on Patient Type ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "ptType",
            operator: "contains",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Contains on Patient Name ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "ptName",
            operator: "contains",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Contains on Financial Class ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "finClass",
            operator: "contains",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Contains on State ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "state",
            operator: "contains",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Contains on Substate ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "substate",
            operator: "contains",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Contains on Active Insurance Name ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "activeInsName",
            operator: "contains",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Contains on Tickle Reason ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "tickleReason",
            operator: "contains",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Contains on WorkQueue ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "workQueueId",
            operator: "contains",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Contains on Facility Code ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "facCode",
            operator: "contains",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});
