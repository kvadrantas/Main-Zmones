// *****************************************************************************
// EXPRESS WEBSERVER IMPORT
// MAIN/DEFAULT WEB SERVER PARAMETERS
import express from "express";
const app = express();
const PORT = 3333;    // Sets default website port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
const WEB = "web";
app.use(express.static(WEB, {    // Like "Default Document" on ISS
  index: ["index.html"]
}));

// ADDITIONAL WEB SERVER PARAMETERS 
// Suteikia funkcionaluma automatiskai iskaidyti URL'e esancius parametrus
// i atskirus objektus. Visu ju vertes tekstines, todel skaitines reiksmes reikia
// konvertuotis i skaicius.
app.use(express.urlencoded({
  extended: true,
}));
// *****************************************************************************
// HANDLEBARS FOR EXPRESS WEB SERVER IMPORT 
import handleBars from "express-handlebars";
// app.engine('handlebars', handleBars()); // DEFAULT
app.engine(
  "handlebars",
  handleBars({
    helpers: {
      dateFormat: (date) => {
        if (date instanceof Date) {
          let year = "0000" + date.getFullYear();
          year = year.substr(-4);
          let month = "00" + (date.getMonth() + 1);
          month = month.substr(-2);
          let day = "00" + date.getDate();
          day = day.substr(-2);
          return `${year}-${month}-${day}`;
        }
        return date;
      },
      eq: (param1, param2) => {
        return param1 === param2;
      },
    },
  }),
);

app.set('view engine', 'handlebars');
// *****************************************************************************
// IMPORT MYSQL 
import { connect, end, query } from "./db.js";
// *****************************************************************************



// *****************************************************************************
// ***************************** MASTER LENTELE ********************************
// *****************************************************************************