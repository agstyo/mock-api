import express from "express";
import dotenv from "dotenv";

import orderRoutes from "./routes/order.js";
import cartonRoutes from "./routes/carton.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Mock API 🚀",
    status: "OK",
    endpoints: {
      orders: "/orders",
      order_detail: "/orders/:id",
      cartons: "/cartons",
      assign_carton_order: "POST /cartons",
    }
  });
});

app.use("/orders", orderRoutes);
app.use("/cartons", cartonRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});