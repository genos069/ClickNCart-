import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import API from "../../services/api";
import { getSession } from "../../services/session";
const initialAddress = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
};
export function CheckoutPage() {
  const navigate = useNavigate(),
    inFlight = useRef(false);
  const [cart, setCart] = useState<any>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  const [address, setAddress] = useState(initialAddress),
    [shipping, setShipping] = useState("standard"),
    [step, setStep] = useState(1);
  const key = useRef("");
  useEffect(() => {
    if (!getSession()) {
      navigate("/login", { replace: true });
      return;
    }
    API.get("/cart")
      .then(({ data }) => {
        setCart(data);
        setAddress({ ...initialAddress, ...data.shippingAddress });
        setShipping(data.shippingMethod);
      })
      .catch(() =>
        setError("Unable to load checkout. Return to the cart and retry."),
      )
      .finally(() => setLoading(false));
  }, [navigate]);
  async function prepare(e: React.FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      await API.put("/cart/address", address);
      await API.put("/cart/shipping", { method: shipping });
      const { data } = await API.post("/payment", { paymentMethod: "cod" });
      setCart(data);
      setStep(2);
      const storageKey = `checkout:${getSession()._id}:${data.version}`;
      key.current = sessionStorage.getItem(storageKey) || crypto.randomUUID();
      sessionStorage.setItem(storageKey, key.current);
    } catch (e: any) {
      setError(e.response?.data?.message || "Unable to save checkout");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  async function submit() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post(
        "/orders",
        { cartVersion: cart.version, expectedTotal: cart.total },
        { headers: { "Idempotency-Key": key.current } },
      );
      navigate(`/order-confirmation/${data.order._id}`, { replace: true });
    } catch (e: any) {
      setError(
        e.response?.data?.message ||
          "Order status is uncertain. Retry with the same checkout to avoid duplicates.",
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  if (loading)
    return (
      <p className="p-10" role="status">
        Loading checkout…
      </p>
    );
  return (
    <section className="container mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>
      {error && (
        <p role="alert" className="p-4 bg-red-50 text-red-700 mb-4">
          {error}
        </p>
      )}
      {!cart?.items.length ? (
        <p>
          Your cart is empty or unavailable.{" "}
          <Link to="/cart" className="underline">
            Return to cart
          </Link>
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            {step === 1 ? (
              <form onSubmit={prepare} className="space-y-4">
                <h2 className="text-xl font-semibold">Shipping and payment</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.keys(initialAddress).map((k) => (
                    <label
                      key={k}
                      className={k === "address" ? "sm:col-span-2" : ""}
                    >
                      <span className="block capitalize mb-1">
                        {k.replace(/([A-Z])/g, " $1")}
                      </span>
                      <input
                        required
                        maxLength={k === "phone" ? 25 : k === "zip" ? 12 : 200}
                        minLength={k === "zip" ? 3 : undefined}
                        type={
                          k === "email"
                            ? "email"
                            : k === "phone"
                              ? "tel"
                              : "text"
                        }
                        value={address[k as keyof typeof address]}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, [k]: e.target.value }))
                        }
                        className="border rounded p-2 w-full"
                      />
                    </label>
                  ))}
                </div>
                <fieldset className="space-y-2">
                  <legend className="font-semibold">Delivery</legend>
                  <label className="block">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shipping === "standard"}
                      onChange={() => setShipping("standard")}
                    />{" "}
                    Standard — approximately 5 days (
                    {cart.subtotal > 100 ? "free" : "$15.00"})
                  </label>
                  <label className="block">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shipping === "express"}
                      onChange={() => setShipping("express")}
                    />{" "}
                    Express — approximately 3 days ($15.00)
                  </label>
                </fieldset>
                <p>Payment: Cash on delivery</p>
                <Button disabled={busy} className="w-full bg-blue-600">
                  {busy ? "Saving…" : "Review Order"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Review your order</h2>
                <p>
                  {address.firstName} {address.lastName}
                  <br />
                  {address.address}
                  <br />
                  {address.city}, {address.state} {address.zip}
                  <br />
                  {address.phone}
                </p>
                <p>{shipping} delivery · Cash on delivery</p>
                <Button
                  disabled={busy}
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Edit details
                </Button>
                <Button
                  disabled={busy}
                  className="w-full bg-blue-600"
                  onClick={submit}
                >
                  {busy
                    ? "Placing order…"
                    : `Place Order — $${cart.total.toFixed(2)}`}
                </Button>
                <Link className="block underline" to="/cart">
                  Return to cart
                </Link>
              </div>
            )}
          </Card>
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Order summary</h2>
            {cart.items.map((i: any) => (
              <div key={i.productId} className="flex justify-between gap-4">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            {["subtotal", "shipping", "tax", "discountAmount", "total"].map(
              (k) => (
                <div className="flex justify-between capitalize" key={k}>
                  <span>{k === "discountAmount" ? "Discount" : k}</span>
                  <strong>
                    {k === "discountAmount" ? "−" : ""}${cart[k].toFixed(2)}
                  </strong>
                </div>
              ),
            )}
            {step === 1 && (
              <p className="text-sm text-gray-600">
                Shipping selection is applied when you review the order.
              </p>
            )}
          </Card>
        </div>
      )}
    </section>
  );
}
