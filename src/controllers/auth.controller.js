import bcrypt from "bcrypt";
import pool from "../config/db.js";

export function getRegister(req, res) {
  res.render("register", { error: null });
}

export async function postRegister(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).render("register", { error: "All fields are required." });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length) {
      return res.status(409).render("register", { error: "Email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, passwordHash]
    );

    req.session.user = result.rows[0];
    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.status(500).render("register", { error: "Server error." });
  }
}

export function getLogin(req, res) {
  res.render("login", { error: null });
}

export async function postLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", { error: "Email and password are required." });
    }

    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (!result.rows.length) {
      return res.status(401).render("login", { error: "Invalid credentials." });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).render("login", { error: "Invalid credentials." });
    }

    req.session.user = { id: user.id, name: user.name, email: user.email };
    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.status(500).render("login", { error: "Server error." });
  }
}

export async function getDashboard(req, res) {
  try {
    const userId = req.session.user.id;
    const selectedCategory = req.query.category || "all";

    const categoriesResult = await pool.query(
      `SELECT id, name
       FROM categories
       WHERE user_id = $1
       ORDER BY name ASC`,
      [userId]
    );

    let tasksQuery = `
      SELECT t.id, t.title, t.description, t.status, t.created_at, t.category_id, c.name AS category_name
      FROM tasks t
      LEFT JOIN categories c
        ON c.id = t.category_id AND c.user_id = t.user_id
      WHERE t.user_id = $1
    `;
    const params = [userId];

    if (selectedCategory !== "all") {
      tasksQuery += ` AND t.category_id = $2`;
      params.push(Number(selectedCategory));
    }

    tasksQuery += ` ORDER BY t.created_at DESC`;

    const tasksResult = await pool.query(tasksQuery, params);

    return res.render("dashboard", {
      user: req.session.user,
      tasks: tasksResult.rows,
      categories: categoriesResult.rows,
      selectedCategory,
      error: null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("dashboard", {
      user: req.session.user,
      tasks: [],
      categories: [],
      selectedCategory: "all",
      error: "Failed to load dashboard."
    });
  }
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.redirect("/login");
  });
}