import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, LogOut, User } from "lucide-react";
import { Button } from "../components/ui/button";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-8">
        
        {/* PROFILE HEADER */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800">
            {user.name}
          </h2>

          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
          
          {/* CART */}
          <Button
            onClick={() => navigate("/cart")}
            className="flex items-center justify-center gap-2 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart
          </Button>

          {/* FAVORITES */}
          <Button
            onClick={() => navigate("/favorites")}
            variant="outline"
            className="flex items-center justify-center gap-2 h-14 border-pink-300 hover:bg-pink-50"
          >
            <Heart className="w-5 h-5 text-pink-500" />
            Favorites
          </Button>

          {/* LOGOUT */}
          <Button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 h-14 bg-red-500 hover:bg-red-600"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>

        {/* EXTRA SECTION */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Welcome back 👋</p>
          <p className="mt-1">Manage your account and explore more features</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;