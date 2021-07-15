//***make an get request to an external SERVER with NODE and EXPRESS*** - native HTTPS node module
//https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html

const express = require("express");
const https = require("https")
const bodyParser = require("body-parser")
require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function(req, res){
//COMMENTED CODE WAS HERE aka GET request, whatever it comes now it belongs to POST request!(new)
res.sendFile(__dirname + "/index.html")
})

app.post("/", function(req, res) {
  // console.log("Post Request Received!")
  console.log(req.body.cityName);//cityName=HTML input name

  const query = req.body.cityName //instead of hardcoding city name
  const apiKey = process.env.API_KEY
  const units = "metric"
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey +"&units=" + units;
  https.get(url, function(response){

    console.log(response.statusCode);
    response.on("data", function(data){//method = on, when I receive data a call back function is triggered and contains data that it is then console logged in hyper
      const weatherData = JSON.parse(data)
      const temp = weatherData.main.temp//in order to extrapolate pieces of data from complex JSON USE json chrome tool!!
      const weatherDescription = weatherData.weather[0].description
      const icon = weatherData.weather[0].icon
      const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
      const city = weatherData.name
      //res.send("<h1>The Temperature in London is " + temp + " Kelvin</h1>")-> while you can have 1 only res.send, you can have multiples res.write :)
      res.write("<h1>The Temperature in " + query + " is " + temp + " degrees Celsius</h1>")
      res.write("<p>The weather is currently " + weatherDescription + "</p>")
      res.write("<img src=" + imgURL + ">")
      res.send()
      console.log(weatherData.weather[0].description)//data get fetched but in a buffered hexidecimal code => JSON format must be specified (data converted into JS Object)!! (*parse* = unwrapped ikea wardrobe vs *stringify* = wrapped ikea wardrobe box)
    })
  })//how to make a get req across the internet using HTTPS native module protocol. If I get a res, it is going to be consoled logged in hyper, include status code (200= ok!)
  //res.send("Server is up and running") You can send 1 only send each app!!
})

app.listen(3000, function() {
  console.log("Server is running on port 3000")
})
