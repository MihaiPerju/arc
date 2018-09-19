const triggerEnum = {
  ACTION: "action",
  ASSIGN_WORK_QUEUE: "assignWorkQueue",
  ASSIGN_USER: "assignUser",
  EDIT: "edit"
};

export default triggerEnum;

const triggerOptions = [
  {
    label: "Action Account",
    value: triggerEnum.ACTION
  },
  {
    label: "Assign Work Queue",
    value: triggerEnum.ASSIGN_WORK_QUEUE
  },
  {
    label: "Assign User",
    value: triggerEnum.ASSIGN_USER
  },
  {
    label: "Edit Account",
    value: triggerEnum.EDIT
  }
];

export { triggerOptions };
