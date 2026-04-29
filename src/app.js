import express from "express";
import serverless from "serverless-http";

const app = express();
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

// routes
import orderRoutes from "./routes/order.js";
import cartonRoutes from "./routes/carton.js";

app.use("/orders", orderRoutes);
app.use("/cartons", cartonRoutes);

// =====================
// LOCAL ONLY
// =====================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Local server running on ${PORT}`);
  });
}

// =====================
// VERCEL EXPORT
// =====================
export const handler = serverless(app);
export default app;