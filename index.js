//Description: My first node app. Displays a song list that can be edited, added to, and cleared
//Authors: Matthew Sperry, Eva Wu, Emma Plessinger, Garrett Sackley, Hannah Thomas
const express = require("express");
const app = express();
const originalData = [
  {
    SongName: "Bohemian Rhapsody",
    ArtistID: "QUEEN",
    YearReleased: "1975",
  },
  {
    SongName: "Don't Stop Believing",
    ArtistID: "JOURNEY",
    YearReleased: "1981",
  },
  {
    SongName: "Hey Jude",
    ArtistID: "BEATLES",
    YearReleased: "1968",
  },
];
//set up ejs
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//Connecting CSS
let path = require("path");
app.use(express.static(path.join(__dirname, "Public")));

//connecting the database
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "Flapjack1", //my password
    database: "MusicLabrary", //database name
    port: 5432,
  },
});

//creating path
app.get("/", (req, res) => {
  knex //from 24.6
    .select()
    .from("Songs") //table
    .then((result) => {
      res.render("index", { aSongs: result });
    });
});

//add song route
app.get("/addsong", (req, res) => {
  res.render("addsong"); //send to ejs file
});

//add song function
app.post("/addsong", (req, res) => {
  knex("Songs")
    .insert({
      SongName: req.body.SongName,
      ArtistID: req.body.ArtistID,
      YearReleased: parseInt(req.body.YearReleased),
    })
    .then((result) => {
      res.redirect("/");
    });
});

//delete button
app.get("/delete/:songid", (req, res) => {
  knex("Songs")
    .where("SongID", req.params.songid)
    .del()
    .then((results) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
});

//edit band function
app.get("/editsong/:songid", (req, res) => {
  knex
    .select("SongID", "SongName", "ArtistID", "YearReleased")
    .from("Songs")
    .where("SongID", req.params.songid) //params requires what you set
    .then((result) => {
      res.render("editsong", { aSongs: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
});

//edit song post
app.post("/editsong/:songid", (req, res) => {
  knex("Songs")
    .where("SongID", parseInt(req.body.SongID)) //comes from input name in form
    .update({
      SongName: req.body.SongName,
      ArtistID: req.body.ArtistID,
      YearReleased: parseInt(req.body.YearReleased),
    })
    .then((result) => {
      res.redirect("/");
    });
});

//start over (delete)
app.get("/startover", (req, res) => {
  knex("Songs")
    .del()
    .then((result) => {
      knex("Songs")
        .insert(originalData)
        .then((result) => {
          res.redirect("/");
        });
    });
});

//start website
app.listen(3000, () => console.log("I'm running"));
