import pool from "../config/db.js";

export async function createCategory(req, res) {
  try {
    const userId = req.session.user.id;
    const { name } = req.body;

    if (!name || !name.trim()) return res.redirect("/dashboard");

    await pool.query(
      `INSERT INTO categories (user_id, name)
       VALUES ($1, $2)`,
      [userId, name.trim()]
    );

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.redirect("/dashboard");
  }
}