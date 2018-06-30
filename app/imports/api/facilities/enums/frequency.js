/**
 * These enums are for defining the options for timing and cronjobs.
 * The label will contain the display string, while the
 * value will be string that will be parsed by cronjob
 */
const frequencyEnum = {
  HOURLY: "time string for hourly",
  TWICE_A_DAY: "time string for twice",
  DAILY: "time string for daily",
  WEEKLY: "time string for weekly"
};

const allowedFrequencies = [
  frequencyEnum.HOURLY,
  frequencyEnum.TWICE_A_DAY,
  frequencyEnum.DAILY,
  frequencyEnum.WEEKLY
];

const frequencyOptions = [
  { label: "Hourly", value: frequencyEnum.HOURLY },
  { label: "Twice a day", value: frequencyEnum.TWICE_A_DAY },
  { label: "Daily", value: frequencyEnum.DAILY },
  { label: "Weekly", value: frequencyEnum.WEEKLY }
];

export default allowedFrequencies;
export { frequencyEnum, frequencyOptions };

