import React, { Component } from "react";
import TwoWayQuerybuilder from "react-two-way-querybuilder";

const fields = [
  {
    name: "firstName",
    operators: "all",
    label: "First Name",
    input: { type: "text" }
  },
  {
    name: "lastName",
    operators: "all",
    label: "Last Name",
    input: { type: "text" }
  },
  { name: "age", operators: "all", label: "Age", input: { type: "text" } },
  {
    name: "birthDate",
    operators: "all",
    label: "Birth date",
    input: { type: "text" }
  }
];

class App extends Component {
  handleChange(event) {
    console.log("query", event.query);
  }

  render() {
    return <TwoWayQuerybuilder fields={fields} onChange={this.handleChange} />;
  }
}

export default App;
