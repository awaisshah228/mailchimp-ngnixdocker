
require('dotenv').config()
const express=require('express')
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app=express();
const path= require('path')




app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(cors())

/**
 * Todo: puting in env
 */
mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER,
});
const listId = process.env.LIST_ID;

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'publci',  'index.html'))
})


app.post('/signup', async(req, res) => {
  const { firstName, lastName, email } = req.body;
  // console.log(firstName)
// 
  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect('/fail.html');
    return;
  }

  mailchimp.lists.addListMember(listId, {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName
    }
  }).then(res.statusCode === 200 ?
    res.redirect('/success.html') :
    res.redirect('/fail.html'))
  .catch(err => console.log(err))

  
    
})


app.listen(3000,()=>{
  console.log("Connected")
})