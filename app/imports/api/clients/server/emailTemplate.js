import { Email } from "meteor/email";

export default sendEmail = ({ to, email}) => {
    const from="admin@app.in"
    const subject=`New Client Added`
    const text=`A new client has been assigned to you ${email}`
  Email.send({ to, from, subject, text });
};

