const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5033;
const SECRET_KEY = "your secret key";

// middleware
app.use(cors());
app.use(bodyParser.json());

// połączenie z bazą
const sequelize = new Sequelize("logged-users", "postgres", "2800", {
  host: "localhost",
  dialect: "postgres",
});

// testowanie połączenia z baza
sequelize
  .authenticate()
  .then(() => {
    console.log("Połączono z bazą...");
  })
  .catch((err) => {
    console.error("Error" + err);
  });

// definiowanie modelu
const User = sequelize.define("user", {
  name: { type: Sequelize.STRING },
  surname: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING, unique: true },
  password: { type: Sequelize.STRING },
});

const Task = sequelize.define("task", {
  name: { type: Sequelize.STRING },
  userId: { type: Sequelize.INTEGER },
});

// Relacja między użytkownikiem a zadaniami
User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

// synchronizacja bazy
sequelize
  .sync()
  .then(() => {
    console.log("Tabela zostala utworzona");
  })
  .catch((err) => {
    console.error("Error" + err);
  });

app.post("/register", async (req, res) => {
  const { name, surname, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      surname,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    console.error("Error in /register: ", error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "You are logged in", token, name: user.name });
  } catch (error) {
    console.error("Error in /login: ", error);
    res.status(400).json({ error: error.message });
  }
});

// Middleware do uwierzytelniania
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// CRUD dla zadań
app.get("/tasks", authenticate, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.userId } });
    res.json(tasks);
  } catch (error) {
    console.error("Error in /tasks: ", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/tasks", authenticate, async (req, res) => {
  const { name } = req.body;
  try {
    const task = await Task.create({ name, userId: req.userId });
    res.status(201).json(task);
  } catch (error) {
    console.error("Error in /tasks: ", error);
    res.status(400).json({ error: error.message });
  }
});

app.delete("/tasks/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await Task.destroy({ where: { id, userId: req.userId } });
    res.status(204).send();
  } catch (error) {
    console.error("Error in /tasks/:id: ", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/tasks/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await Task.update({ name }, { where: { id, userId: req.userId } });
    const updatedTask = await Task.findByPk(id);
    res.json(updatedTask);
  } catch (error) {
    console.error("Error in /tasks/:id: ", error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server działa na porcie ${port}`);
});
