const express = require("express");
const app = express();
const requests = require("requests");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8000;

var temperature,
  location,
  min_temperature,
  max_temperature,
  description,
  country,
  degree_celcius;

const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", viewsPath);

app.get("/", (req, res) => {
  res.status(200).render("index.hbs");
});

app.post("/form_submit", (req, res) => {
  var city_name = req.body.name;
  if (city_name == "") {
    res.render("index.hbs", { temp: "Please Write The City Name" });
    return;
  }
  // console.log(city_name);
  else {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=bb2aefcee62a4f75a40a8cf64141e6b8&units=metric`
    )
      .on("data", function (chunk) {
        //   res.send();
        const file = JSON.parse(chunk);

        if (file.cod == "404") {
          res.render("index.hbs", { temp: "CITY NOT FOUND" });
          return;
        } else {
          location = file.name;
          // temperature = Math.ceil(file.main.temp);
          temperature = file.main.temp;
          min_temperature = file.main.temp_min;
          max_temperature = Math.ceil(file.main.temp_max);
          description = file.weather[0].description;
          country = file.sys.country;
          degree_celcius = "℃";

          // console.log(description);
          //   console.log(location);
        }

        res.render("index.hbs", {
          temp: temperature,
          loc: location,
          min: min_temperature,
          max: max_temperature,
          desc: description,
          vatan: country,
          degree: degree_celcius,
        });
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);

        //   console.log("end");
      });
    // res.redirect("..");
  }

  // .on("end", function (err) {
  //   if (err) return console.log("connection closed due to errors", err);

  //   //   console.log("end");
  // });
});

// app.get("/", (req, res) => {
// requests(
//   `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=bb2aefcee62a4f75a40a8cf64141e6b8&units=metric`
// )
//   .on("data", function (chunk) {
//     //   res.send();
//     const file = JSON.parse(chunk);

//     const temperature = Math.ceil(file.main.temp);
//     const location = file.name;
//     const min_temperature = file.main.temp_min;
//     const max_temperature = Math.ceil(file.main.temp_max) + 1;
//     const description = file.weather[0].description;

//     console.log(description);
//     //   console.log(location);

//     res.render("index.hbs", {
//       temp: temperature,
//       loc: location,
//       min: min_temperature,
//       max: max_temperature,
//       desc: description,
//     });
//   })
//   .on("end", function (err) {
//     if (err) return console.log("connection closed due to errors", err);

//     //   console.log("end");
//   });
// });

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

// console.log(viewsPath);
