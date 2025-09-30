"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import { ChevronDown, ChevronUp, Calendar, Truck } from "lucide-react";
import axios from "axios";

interface OrderItem {
  food: {
    _id: string;
    foodName: string;
    image: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  address: string;
  foodOrderItems: OrderItem[];
  totalPrice: number;
  status: "Pending" | "Delivered" | "Cancelled";
  createdAt: string;
  user?: {
    email: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [clickedOrderId, setClickedOrderId] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedOrderForCart, setSelectedOrderForCart] =
    useState<Order | null>(null);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState<string>("Pending");

  // Modal-ийг гаднаас дарахад хаах
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".food-modal-trigger") &&
        !target.closest(".food-modal-content")
      ) {
        setClickedOrderId(null);
      }
    };

    if (clickedOrderId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clickedOrderId]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get("http://localhost:8000/getOrders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // 10 seconds timeout
      });
      console.log("Orders data:", response.data.orders);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED") {
          console.error(
            "Backend server is not running. Please start the server."
          );
        } else if (error.code === "ERR_NETWORK") {
          console.error("Network error. Please check your connection.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((order) => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  const updateDeliveryState = async (orderId: string, newState: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/updateOrderState/${orderId}`,
        { deliveryState: newState },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error updating order state:", error);
    }
  };

  const handleCartClick = (order: Order) => {
    setSelectedOrderForCart(order);
    setShowCartModal(true);
  };

  const handleBulkUpdateStatus = async () => {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Update each selected order
      await Promise.all(
        selectedOrders.map((orderId) =>
          axios.put(
            `http://localhost:8000/updateOrderState/${orderId}`,
            { deliveryState: bulkUpdateStatus },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      alert(
        `Successfully updated ${selectedOrders.length} orders to ${bulkUpdateStatus}`
      );
      setSelectedOrders([]);
      setShowBulkUpdateModal(false);
      fetchOrders();
    } catch (error) {
      console.error("Error bulk updating orders:", error);
      alert("Failed to update orders");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-CA");
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600 mt-1">{orders.length} items</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  13 June 2023 - 14 July 2023
                </span>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  if (selectedOrders.length > 0) {
                    setShowBulkUpdateModal(true);
                  } else {
                    alert("Please select at least one order");
                  }
                }}
                disabled={selectedOrders.length === 0}
              >
                <Truck className="h-4 w-4" />
                Change delivery state
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <Checkbox
                    checked={
                      selectedOrders.length === orders.length &&
                      orders.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("_id")}
                >
                  <div className="flex items-center gap-1">
                    Nº
                    {sortField === "_id" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("user.email")}
                >
                  <div className="flex items-center gap-1">
                    Customer
                    {sortField === "user.email" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Food
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortField === "createdAt" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("totalPrice")}
                >
                  <div className="flex items-center gap-1">
                    Total
                    {sortField === "totalPrice" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery state
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedOrders.includes(order._id)}
                      onCheckedChange={(checked) =>
                        handleSelectOrder(order._id, checked as boolean)
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.user?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 relative">
                    <div
                      className="food-modal-trigger flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors"
                      onClick={(e) => {
                        console.log("Clicking order:", order._id);
                        console.log("Current clickedOrderId:", clickedOrderId);

                        const rect = e.currentTarget.getBoundingClientRect();
                        setModalPosition({
                          top: rect.bottom + window.scrollY + 5,
                          left: rect.left + window.scrollX,
                        });

                        const newId =
                          clickedOrderId === order._id ? null : order._id;
                        console.log("Setting to:", newId);
                        setClickedOrderId(newId);
                      }}
                    >
                      <span>{order.foodOrderItems.length} foods</span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {order.address}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateDeliveryState(order._id, e.target.value)
                      }
                      className="text-sm border border-gray-300 rounded px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ←
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={
                    currentPage === pageNum ? "bg-gray-800 text-white" : ""
                  }
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="text-gray-500">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              →
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Portal */}
      {clickedOrderId &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="food-modal-content fixed z-[99999] bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80"
            style={{
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`,
            }}
          >
            <div className="space-y-3">
              {(() => {
                const order = orders.find((o) => o._id === clickedOrderId);
                return order?.foodOrderItems &&
                  order.foodOrderItems.length > 0 ? (
                  order.foodOrderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2">
                      <img
                        src={item.food.image}
                        alt={item.food.foodName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {item.food.foodName}
                        </p>
                        <p className="text-xs text-gray-500">
                          x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No food items</p>
                );
              })()}
            </div>
          </div>,
          document.body
        )}

      {/* Cart Modal */}
      {showCartModal && selectedOrderForCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Order Detail</h2>
                <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                  🛒
                </div>
              </div>
              <button
                onClick={() => setShowCartModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button className="flex-1 py-2 px-4 text-red-600 border-b-2 border-red-600 font-medium">
                Cart
              </button>
              <button className="flex-1 py-2 px-4 text-gray-500">Order</button>
            </div>

            {/* Cart Content */}
            <div className="p-4">
              <div className="space-y-4">
                {selectedOrderForCart.foodOrderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <img
                      src={item.food.image}
                      alt={item.food.foodName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-red-600">
                        {item.food.foodName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Fluffy pancakes stacked with fruits, cream, syrup, and
                        powdered sugar.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button className="w-6 h-6 rounded-full border flex items-center justify-center">
                          -
                        </button>
                        <span className="text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button className="w-6 h-6 rounded-full border flex items-center justify-center">
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <button className="text-gray-400 hover:text-gray-600 mb-2">
                        ×
                      </button>
                      <p className="font-semibold">
                        ${(item.food.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Location */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">Delivery location</h3>
                <input
                  type="text"
                  placeholder="Please share your complete address"
                  value={selectedOrderForCart.address}
                  readOnly
                  className="w-full p-3 border rounded-lg text-gray-500"
                />
              </div>

              {/* Payment Info */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>${selectedOrderForCart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$0.99</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    ${(selectedOrderForCart.totalPrice + 0.99).toFixed(2)}
                  </span>
                </div>
                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium mt-4">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Update Modal */}
      {showBulkUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              Change Delivery State
            </h2>
            <p className="text-gray-600 mb-4">
              Update status for {selectedOrders.length} selected order
              {selectedOrders.length > 1 ? "s" : ""}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select Status
              </label>
              <select
                value={bulkUpdateStatus}
                onChange={(e) => setBulkUpdateStatus(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkUpdateModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpdateStatus}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
