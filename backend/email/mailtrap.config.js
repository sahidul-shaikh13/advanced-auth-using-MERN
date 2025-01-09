import { MailtrapClient } from "mailtrap";


const TOKEN = "53c03b3bb844611a607107e77319fbcb"


export const Client = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Sahidul",
};

