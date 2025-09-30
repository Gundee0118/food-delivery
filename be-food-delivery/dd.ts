// import express, { request, Request, Response } from "express";
// import mongoose, { Schema, model } from "mongoose";
// import bcrypt from "bcrypt";
// import cors from "cors";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
// //gvjn ooen sird sjkp

// const databaseConnect = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://eternalbeat89:Gundee18@cluster0.qkuh2qr.mongodb.net/foodDelivery"
//     );
//     console.log("successfully db connected");
//   } catch (err) {
//     console.log(err);
//   }
// };
// enum FoodOrderStatusEnum {
//   PENDING = "PENDING",
//   CANCELED = "CANCELED",
//   DELIVERED = "DELIVERED",
// }
// enum UserRoleEnum {
//   USER = "USER",
//   ADMIN = "ADMIN",
// }
// const Users = new Schema({
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   address: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ["USER", "ADMIN"],
//     default: "USER",
//     required: true,
//   },
//   isVerified: { type: Boolean, required: true },
//   createdAt: { type: Date, default: Date.now, immutable: true },
//   updatedAt: { type: Date, default: Date.now },
// });
// const Otp = new Schema({
//   code: { type: String, required: true },
//   userId: { type: Schema.ObjectId, required: true, ref: "Users" },
//   createdAt: { type: Date, default: Date.now, expires: 20 },
// });
// const Foods = new Schema({
//   foodName: { type: String, required: true },
//   price: { type: Number, required: true },
//   image: { type: String, required: true },
//   ingredients: { type: String, required: true },
//   category: { type: Schema.ObjectId, required: true, ref: "FoodCategories" },
//   createdAt: { type: Date, default: Date.now, immutable: true },
//   updatedAt: { type: Date, default: Date.now },
// });
// const FoodOrderItemsType = new Schema(
//   {
//     food: { type: Schema.Types.ObjectId, required: true, ref: "Foods" },
//     quantity: { type: Number, required: true },
//   },
//   { _id: false }
// );
// const FoodOrders = new Schema({
//   user: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
//   totalPrice: { type: Number, required: true },
//   foodOrderItems: { type: [FoodOrderItemsType], required: true },
//   status: {
//     type: String,
//     enum: Object.values(FoodOrderStatusEnum),
//     required: true,
//   },
//   createdAt: { type: Date, default: Date.now, immutable: true },
//   updatedAt: { type: Date, default: Date.now },
// });
// const FoodOrderItems = new Schema({
//   food: { type: Schema.Types.ObjectId, required: true, ref: "Foods" },
//   quantity: { type: Number, required: true },
// });
// const FoodCategories = new Schema({
//   categoryName: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now, immutable: true },
//   updatedAt: { type: Date, default: Date.now },
// });
// const UserModel = model("Users", Users);
// const OtpModel = model("Otp", Otp);
// const FoodCategoriesModel = model("FoodCategories", FoodCategories);
// const FoodsModel = model("Foods", Foods);
// const FoodOrderItemsModel = model("FoodOrderItems", FoodOrderItems);
// const FoodOrdersModel = model("FoodOrders", FoodOrders);

// const app = express();
// app.use(express.json());
// app.use(cors());
// databaseConnect();

// app.post("/signup", async (request: Request, response: Response) => {
//   const { email, password } = request.body;
//   const isEmailExtisted = await UserModel.findOne({ email });
//   if (!isEmailExtisted) {
//     const hashedPassword = await bcrypt.hashSync(password, 10);
//     await UserModel.create({ email, password: hashedPassword });

//     response.send({ message: "successfully registered" });
//     return;
//   }
//   response.status(400).send({ message: "user already existed" });
// });

// app.post("/login", async (request: Request, response: Response) => {
//   const { email, password } = request.body;
//   const isEmailExtisted = await UserModel.findOne({ email });
//   if (!isEmailExtisted) {
//     response.status(400).send({ message: "user doesn't existed" });
//     return;
//   }
//   const hashedPassword = await bcrypt.compareSync(
//     password,
//     isEmailExtisted.password!
//   );
//   if (hashedPassword) {
//     const tokenPassword = "foodDelivery";
//     const token = jwt.sign({ userId: isEmailExtisted._id }, tokenPassword);
//     response.send({ message: "successfully log in", token });
//     return;
//   } else {
//     response.status(401).send({ message: "wrong password, try again" });
//     return;
//   }
// });

// app.post("/verify", async (request: Request, response: Response) => {
//   const { token } = request.body;
//   const tokenPassword = "Joker";
//   try {
//     const isValid = jwt.verify(token, tokenPassword);
//     if (isValid) {
//       const destructToken = jwt.decode(token);
//       response.send({ destructToken });
//       return;
//     } else {
//       response.status(401).send({ message: "token is not valid" });
//       return;
//     }
//   } catch (err) {
//     response.status(401).send({ message: "token is not valid" });
//     return;
//   }
// });
// //send code
// app.post("/sendOtp", async (request: Request, response: Response) => {
//   const { email } = request.body;

//   const isExistingUser = await UserModel.findOne({ email });
//   if (!isExistingUser) {
//     response.status(401).send({ message: "user doesnt exist" });
//     return;
//   }
//   const code = 1234;
//   const transport = nodemailer.createTransport({
//     service: "email",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "eternalbeat.89@gmail.com",
//       pass: "gvjnooensirdsjkp",
//     },
//   });
//   const options = {
//     from: "eternalbeat.89@gmail.com",
//     to: request.body.email,
//     subject: "Batalgaajuulah code",
//     html: `<div> Batalgaajuulah code: <h2>${code}</h2></div>`,
//   };
//   await OtpModel.create({ code: code, userId: isExistingUser._id });
//   await transport.sendMail(options);
//   response.status(200).send({ message: "success" });
// });
// // otp check
// app.post("/checkOtp", async (request: Request, response: Response) => {
//   const { code } = request.body;
//   try {
//     const isOtpExisting = await OtpModel.findOne({ code }).populate("userId");
//     if (!isOtpExisting) {
//       response.status(400).send("wrong code");
//       return;
//     }
//     response.status(200).send({ message: "success", isOtpExisting });
//   } catch (err) {
//     response.status(400).send("aldaa");
//   }
// });
// app.post("/addFoodCategories", async (request: Request, response: Response) => {
//   const { category } = request.body;
//   try {
//     await FoodCategoriesModel.create({ categoryName: category });
//     response.send("success");
//   } catch (err) {
//     response.status(401).send("fail");
//   }
// });
// app.post("/addfoods", async (req: Request, res: Response) => {
//   const { food, price, image, ingredients, categoryName } = req.body;
//   const isCategoryExisted = await FoodCategoriesModel.findOne({ categoryName });

//   try {
//     await FoodsModel.create({
//       foodName: food,
//       price,
//       image,
//       ingredients,
//       category: isCategoryExisted?._id,
//     });
//     res.send("success");
//   } catch (err) {
//     res.status(401).send("fail");
//   }
// });
// app.post("/addFoodOrderItems", async (req: Request, res: Response) => {
//   const { food, quantity } = req.body;
//   try {
//     await FoodOrderItemsModel.create({ food, quantity });
//     res.send("success");
//   } catch (err) {
//     console.log(err);

//     res.status(401).send("fail");
//   }
// });
// app.post("/addFoodOrders", async (req: Request, res: Response) => {
//   const { user, totalPrice, foodOrderItems, status, createdAt, updatedAt } =
//     req.body;
//   try {
//     await FoodOrdersModel.create({
//       user,
//       totalPrice,
//       foodOrderItems,
//       status,
//       createdAt,
//       updatedAt,
//     });
//     res.send("success");
//   } catch (err) {
//     console.log(err);

//     res.status(401).send("fail");
//   }
// });
// app.listen(8000, () => {
//   console.log(`running on http://localhost:8000`);
// });
