import { chai } from "meteor/practicalmeteor:chai";
import RulesEngine from "../../../RulesEngine";

//An account object with all the fields
const account = {
  acctNum: "w",
  ptType: "w",
  ptName: "w",
  dischrgDate: "Thu Oct 02 2018 22:33:07 GMT+0100 (British Summer Time)",
  fbDate: "Thu Oct 02 2018 22:33:07 GMT+0100 (British Summer Time)",
  admitDate: "Thu Oct 02 2018 22:33:07 GMT+0100 (British Summer Time)",
  acctBal: 1,
  facCode: "w",
  state: "w",
  substate: "w",
  finClass: "w",
  activeInsName: "w",
  tickleDate: "Thu Oct 02 2018 22:33:07 GMT+0100 (British Summer Time)",
  tickleReason: "w",
  workQueueId: "w",
  medNo: 1
};

describe("Rules Engine", function() {
  it("Should Recognise  No Equality  on Account Number ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "acctNum",
            operator: "!=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Patient Type ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "ptType",
            operator: "!=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Patient Name ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "ptName",
            operator: "!=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Discharge Date ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "dischrgDate",
            operator: "!=",
            value: "Thu Oct 04 2018 00:00:00 GMT+0100 (British Summer Time)"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Last Bill Date ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "fbDate",
            operator: "!=",
            value: "Thu Oct 04 2018 00:00:00 GMT+0100 (British Summer Time)"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Account Balance ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "acctBal",
            operator: "!=",
            value: 10
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Financial Class ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "finClass",
            operator: "!=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Admit Date ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "admitDate",
            operator: "!=",
            value: "Thu Oct 04 2018 00:00:00 GMT+0100 (British Summer Time)"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on State ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "state",
            operator: "!=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Substate ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "substate",
            operator: "!=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Active Insurance Name ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "activeInsName",
            operator: "!=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Tickle Date ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "tickleDate",
            operator: "!=",
            value: "Thu Oct 04 2018 00:00:00 GMT+0100 (British Summer Time)"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Tickle Reason ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "tickleReason",
            operator: "!=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on WorkQueue ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "workQueueId",
            operator: "!=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Facility Code ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "facCode",
            operator: "!=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  No Equality on Medical Number ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "medNo",
            operator: "!=",
            value: 10
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});
