import axios from "axios";
import Cart from "../models/Cart.js";
// Assuming you have a User model to get past purchase data
import User from "../models/User.js"; 

export const applyAIDiscount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const user = await User.findById(req.user._id); // Fetch user stats for the AI

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 🔢 Calculate subtotal
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 🧠 Map Node variables to EXACT Python FastAPI Schema requirements
    const aiPayload = {
      user_id: req.user._id.toString(),
      time_on_page: req.body.timeOnPage || 60, // You can pass this from the React frontend!
      items_in_cart: cart.items.length,
      cart_value: subtotal,
      is_new: user.numPurchases === 0,
      num_purchases: user.numPurchases || 0,
      days_since_last: user.daysSinceLastPurchase || 0,
      past_total_spend: user.pastTotalSpend || 0
    };

    // 🤖 Call Python AI API
    const aiResponse = await axios.post(
      "https://dynamic-discount-api.onrender.com/api/v1/get-discount",
      aiPayload,
      {
        headers: {
          // Keep the hackers out!
          "X-API-Key": "super-secret-enterprise-key-123" 
        }
      }
    );

    // 🎯 Catch the exact variable name Python spits out
    const aiDiscount = aiResponse.data.final_discount_pct; 

    // 💾 Save discount into cart
    cart.discount = aiDiscount;
    await cart.save();

    // 📊 Recalculate totals
    const shipping = subtotal > 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const discountAmount = (subtotal * cart.discount) / 100;
    const total = subtotal + shipping + tax - discountAmount;

    res.json({
      items: cart.items,
      subtotal,
      shipping,
      tax,
      discount: cart.discount,
      discountAmount,
      total,
      ai_probability_score: aiResponse.data.purchase_probability // Fun extra data to log!
    });
  } catch (error) {
    console.error("AI Request Failed:", error.response?.data || error.message);
    res.status(500).json({ message: "AI discount failed" });
  }
};