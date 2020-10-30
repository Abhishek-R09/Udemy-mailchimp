require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER,
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailID = req.body.emailID;

  const listId = "3df1727e2e";
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: emailID,
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });

    res.sendFile(__dirname + "/success.html");
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  }

  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

//API Key
// a18b4cf605e1f18b6aa1d70d36b86f76-us17

//List id
// 3df1727e2e
