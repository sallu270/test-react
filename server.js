import "dotenv/config";
import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { saveInquiry } from "./contactStore.js";

if (!globalThis.crypto) {
  try {
    Object.defineProperty(globalThis, "crypto", { value: crypto });
  } catch {
    // Already defined
  }
}

const app = express();

const PORT = Number(process.env.PORT || 5050);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const contactSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be 80 characters or less."),
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .email("Please enter a valid email address.")
    .max(120, "Email must be 120 characters or less."),
  company: z
    .string({ required_error: "Company is required." })
    .trim()
    .min(2, "Company must be at least 2 characters.")
    .max(120, "Company must be 120 characters or less."),
  budget: z.enum(["₹2L - ₹5L", "₹5L - ₹10L", "₹10L - ₹25L", "₹25L+"], {
    errorMap: () => ({ message: "Please select a valid budget range." })
  }),
  message: z
    .string({ required_error: "Project story is required." })
    .trim()
    .min(20, "Project story must be at least 20 characters.")
    .max(1800, "Project story must be 1800 characters or less.")
});

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json({ limit: "32kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  "/api/contact",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: "error",
      message: "Too many contact requests. Please try again after 15 minutes."
    }
  })
);

app.get("/api/health", (request, response) => {
  response.status(200).json({
    status: "ok",
    service: "premium-agency-server",
    time: new Date().toISOString()
  });
});

app.post("/api/contact", async (request, response, next) => {
  try {
    const parsed = contactSchema.safeParse(request.body);

    if (!parsed.success) {
      return response.status(422).json({
        status: "error",
        message: "Please fix the highlighted form fields.",
        errors: parsed.error.flatten().fieldErrors
      });
    }

    const savedInquiry = await saveInquiry({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      budget: parsed.data.budget,
      message: parsed.data.message,
      userAgent: request.get("user-agent") || "unknown",
      ipAddress:
        request.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
        request.socket.remoteAddress ||
        "unknown"
    });

    return response.status(201).json({
      status: "success",
      message: "Your enquiry has been received.",
      inquiryId: savedInquiry.id
    });
  } catch (error) {
    return next(error);
  }
});

app.use((request, response) => {
  response.status(404).json({
    status: "error",
    message: "Route not found."
  });
});

app.use((error, request, response, next) => {
  console.error("Unhandled server error:", error);

  response.status(500).json({
    status: "error",
    message: "Internal server error. Please try again later."
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Allowed client origin: ${CLIENT_ORIGIN}`);
});