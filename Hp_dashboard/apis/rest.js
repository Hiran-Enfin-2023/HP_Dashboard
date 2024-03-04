 const Transcript = require("./models/Transcript");
const Users = require("./models/Users");
const Admin = require("./models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { ObjectId } = require("mongodb");
const { authenticateUser } = require("./middleware/auth");
const path = require("path");
const sqlite = require("sqlite3").verbose();

const SQL_DB_PATH = "/home/efin/Code/Hp_dashboard/db/chatbot.sqlite"
const db = new sqlite.Database(SQL_DB_PATH , sqlite.OPEN_READONLY, (err) => {
  if (err) {
    console.error(`Error opening database: ${err.message}`);
  } else {
    console.log(`Connected to the database: ${SQL_DB_PATH }`);
  }
});
const port = process.env.PORT;


module.exports = {
  init: function (app, config) {
    var fs = require("fs");
    var mongoose = require("mongoose");
    const db_URL =
      port === "5000"
        ? config.db_URL_HP
        : port === "5001"
        ? config.db_URL_EXPO
        : config.db_URL_XCYTE
    mongoose.connect(db_URL);
    const ALLOW_DUPLICATE = true;
    /**
     * For saving users visited
     */
    app.post("/rest/save-user", (req, res) => {
      let params = req.body;
      const users = new Users(params);
      const findUser = Users.find({
        name: params.name,
        email: params.email,   
      }).exec((err, user) => {
        if (err) return;
        if (user.length !== 0) {
          let resultObj = {};
          resultObj.status = "success";
          resultObj.message = "User-Data retrieved successfully";
          resultObj.results = user[0];
          return res.end(JSON.stringify(resultObj));
        } else {
          return users.save().then((doc) => {
            let resultObj = {};
            resultObj.status = "success";
            resultObj.message = "Saved successfully";
            resultObj.results = doc;
            res.send(JSON.stringify(resultObj));
          });
        }
      });
    });


    // Get all sessions

    app.get('/rest/sessions', (req, res) => {
      // console.log("Hello");
      const query = 'SELECT DISTINCT sessionId FROM Messages';
      db.all(query, [], (err, rows) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          const sessions = rows.map(row => row.sessionId);
          res.json(sessions);
        }
      });
    });
  

    app.get('/rest/messages/:sessionId', (req, res) => {
      const sessionId = req.params.sessionId;
      // console.log(sessionId);
      const query = 'SELECT * FROM Messages WHERE sessionId = ?';
      db.all(query, [sessionId], (err, rows) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(rows);
        }
      });
    });

    
    /**
     * For admin details
     */
    app.post("/rest/login-admin", async (req, res) => {
      let { username, password, email, initialAdmin = false } = req.body;
      try {
        const admin = new Admin({
          name: username,
          email,
          password,
        });
        initialAdmin &&
          (await admin.save().then((admin) => {
            if (admin) {
              res.status(200).json({
                status: true,
                message: "Admin created successfully",
                results: {
                  id: admin._id,
                  name: admin.name,
                  email: admin.email,
                },
              });
            }
          }));
        !initialAdmin &&
          Admin.findOne({
            name: username,
            email,
          }).exec(async (err, admin) => {
            // console.log("find admin", admin);
            if (err) {
              res.status(400).json({
                status: false,
                message: "Error: Failed to fetch the admin details",
                results: {},
              });
            }
            if (!admin) {
              res.status(400).json({
                status: false,
                message: "Admin details not found",
                results: {},
              });
            }
            if (admin) {
              const passwordMatch = await bcrypt.compare(
                password,
                admin.password
              );
              if (!passwordMatch) {
                res.status(400).json({
                  status: false,
                  message: "Invalid credentials",
                  results: {},
                });
              } else {
                const token = jwt.sign({id:admin._id},process.env.JWT_SECRET_KEY)
                res.status(200).json({
                  status: true,
                  message: "Admin details retrieved successfully",
                  results: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    access_token: token,
                  },
                });
      
              }
            }
          });
      } catch (error) {
        res
          .status(500)
          .json({ status: "false", message: `${error?.message}`, results: {} });
      }
    });

    /**
     * For saving transcript
     */
    app.post("/rest/save-transcript", authenticateUser, (req, res) => {
      let params = req.body;
      const transcript = new Transcript(params);
      return transcript.save().then((doc) => {
        let resultObj = {};
        resultObj.status = "success";
        resultObj.message = "Saved successfully";
        resultObj.results = doc;
        res.end(JSON.stringify(resultObj));
      });
    });
    /**
     * For getting transcript
     */
    app.get("/rest/fetch-transcript/:sessionId", authenticateUser, (req, res) => {
      let params = { sessionId: req.params.sessionId };
      console.log(params);
      var resultObj = {};
      Transcript.find(params, {}, { skip: 0, limit: 10000 })
        .populate("sessionId")
        .sort({ date: 1 })
        .exec(function (error, doc) {
          if (doc.length > 0) {
            resultObj.status = "success";
            resultObj.message = "Transcript fetch Successfully";
            resultObj.results = doc;
            res.end(JSON.stringify(resultObj));
          } else {
            resultObj.status = "failed";
            resultObj.message = "No transcripts found !";
            resultObj.results = [];
            res.end(JSON.stringify(resultObj));
          }
        });
    });



    /**
     * For getting all users
     */
    app.get("/rest/fetch-users", authenticateUser, (req, res) => {
      let params = req.body;
      var resultObj = {};
      Users.find(params, {}, { skip: 0, limit: 10000 })
        .sort({ date: -1 })
        .exec(function (error, doc) {
          if (doc.length > 0) {
            resultObj.status = "success";
            resultObj.message = "Users Listed Successfully";
            resultObj.results = doc;
            res.end(JSON.stringify(resultObj));  
          } else {
            resultObj.status = "failed";
            resultObj.message = "No users found !";
            resultObj.results = [];
            res.end(JSON.stringify(resultObj));
          }
        });
    });
  },
};
