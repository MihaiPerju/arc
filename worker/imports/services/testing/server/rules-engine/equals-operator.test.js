import { chai } from "meteor/practicalmeteor:chai";
import RulesEngine from "../../../RulesEngine";

//An account object with all the fields
const account = {
  acctNum: "x",
  ptType: "x",
  ptName: "x",
  dischrgDate: "Thu Oct 04 2018 22:33:07 GMT+0100 (British Summer Time)",
  fbDate: "Thu Oct 04 2018 22:33:07 GMT+0100 (British Summer Time)",
  admitDate: "Thu Oct 04 2018 22:33:07 GMT+0100 (British Summer Time)",
  acctBal: 10,
  facCode: "x",
  state: "x",
  substate: "x",
  finClass: "x",
  activeInsName: "x",
  tickleDate: "Thu Oct 04 2018 22:33:07 GMT+0100 (British Summer Time)",
  tickleReason: "x",
  workQueueId: "x",
  medNo: 10
};

describe("Rules Engine", function() {
  it("Should Recognise  Equality  on Account Number ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "acctNum",
            operator: "=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Patient Type ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "ptType",
            operator: "=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Patient Name ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "ptName",
            operator: "=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Discharge Date ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "dischrgDate",
            operator: "=",
            value: "Thu Oct 04 2018 00:00:00 GMT+0100 (British Summer Time)"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Last Bill Date ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "fbDate",
            operator: "=",
            value: "Thu Oct 04 2018 00:00:00 GMT+0100 (British Summer Time)"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Account Balance ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "acctBal",
            operator: "=",
            value: 10
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Financial Class ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "finClass",
            operator: "=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Admit Date ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "admitDate",
            operator: "=",
            value: "Thu Oct 04 2018 00:00:00 GMT+0100 (British Summer Time)"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on State ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "state",
            operator: "=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Substate ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "substate",
            operator: "=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Active Insurance Name ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "activeInsName",
            operator: "=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Tickle Date ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "tickleDate",
            operator: "=",
            value: "Thu Oct 04 2018 00:00:00 GMT+0100 (British Summer Time)"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Tickle Reason ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "tickleReason",
            operator: "=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on WorkQueue ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "workQueueId",
            operator: "=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Facility Code ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "facCode",
            operator: "=",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Equality on Medical Number ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "medNo",
            operator: "=",
            value: 10
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});
