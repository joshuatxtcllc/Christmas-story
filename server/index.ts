import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { config } from "dotenv";

config();

const app = express();
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(process.cwd(), "uploads");
const ordersDir = path.join(process.cwd(), "orders");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(ordersDir)) fs.mkdirSync(ordersDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const id = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `family-${id}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const stripe =
  stripeSecret ?
  // @ts-ignore
  (await import("stripe")).default(stripeSecret, { apiVersion: "2024-06-20" }) :
  null;

const PRICE_MAP: Record<"digital"|"print"|"framed", string | null> = {
  digital: process.env.STRIPE_PRICE_ID_DIGITAL || null,
  print: process.env.STRIPE_PRICE_ID_PRINT || null,
  framed: process.env.STRIPE_PRICE_ID_FRAMED || null,
};

// Serve uploads locally if you want to preview
app.use("/uploads", express.static(uploadsDir));

app.post("/api/holiday-movie-poster/order", upload.single("file"), async (req, res) => {
  try {
    const {
      name, email, phone, address, vibe, tier, notes, quantity, total
    } = req.body;

    if (!name || !email || !vibe || !tier) {
      return res.status(400).send("Missing required fields.");
    }
    if (!req.file) return res.status(400).send("Image file required.");

    const orderId = `order_${Date.now()}_${Math.floor(Math.random()*1e6)}`;
    const order = {
      orderId,
      createdAt: new Date().toISOString(),
      name, email, phone, address, vibe, tier, notes,
      quantity: Number(quantity || 1),
      total: Number(total || 0),
      filePath: `/uploads/${req.file.filename}`,
      status: "pending-proof"
    };

    fs.writeFileSync(
      path.join(ordersDir, `${orderId}.json`),
      JSON.stringify(order, null, 2),
      "utf-8"
    );

    // If Stripe is configured, create checkout
    if (stripe && PRICE_MAP[tier as keyof typeof PRICE_MAP]) {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price: PRICE_MAP[tier as keyof typeof PRICE_MAP]!,
            quantity: Number(quantity || 1),
          },
        ],
        customer_email: email,
        success_url: process.env.CHECKOUT_SUCCESS_URL || "https://yourdomain.com/thank-you?orderId="+orderId,
        cancel_url: process.env.CHECKOUT_CANCEL_URL || "https://yourdomain.com/holiday-poster?canceled=1",
        metadata: { orderId, vibe, tier, name, notes },
      });
      return res.json({ checkoutUrl: session.url });
    }

    // No Stripe? Just confirm receipt.
    return res.json({ ok: true, orderId });
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message || "Server error");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
