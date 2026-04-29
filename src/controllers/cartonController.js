import db from "../db.js";

// GET /cartons
export const getCartons = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM carton");
  res.json(rows);
};