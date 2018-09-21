import { Email } from "meteor/email";

export default (sendEmail = ({
  userEmail,
  accName,
  reason,
  repData,
  from = `admin@app.in`,
  subject = `Escalation`
}) => {
  const text = `${repData} has escalated ${accName} for you and the reason behind this is ${reason} Kindly have a look.`;
  Email.send({ to: userEmail, from, subject, text });
});
