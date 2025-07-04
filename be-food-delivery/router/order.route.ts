import {Router}from"express"

import { checkOtp, sendOtp, updatePassword } from "../controller/user/forgot"

import { tokenChecker } from "../middleware/token-checker"
import { createOrder } from "../controller/order/create-order"
import { getOrderByUserId } from "../controller/order/get-order-by-userId"




export const OrderRouter=Router()



OrderRouter.post("/createOrder",createOrder)
OrderRouter.get("/getOrder",getOrderByUserId)