// const express = require("express");
// const fs = require("fs");
// const bcrypt = require("bcrypt");
// const { v4: uuidv4 } = require("uuid");
// const dotenv = require("dotenv");

// dotenv.config(); // Load environment variables from .env file

// const app = express();
// const dbPath = "../../db.json"; // Path to the database file
// const port = process.env.PORT || 3001; // Server port from environment variables

// app.use(express.json()); // Middleware for parsing JSON bodies

// // Helper function to read the database
// function readDatabase(callback) {
//   fs.readFile(dbPath, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading database:", err);
//       return callback(err, null);
//     }
//     try {
//       const db = JSON.parse(data || "{}"); // Fallback to empty object
//       if (!Array.isArray(db.users)) db.users = []; // Ensure `users` is an array
//       callback(null, db);
//     } catch (parseErr) {
//       console.error("Error parsing database file:", parseErr);
//       callback(parseErr, null);
//     }
//   });
// }

// // Helper function to write to the database
// function writeDatabase(db, callback) {
//   fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
//     if (err) {
//       console.error("Error writing to database:", err);
//       return callback(err);
//     }
//     callback(null);
//   });
// }

// // Register Route
// app.post("/register", async (req, res) => {
//   const { firstName, lastName, email, mobile, password, address } = req.body;

//   if (!firstName || !lastName || !email || !mobile || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   if (!/^\S+@\S+\.\S+$/.test(email)) {
//     return res.status(400).json({ message: "Invalid email format" });
//   }

//   if (password.length < 8) {
//     return res.status(400).json({ message: "Password must be at least 8 characters long" });
//   }

//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user object
//     const newUser = {
//       id: uuidv4(), // Generate unique ID
//       firstName,
//       lastName,
//       email,
//       mobile,
//       password: hashedPassword, // Store hashed password
//       address,
//       role: "user", // Default role
//     };

//     // Read the database
//     readDatabase((err, db) => {
//       if (err) {
//         return res.status(500).json({ message: "Error reading database" });
//       }

//       // Check if email already exists
//       if (db.users.some((user) => user.email === email)) {
//         return res.status(400).json({ message: "Email is already registered" });
//       }

//       // Add the new user
//       db.users.push(newUser);

//       // Write back to the database
//       writeDatabase(db, (writeErr) => {
//         if (writeErr) {
//           return res.status(500).json({ message: "Error saving user data" });
//         }
//         res.status(201).json({ message: "User registered successfully" });
//       });
//     });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Login Route
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   // Read the database
//   readDatabase((err, db) => {
//     if (err) {
//       return res.status(500).json({ message: "Error reading database" });
//     }

//     // Find the user by email
//     const user = db.users.find((u) => u.email === email);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Compare the provided password with the hashed password
//     bcrypt.compare(password, user.password, (compareErr, isMatch) => {
//       if (compareErr || !isMatch) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }

//       // Exclude password from the user data in the response
//       const { password, ...userData } = user;
//       res.status(200).json(userData);
//     });
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const cors = require("cors"); // Import CORS

const app = express();
const dbPath = "../../db.json"; // Path to the database file
const port = 3001; // Server port

app.use(cors()); // Use CORS middleware to enable cross-origin requests
app.use(express.json()); // Middleware for parsing JSON bodies

// Helper function to read and write the database
function readDatabase(callback) {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading database:", err);
      return callback(err, null);
    }
    try {
      const db = JSON.parse(data);
      callback(null, db);
    } catch (parseErr) {
      console.error("Error parsing database file:", parseErr);
      callback(parseErr, null);
    }
  });
}

function writeDatabase(db, callback) {
  fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
    if (err) {
      console.error("Error writing to database:", err);
      return callback(err);
    }
    callback(null);
  });
}

// Register Route
app.post("/register", async (req, res) => {
  const { firstName, lastName, email, mobile, password, address } = req.body;

  if (!firstName || !lastName || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      id: Date.now().toString(), // Generate a unique ID
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword, // Store the hashed password
      address,
      role: req.body.role || "user", // Assign role from request or default to 'user'
    };

    // Read the database
    readDatabase((err, db) => {
      if (err) {
        return res.status(500).json({ message: "Error reading database" });
      }

      // Check if the email already exists
      if (db.users.some((user) => user.email === email)) {
        return res.status(400).json({ message: "Email is already registered" });
      }

      // Add the new user
      db.users.push(newUser);

      // Write back to the database
      writeDatabase(db, (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ message: "Error saving user data" });
        }
        res.status(201).json({ message: "registered successfully" });
      });
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Read the database
  readDatabase((err, db) => {
    if (err) {
      return res.status(500).json({ message: "Error reading database" });
    }

    // Find the user by email
    const user = db.users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password
    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr || !isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Login successful, return user data (excluding the password)
      const { password, ...userData } = user;
      res.status(200).json(userData);
    });
  });
});

// Get all users (Admin or authorized access only)
app.get("/users", (req, res) => {
  // Read the database
  readDatabase((err, db) => {
    if (err) {
      return res.status(500).json({ message: "Error reading database" });
    }
    // Return the list of users
    res.status(200).json(db.users);
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  // Read the database
  readDatabase((err, db) => {
    if (err) {
      return res.status(500).json({ message: "Error reading database" });
    }

    // Find and remove the user by ID
    const userIndex = db.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = db.users.splice(userIndex, 1);

    // Write the updated database
    writeDatabase(db, (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ message: "Error updating database" });
      }
      res
        .status(200)
        .json({ message: "User deleted successfully", deletedUser });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
