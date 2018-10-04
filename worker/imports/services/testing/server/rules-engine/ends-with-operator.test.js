import { chai } from "meteor/practicalmeteor:chai";
import RulesEngine from "../../../RulesEngine";

//An account object with all the fields
const account = {
  acctNum: "xyzx",
  ptType: "xyzx",
  ptName: "xyzx",
  facCode: "xyzx",
  state: "xyzx",
  substate: "xyzx",
  finClass: "xyzx",
  activeInsName: "xyzx",
  tickleReason: "xyzx",
  workQueueId: "xyzx"
};

describe("Rules Engine", function() {
  it("Should Recognise  Ends With  on Account Number ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "acctNum",
            operator: "endsWith",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Ends With on Patient Type ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "ptType",
            operator: "endsWith",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Ends With on Patient Name ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "ptName",
            operator: "endsWith",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Ends With on Financial Class ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "finClass",
            operator: "endsWith",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Ends With on State ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "state",
            operator: "endsWith",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Ends With on Substate ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "substate",
            operator: "endsWith",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Ends With on Active Insurance Name ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "activeInsName",
            operator: "endsWith",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Ends With on Tickle Reason ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "tickleReason",
            operator: "endsWith",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Ends With on WorkQueue ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "workQueueId",
            operator: "endsWith",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});

describe("Rules Engine", function() {
  it("Should Recognise  Ends With on Facility Code ", function() {
    const rule = {
      data: {
        combinator: "AND",
        deName: "1",
        rules: [
          {
            field: "facCode",
            operator: "endsWith",
            value: "x"
          }
        ]
      }
    };

    chai.assert(RulesEngine.evaluate(account, rule));
  });
});
