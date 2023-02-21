const mysql = require("mysql2");
const database = require("./database");

// add a job to the jobsArray in the database
database.addJob({...});

// access the jobsArray in the database
console.log(database.jobsArray);


const connection = mysql.createConnection({
  host: "localhost",
  user: "yourUsername",
  password: "yourPassword",
  database: "database.js",
});

// When the submit button is clicked, insert the data into the database
document.querySelector(".submitButton").addEventListener("click", function () {
  const jobTitle = document.querySelector("#jobTitle").value;
  const newJobType = document.querySelector("#newJobType").value;
  const jobPrice = document.querySelector("#jobPrice").value;
  const newJobDescription = document.querySelector("#newJobDescription").value;
  const fileInput = document.querySelector("#file-input").value;

  connection.query(
    "INSERT INTO jobs (title, type, price, description, file) VALUES (?, ?, ?, ?, ?)",
    [jobTitle, newJobType, jobPrice, newJobDescription, fileInput],
    function (error, results) {
      if (error) throw error;
      console.log("Data inserted into the database");
    }
  );
});
