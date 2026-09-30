import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../services/api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
export function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    API.get(`/orders/${id}`)
      .then((r) => setOrder(r.data.order))
      .catch(() =>
        setError(
          "Order not found or unavailable. Sign in to the account that placed it.",
        ),
      )
      .finally(() => setLoading(false));
  }, [id]);
  if (loading)
    return (
      <p className="p-10" role="status">
        Loading order…
      </p>
    );
  if (!order)
    return (
      <p className="p-10">
        {error || "No order selected."}{" "}
        <Link to="/shop" className="underline">
          Continue shopping
        </Link>
      </p>
    );
  return (
    <section className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-green-700 mb-6">
        Order confirmed
      </h1>
      <Card className="p-6 space-y-4">
        <p className="break-all">Order: {order._id}</p>
        <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
        <p>
          Estimated delivery:{" "}
          {order.estimatedDelivery
            ? new Date(order.estimatedDelivery).toLocaleDateString()
            : "Not available"}
        </p>
        <p>
          Status: {order.isDelivered ? "Delivered" : "Received"} · Payment:{" "}
          {order.isPaid ? "Paid" : "Cash on delivery — unpaid"}
        </p>
        <p>
          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
          <br />
          {order.shippingAddress?.address}
          <br />
          {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
          {order.shippingAddress?.zip}
        </p>
        {order.orderItems.map((i: any) => (
          <div
            key={i.productId}
            className="flex justify-between gap-4 border-b py-2"
          >
            <span>
              {i.name} × {i.quantity}
            </span>
            <span>${(i.price * i.quantity).toFixed(2)}</span>
          </div>
        ))}
        {["subtotal", "shipping", "tax", "discountAmount", "total"].map((k) => (
          <div key={k} className="flex justify-between capitalize">
            <span>{k === "discountAmount" ? "Discount" : k}</span>
            <strong>
              {k === "discountAmount" ? "−" : ""}$
              {typeof order[k] === "number"
                ? order[k].toFixed(2)
                : "Not recorded"}
            </strong>
          </div>
        ))}
        <div className="flex flex-wrap gap-3 print:hidden">
          <Button onClick={() => window.print()}>
            Print / save order receipt
          </Button>
          <Link to="/shop">
            <Button variant="outline">Continue shopping</Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}
