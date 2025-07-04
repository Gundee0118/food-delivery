"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { DataTable } from "./_components/Table";
import { Payment } from "./_components/tableColumn";
import { format } from "date-fns";
import { StateChanger } from "./_components/TableStateChanger";
enum orderStatusType {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  DELIVERED = "DELIVERED",
}
const AdminOrderPage = () => {
  const [order, setOrder] = useState<any[]>([]);
  const [selectedOrdersId, setSelectedOrdersId] = useState<string[]>([]);
  const [orderStatus, setOrderStatus] = useState<orderStatusType>(
    orderStatusType.PENDING
  );

  useEffect(() => {
    const fetchData = async () => {
      const token = window?.localStorage?.getItem("token");

      const response: any = await axios.get(
        "http://localhost:8000/admin/getAllOrders",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(response.data.orders);
      console.log(response.data, "data response");
    };

    fetchData();
  }, []);

  const data: Payment[] = order.map((el: any, index) => ({
    id: el._id,
    number: index + 1,
    customer: `${el.user.email}`,
    food: `${el.foodOrderItems?.length || 0} hool`,
    date: format(new Date(el.createdAt), "yyyy-MM-dd"),
    total: el.totalPrice,
    status: el.status,
    address: "odoohondoo bhgui",
  }));

  const selectHandler = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedOrdersId((prev) => [...prev, id]);
    } else {
      const removed = selectedOrdersId.filter((item) => item != id);
      setSelectedOrdersId(removed);
    }
  };

  const statusHandler = (orderStatus: orderStatusType) => {
    setOrderStatus(orderStatus);
  };

  const saveChange = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Log in hiine uu!");
      return;
    }

    const prepare = selectedOrdersId.map((el) => ({
      _id: el,
      status: orderStatus,
    }));

    await axios.put(
      "http://localhost:8000/admin/updateOrder",
      {
        orders: prepare,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updated = order.map((item) => {
      return selectedOrdersId.map((el) => {
        if (item._id === el) {
          return { ...item, status: orderStatus };
        } else {
          return item;
        }
      })[0];
    });
    setOrder(updated);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between">
        <h1 className="text-2xl font-black mb-5">Orders</h1>
        <StateChanger
          saveChange={saveChange}
          statusHandler={statusHandler}
          orderStatus={orderStatus}
        />
      </div>

      <DataTable data={data} onCheckedChange={selectHandler} />
    </div>
  );
};

export default AdminOrderPage;
