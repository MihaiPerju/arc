import { Email } from "meteor/email";

export default ({
  to,
  email,
  from = `admin@app.in`,
  subject = `New Client Added`
}) => {
  const text = `A new client has been assigned to you ${email}`;
  Email.send({ to, from, subject, text });
};
