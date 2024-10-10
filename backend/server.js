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
// app.get("/premium", (req, res) => {
//   const sql = "SELECT * FROM customers WHERE is_premium_customer = 1";
//   db.query(sql, (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json("Server Error");
//     }
//     return res.status(200).json(data);
//   });
// });


// Get Premium customer by username
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


//Creating A new customer when signup button clicked and filled the form
app.post('/create', (req, res) => {
  const { username, firstName, lastName, email, phoneNumber, city, password, address } = req.body;

  // SQL to insert into customers table
  const sqlInsertCustomer = `INSERT INTO customers 
    (username, first_name, last_name, email, phone_number, city, password, address, is_premium_customer) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`;

  // Insert into customers table
  db.query(sqlInsertCustomer, [username, firstName, lastName, email, phoneNumber, city, password, address], (err, result) => {
    if (err) {
      console.error("Error inserting into customers table:", err);
      return res.status(500).json("Server Error");
    }

    // SQL to insert into premium_registration table
    const sqlInsertPremiumReg = `INSERT INTO premium_registration 
      (customer_username, registration_date, badge_status) 
      VALUES (?, CURDATE(), NULL)`;

    // Insert into premium_registration table using username
    db.query(sqlInsertPremiumReg, [username], (err, result) => {
      if (err) {
        console.error("Error inserting into premium_registration table:", err);
        return res.status(500).json("Server Error");
      }

      // Success response
      return res.status(201).json({ 
        message: "Premium Customer Created and Registered Successfully", 
        username: username 
      });
    });
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


//Get premium customers with badge status
app.get('/premiumbatch', (req, res) => {
  const sqlQuery = `
    SELECT 
      c.username, c.first_name, c.last_name, c.phone_number, c.email, pr.registration_date,
      CASE 
        WHEN DATEDIFF(CURDATE(), pr.registration_date) < 30 THEN 'New'
        WHEN DATEDIFF(CURDATE(), pr.registration_date) BETWEEN 30 AND 89 THEN '30 Days Badge'
        WHEN DATEDIFF(CURDATE(), pr.registration_date) >= 90 THEN '90 Days Badge'
      END AS badge_status
    FROM premium_registration pr
    JOIN customers c ON pr.customer_username = c.username`;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error("Error fetching premium customers:", err);
      return res.status(500).json("Server Error");
    }
    res.status(200).json(result);
  });
});


//if custoemr table got details of the customer even without the premium registration table

//Get premium customers with badge status
// app.get('/premiumbatch2', (req, res) => {
// const sqlQuery = `
//     SELECT 
//       c.username, 
//       c.first_name, 
//       c.last_name, 
//       c.phone_number, 
//       c.email, 
//       pr.registration_date,
//       CASE 
//         WHEN pr.registration_date IS NULL THEN 'No Badge'
//         WHEN DATEDIFF(CURDATE(), pr.registration_date) < 30 THEN 'New'
//         WHEN DATEDIFF(CURDATE(), pr.registration_date) BETWEEN 30 AND 89 THEN '30 Days Badge'
//         WHEN DATEDIFF(CURDATE(), pr.registration_date) >= 90 THEN '90 Days Badge'
//       END AS badge_status
//     FROM customers c
//     LEFT JOIN premium_registration pr ON c.username = pr.customer_username
//     WHERE c.is_premium_customer = 1`;

//   db.query(sqlQuery, (err, result) => {
//     if (err) {
//       console.error("Error fetching premium customers with badge status:", err);
//       return res.status(500).json("Server Error");
//     }
//     res.status(200).json(result);
//   });
// });




