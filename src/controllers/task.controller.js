import pool from "../config/db.js";

export async function getTasks(req, res) {
  try {
    const userId = req.session.user.id;

    const result = await pool.query(
      `SELECT id, title, description, status, created_at
       FROM tasks
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.render("tasks", {
      user: req.session.user,
      tasks: result.rows,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("tasks", {
      user: req.session.user,
      tasks: [],
      error: "Failed to load tasks."
    });
  }
}


export async function createTask(req, res) {
  try {
    const userId = req.session.user.id;
    const { title, description, category_id } = req.body;

    if (!title || !title.trim()) return res.redirect("/dashboard");

    let safeCategoryId = null;
    if (category_id) {
      const check = await pool.query(
        `SELECT id FROM categories WHERE id = $1 AND user_id = $2`,
        [Number(category_id), userId]
      );
      safeCategoryId = check.rows.length ? Number(category_id) : null;
    }

    await pool.query(
      `INSERT INTO tasks (user_id, category_id, title, description)
       VALUES ($1, $2, $3, $4)`,
      [userId, safeCategoryId, title.trim(), description?.trim() || null]
    );

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.redirect("/dashboard");
  }
}

export async function assignTaskCategory(req, res) {
  try {
    const userId = req.session.user.id;
    const taskId = Number(req.params.id);
    const categoryId = req.body.category_id ? Number(req.body.category_id) : null;

    if (categoryId !== null) {
      const check = await pool.query(
        `SELECT id FROM categories WHERE id = $1 AND user_id = $2`,
        [categoryId, userId]
      );
      if (!check.rows.length) return res.redirect("/dashboard");
    }

    await pool.query(
      `UPDATE tasks
       SET category_id = $1
       WHERE id = $2 AND user_id = $3`,
      [categoryId, taskId, userId]
    );

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.redirect("/dashboard");
  }
}

export async function completeTask(req, res) {
  try {
    const userId = req.session.user.id;
    const taskId = Number(req.params.id);

    await pool.query(
      `UPDATE tasks SET status = 'completed'
       WHERE id = $1 AND user_id = $2`,
      [taskId, userId]
    );

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.redirect("/dashboard");
  }
}

export async function deleteTask(req, res) {
  try {
    const userId = req.session.user.id;
    const taskId = Number(req.params.id);

    await pool.query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2`,
      [taskId, userId]
    );

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.redirect("/dashboard");
  }
}