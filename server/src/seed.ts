import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

// ─── Schemas (inline to avoid import issues) ────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["Admin", "Base Commander", "Logistics Officer"],
      default: "Base Commander",
    },
    assignedBase: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Vehicle", "Weapon", "Equipment", "Ammunition", "Communication"],
      required: true,
    },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["Available", "Low Stock", "Out of Stock", "Decommissioned"],
      default: "Available",
    },
    description: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Asset = mongoose.model("Asset", assetSchema);

// ─── Seed Data ───────────────────────────────────────────────────────────────

const seedUsers = async () => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash("password123", salt);

  const users = [
    {
      name: "Admin Officer",
      email: "admin@military.gov",
      password: hashedPassword,
      role: "Admin",
      assignedBase: "Pentagon HQ",
    },
    {
      name: "Col. James Mitchell",
      email: "commander@military.gov",
      password: hashedPassword,
      role: "Base Commander",
      assignedBase: "Fort Liberty",
    },
    {
      name: "Lt. Sarah Chen",
      email: "logistics@military.gov",
      password: hashedPassword,
      role: "Logistics Officer",
      assignedBase: "Camp Pendleton",
    },
  ];

  await User.deleteMany({});
  await User.insertMany(users);
  console.log("✅ Seeded 3 users (password: password123 for all)");
};

const seedAssets = async () => {
  const assets = [
    {
      name: "M4A1 Carbine",
      type: "Weapon",
      quantity: 250,
      status: "Available",
      description: "Standard-issue assault rifle, 5.56mm NATO",
      specifications: {
        manufacturer: "Colt",
        caliber: "5.56x45mm NATO",
        weight: "3.4 kg",
        range: "500m effective",
      },
    },
    {
      name: "M9 Beretta Pistol",
      type: "Weapon",
      quantity: 180,
      status: "Available",
      description: "Semi-automatic sidearm, 9mm Parabellum",
      specifications: {
        manufacturer: "Beretta",
        caliber: "9x19mm",
        weight: "0.95 kg",
        capacity: "15 rounds",
      },
    },
    {
      name: "HMMWV (Humvee)",
      type: "Vehicle",
      quantity: 45,
      status: "Available",
      description: "High Mobility Multipurpose Wheeled Vehicle",
      specifications: {
        manufacturer: "AM General",
        weight: "2,359 kg",
        fuelType: "Diesel",
        capacity: "4 personnel",
      },
    },
    {
      name: "M1 Abrams Tank",
      type: "Vehicle",
      quantity: 8,
      status: "Low Stock",
      description: "Main battle tank, 120mm smoothbore gun",
      specifications: {
        manufacturer: "General Dynamics",
        weight: "54,000 kg",
        fuelType: "Multi-fuel turbine",
        range: "426 km",
      },
    },
    {
      name: "UH-60 Black Hawk",
      type: "Vehicle",
      quantity: 12,
      status: "Available",
      description: "Medium-lift utility helicopter",
      specifications: {
        manufacturer: "Sikorsky",
        weight: "5,224 kg",
        capacity: "11 troops",
        range: "592 km",
      },
    },
    {
      name: "Night Vision Goggles (AN/PVS-14)",
      type: "Equipment",
      quantity: 320,
      status: "Available",
      description: "Monocular night vision device, Gen III",
      specifications: {
        manufacturer: "L3Harris",
        weight: "0.35 kg",
        range: "300m detection",
      },
    },
    {
      name: "Body Armor (IOTV Gen IV)",
      type: "Equipment",
      quantity: 500,
      status: "Available",
      description: "Improved Outer Tactical Vest with ballistic plates",
      specifications: {
        manufacturer: "KDH Defense",
        weight: "14.2 kg",
        dimensions: "Multiple sizes",
      },
    },
    {
      name: "5.56mm NATO Rounds",
      type: "Ammunition",
      quantity: 50000,
      status: "Available",
      description: "Standard ball ammunition, 1000-round cases",
      specifications: {
        manufacturer: "Lake City Army Ammunition Plant",
        caliber: "5.56x45mm",
        weight: "12.3 kg per case",
      },
    },
    {
      name: "9mm Parabellum Rounds",
      type: "Ammunition",
      quantity: 25000,
      status: "Available",
      description: "Standard pistol ammunition, 500-round boxes",
      specifications: {
        manufacturer: "Winchester",
        caliber: "9x19mm",
        weight: "7.5 kg per box",
      },
    },
    {
      name: "AN/PRC-152A Radio",
      type: "Communication",
      quantity: 75,
      status: "Available",
      description: "Multiband handheld radio, SATCOM capable",
      specifications: {
        manufacturer: "L3Harris",
        weight: "0.88 kg",
        range: "Line of sight / SATCOM global",
      },
    },
    {
      name: "AN/PRC-117G Manpack Radio",
      type: "Communication",
      quantity: 5,
      status: "Low Stock",
      description: "Wideband tactical radio system",
      specifications: {
        manufacturer: "L3Harris",
        weight: "5.44 kg",
        range: "BLOS / SATCOM global",
      },
    },
    {
      name: "MRE (Meals Ready to Eat)",
      type: "Equipment",
      quantity: 10000,
      status: "Available",
      description: "Individual field rations, 24-meal cases",
      specifications: {
        manufacturer: "Ameriqual",
        weight: "0.51 kg per meal",
        capacity: "1,250 calories per meal",
      },
    },
  ];

  await Asset.deleteMany({});
  await Asset.insertMany(assets);
  console.log(`✅ Seeded ${assets.length} military assets`);
};

// ─── Run Seed ────────────────────────────────────────────────────────────────

const runSeed = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI not set in .env");
    }

    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");

    await seedUsers();
    await seedAssets();

    console.log("\n🎖️  Seed completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  Login Credentials (all use: password123)");
    console.log("  ─────────────────────────────────────");
    console.log("  Admin:             admin@military.gov");
    console.log("  Base Commander:    commander@military.gov");
    console.log("  Logistics Officer: logistics@military.gov");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

runSeed();
