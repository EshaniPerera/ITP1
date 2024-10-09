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
  password: "root",
  database: "users",
};

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

// Get all Premiumcustomers
app.get("/premium", (req, res) => {
  const sql = "SELECT * FROM customers WHERE is_premium_customer = 1";
  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json("Server Error");
    }
    return res.status(200).json(data);
  });
});

// Get Premiumcustomers by username
app.get("/premium/:username", (req, res) => {
  const username = req.params.username;
  const sql = "SELECT * FROM customers WHERE username = ?";
  
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error fetching customer details:', err);
      return res.status(500).json({ error: "Error fetching customer details" });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const customerDetails = result[0];
    console.log('Fetched customer details:', customerDetails);
    res.json(customerDetails);
  });
});


app.post('/create', (req, res) => {
  const { username, firstName, lastName, email, phoneNumber, city, password, address } = req.body;

  const sql = "INSERT INTO customers (username, first_name, last_name, email, phone_number, city, password, address, is_premium_customer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)";

  db.query(sql, [username, firstName, lastName, email, phoneNumber, city, password, address], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json("Server Error");
    }
    return res.status(201).json({ message: "Premium Customer Created", id: result.insertId });
  });
});

// Update customer
app.put('/premium/update/:username', (req, res) => {
  const { firstName, lastName, email, phoneNumber, city, address, password } = req.body;
  const username = req.params.username;

  console.log('Received update request for username:', username);
  console.log('Update data:', { firstName, lastName, email, phoneNumber, city, address, password: password ? '[REDACTED]' : undefined });

  let sql = "UPDATE customers SET first_name = ?, last_name = ?, email = ?, phone_number = ?, city = ?, address = ?";
  let values = [firstName, lastName, email, phoneNumber, city, address];

  if (password) {
    sql += ", password = ?";
    values.push(password);
  }

  sql += " WHERE username = ?";
  values.push(username);

  console.log('Update SQL:', sql);
  console.log('Update Values:', values.map(v => v === password ? '[REDACTED]' : v));

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating customer:', err);
      return res.status(500).json("Server Error");
    }
    console.log('Customer updated successfully');
    res.status(200).json({ message: "Customer Updated Successfully", result: result });
  });
});



// Delete customer
app.delete('/premium/:username', (req, res) => {
  const sql = "DELETE FROM customers WHERE username = ?";
  const username = req.params.username;
  
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error deleting customer:', err);
      return res.status(500).json("Server Error");
    }
    return res.json({ message: "Customer deleted successfully", result: result });
  });
});

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


