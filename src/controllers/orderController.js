import db from "../db.js";

// GET /orders
export const getOrders = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM `order` ORDER BY id DESC");

  const formatted = rows.map(row => ({
    ...row,
    created_at: toWIB(row.created_at),
    updated_at: toWIB(row.updated_at)
  }));

  res.json(formatted);
};

// GET /orders/:id
export const getOrderDetail = async (req, res) => {
  const { id } = req.params;

  const [order] = await db.query(
    "SELECT * FROM `order` WHERE id = ?",
    [id]
  );

  const [details] = await db.query(
    "SELECT * FROM order_details WHERE order_id = ?",
    [id]
  );

  const formattedOrder = order[0]
    ? {
      ...order[0],
      created_at: toWIB(order[0].created_at),
      updated_at: toWIB(order[0].updated_at)
    }
    : null;

  const formattedDetails = details.map(d => ({
    ...d,
    created_at: toWIB(d.created_at)
  }));

  res.json({
    order: formattedOrder,
    details: formattedDetails
  });
};

// POST /orders/carton
export const assignCarton = async (req, res) => {
  const { order_id, carton_id, created_by } = req.body;

  console.log(req.body);

  if (!order_id || !carton_id) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      "INSERT INTO log_order_carton (order_id, carton_id, created_by) VALUES (?, ?, ?)",
      [order_id, carton_id, created_by]
    );

    await conn.query(
      "UPDATE `order` SET carton_id = ? WHERE id = ?",
      [carton_id, order_id]
    );

    await conn.commit();

    res.json({
      message: "Carton assigned",
      id: result.insertId
    });

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  };
}


function toWIB(date) {
  const d = new Date(date);

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(d);

  const get = (t) => parts.find(p => p.type === t).value;

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}+07:00`;
}