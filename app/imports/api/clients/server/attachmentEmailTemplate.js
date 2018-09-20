import { Email } from "meteor/email";

export default (sendEmailForAttachment = ({
  to,
  clientName,
  from = `admin@app.in`,
  subject = `File Uploaded Sucessfully`
}) => {
  const text = `A new file has been uploaded for the client ${clientName}`;
  Email.send({ to, from, subject, text });
});
