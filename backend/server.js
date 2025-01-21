import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcrypt";
import { userModel } from "./models/userModel.js";
import nodemailer from "nodemailer";

const app = express();
const PORT = 9000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3001", "http://127.0.0.1:5500"],
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: "7wEPtzOELCRjUY6z4X11X9JQs5zbQHTy",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// الاتصال بقاعدة البيانات
mongoose
  .connect("mongodb://127.0.0.1:27017/Freelancer", {})
  .then(async () => {
    console.log("MongoDB connected");
    await ensureAdminAccount();
  })
  .catch((err) => console.error(err));

// التأكد من وجود حساب مدير النظام
const ensureAdminAccount = async () => {
  const adminEmail = "taha@admin.com";
  const adminPassword = "taha123";

  try {
    const existingAdmin = await userModel.findOne({ email: adminEmail, accountType: "Admin" });
    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = new userModel({
      fullName: "taha altayeb",
      phoneNumber: "123456789",
      email: adminEmail,
      password: hashedPassword,
      accountType: "Admin",
      accountStatus: "Accepted",
    });

    await admin.save();
    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Error creating admin account:", error);
  }
};

// تسجيل الدخول
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "يرجى ملء جميع الحقول." });
  }

  try {
    if (email === "taha@admin.com" && password === "taha123") {
      return res.status(200).json({
        message: "مرحبًا بك في لوحة تحكم مدير النظام.",
        
        redirect: "./adminDashboard.html",
      
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة." });
    }

    if (user.accountStatus === "Pending") {
      return res.status(403).json({ message: "حسابك في انتظار الموافقة. يرجى المحاولة لاحقًا." });
    }

    if (user.accountStatus === "Regected") {
      return res.status(403).json({ message: "تم رفض حسابك. يرجى التواصل مع الدعم للحصول على مزيد من التفاصيل." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة." });
    }

    req.session.user = {
      id: user._id,
      fullName: user.fullName,
      role: user.role,
    };

    res.status(200).json({
      message: "تم تسجيل الدخول بنجاح.",
      redirect: "./index.html",
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة لاحقًا." });
  }
});

// إنشاء حساب جديد
app.post("/api/register", async (req, res) => {
  const {
    fullName,
    phoneNumber,
    address,
    email,
    password,
    accountType,
    theJob,
    pdf,
    jobDescription,
    communicationLink,
    image,
  } = req.body;

  if (!fullName || !email || !password || !accountType) {
    return res.status(400).json({ message: "يرجى ملء جميع الحقول المطلوبة." });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "البريد الإلكتروني مسجل بالفعل." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullName,
      phoneNumber,
      address,
      email,
      password: hashedPassword,
      accountType,
      theJob: accountType === "Freelancer" ? theJob : null,
      pdf: accountType === "Freelancer" ? pdf : null,
      jobDescription: accountType === "Company" ? jobDescription : null,
      communicationLink: accountType === "Company" ? communicationLink : null,
      image: image || null,
      accountStatus: "Pending",
    });

    await newUser.save();
    res.status(201).json({ message: "تم إنشاء الحساب بنجاح." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقًا." });
  }
});

// عرض الباحثين عن عمل
app.get("/api/Freelancers", async (req, res) => {
  try {
    const Freelancers = await userModel.find({ accountType: "Freelancer" });
    res.status(200).json(Freelancers);
  } catch (error) {
    console.error("Error fetching Freelaner:", error);
    res.status(500).json({ message: "Failed to fetch Freelaner." });
  }
});

// عرض جهات التوظيف
app.get("/api/Companyes", async (req, res) => {
  try {
    const Companyes = await userModel.find({ accountType: "Company" });
    res.status(200).json(Companyes);
  } catch (error) {
    console.error("Error fetching Companyes:", error);
    res.status(500).json({ message: "Failed to fetch Companyes." });
  }
});

// إرسال بريد إلكتروني
app.post("/api/send-email", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: "يرجى ملء جميع الحقول." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "message from Freelancer Company",
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "تم إرسال الرسالة بنجاح." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "message send !" });
  }
});

// تسجيل الخروج
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out." });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully." });
  });
});

// إدارة المستخدمين
const getAllUsers = async () => {
  const users = await userModel.find({});
  return { data: users, statusCode: 200 };
};

const approveUser = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    return { data: "User not found", statusCode: 404 };
  }
  user.accountStatus = "Accepted";
  await user.save();
  return { data: "User approved successfully", statusCode: 200 };
};

const rejectUser = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    return { data: "User not found", statusCode: 404 };
  }
  user.accountStatus = "Regected";
  await user.save();
  return { data: "User rejected successfully", statusCode: 200 };
};

const deleteUser = async (userId) => {
  const user = await userModel.findByIdAndDelete(userId);
  if (!user) {
    return { data: "User not found", statusCode: 404 };
  }
  return { data: "User deleted successfully", statusCode: 200 };
};

app.get("/users", async (req, res) => {
  const { data, statusCode } = await getAllUsers();
  res.status(statusCode).json(data);
});

app.put("/users/approve/:id", async (req, res) => {
  const { id } = req.params;
  const { data, statusCode } = await approveUser(id);
  res.status(statusCode).json(data);
});

app.put("/users/reject/:id", async (req, res) => {
  const { id } = req.params;
  const { data, statusCode } = await rejectUser(id);
  res.status(statusCode).json(data);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { data, statusCode } = await deleteUser(id);
  res.status(statusCode).json(data);
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
