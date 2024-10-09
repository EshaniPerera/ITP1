
import express from "express";
import mysql from "mysql";
import cors from "cors";
import schedule from "node-schedule";

const app = express();
const port = 8800;

// MySQL connection options
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Eshani@123",
  database: "test",
};

/*const dbConfig = {
  host: "localhost",
  user: "root",
  password: "chamath77",
  database: "besteats",
};*/

app.use(express.json());
app.use(cors());

// Function to handle MySQL connection and reconnection
let db;

function handleDisconnect() {
  db = mysql.createConnection(dbConfig);

  db.connect(function (err) {
    if (err) {
      console.log("Error connecting to database:", err);
      // setTimeout(handleDisconnect, 2000); // Try reconnecting after 2 seconds
    } else {
      console.log("Connected to database");
    }
  });

  db.on("error", function (err) {
    console.log("Database error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.fatal) {
      handleDisconnect(); // Reconnect if connection is lost
    } else {
      throw err; // Handle non-fatal errors differently
    }
  });
}

// Initial connection
handleDisconnect();

app.listen(port, () => {
  console.log(`App started and listening on port ${port}`);
});

// app.get("/", (req, res) => {
//   res.send("Hello this is backend!");
// });

// app.get("/", (req, res) => {
//     res.send("Hello this is backend!");
//   });


app.get("/Users/Login", (req, res) => {
  const sqlSelect = "SELECT * FROM customers";

  db.query(sqlSelect, (err, data) => {
    if (err) {
      console.log("Error occurred:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.status(200).json(data);
  });
});


app.post('/create', (req, res) => {
  const { name, address, phone_number, email } = req.body; // Destructuring the body

  const sql = "INSERT INTO premium (username, fname, lname, email, phone_number, city, password) VALUES (?, ?, ?, ?, ?, ?, ?)"; 

  db.query(sql, [name, address, phone_number, email], (err, data) => {
    if (err) {
      console.error(err); // Log error
      return res.status(500).json("Server Error");
    }
    // After inserting a new premium customer, also insert a record in premium_registration
    const registrationDate = new Date(); // Current date
    const insertRegistrationSql = "INSERT INTO premium_registration (premium_id, registration_date) VALUES (?, ?)";
    const premiumId = data.insertId; // Get the id of the newly created premium customer

    db.query(insertRegistrationSql, [premiumId, registrationDate], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json("Server Error");
      }
      return res.status(201).json({ message: "Premium Customer Created", data });
    });
  });
});

app.put('/update/:id', (req, res) => {
   const { name, phone_number , email } = req.body; // Destructure from req.body
   const sql = "UPDATE premium SET username = ?, fname = ?, lname = ?, email = ?, phone_number = ?, city = ?, password = ?";
   const id = req.params.id;

   db.query(sql, [name, address, phone_number, email, id], (err, data) => {
       if (err) {
           console.error(err);
           return res.status(500).json("Server Error");
       }
       return res.status(200).json({ message: "Premium Customer Updated", data });
   });
  });


 app.delete('/premium/:id', (req, res) => {
     const sql = "DELETE FROM premium WHERE ID = ?";
     const id = req.params.id;
    
     db.query(sql, [id], (err, data) => {
         if(err) return res.json("ERROR");
         return res.json(data);
     })
 })

 // Function to update badge status based on registration date
const updateBadgeStatus = () => {
  const currentDate = new Date();
  const query = `
    UPDATE premium_registration
    SET badge_status = CASE 
      WHEN DATEDIFF(CURDATE(), registration_date) = 30 THEN '30 Days Completed'
      WHEN DATEDIFF(CURDATE(), registration_date) = 90 THEN '90 Days Completed'
      ELSE badge_status
    END
    WHERE badge_status IS NULL AND DATEDIFF(CURDATE(), registration_date) IN (30, 90);
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Updated badge status for ${results.affectedRows} customers.`);
  });
};

// Schedule the badge status update to run daily at midnight
schedule.scheduleJob('0 0 * * *', () => {
  updateBadgeStatus();
});


