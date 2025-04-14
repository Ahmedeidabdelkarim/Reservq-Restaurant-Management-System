import { createContext, useContext, useState, useEffect} from "react";
//import menuData from '../data/foods.json'
import { toast } from "react-toastify";
export const CartContext = createContext();

export default function CartProvider({ children }) {
  //const [menu] = useState(menuData);
  const [menu, setMenu] = useState([]);
  const [cartNum, setCartNum] = useState(() => {
    const savedCartNum = localStorage.getItem("cartNum");
    return savedCartNum ? JSON.parse(savedCartNum) : 0;
  });

  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("cartItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const API_URL = `${process.env.REACT_APP_URL}/api/v1`;

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch menu data");
        }
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
        toast.error("Failed to load menu!");
      }
    };
    fetchMenu();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  // Save cartNum to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartNum", JSON.stringify(cartNum));
  }, [cartNum]);

  // Function to add product to cart

  const addToCart = async (item) => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);

    // Show loading toast
    const toastId = toast.loading("Adding product...");
    const existingItem = items.find((it) => it.id === item.id);
    if (existingItem) {
      toast.update(toastId, {
        render: "Product already exists in cart!",
        type: "warning",
        isLoading: false,
        autoClose: 2000,
      });
      setIsAddingToCart(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setItems((prevCart) => [...prevCart, item]);

      // Update toast to success
      toast.update(toastId, {
        render: "Product added to cart!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Update cart number

      setCartNum((prevNum) => prevNum + 1);
    } catch (error) {
      // Handle potential errors
      toast.update(toastId, {
        render: "Failed to add product!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        menu,
        addToCart,
        items,
        setItems,
        cartNum,
        setCartNum,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);

