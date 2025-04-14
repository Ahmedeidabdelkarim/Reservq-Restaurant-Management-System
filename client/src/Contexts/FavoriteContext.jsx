import { createContext, useContext, useState,useEffect} from "react";
import { toast } from "react-toastify";
export const FavoriteContext = createContext();

export default function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [favoriteNum, setFavoriteNum] = useState(() => {
    const savedFavoriteNum = localStorage.getItem("favoriteNum");
    return savedFavoriteNum ? JSON.parse(savedFavoriteNum) : 0;
  });
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  const addToFavorites = async (item) => {
    if (isAddingToFavorites) return;
    setIsAddingToFavorites(true);

    // Show loading toast
    const toastId = toast.loading("Adding product...");

    const existingItem = favorites.find((i) => i.id === item.id);
    if (existingItem) {
      toast.update(toastId, {
        render: "Product already exists in favorites!",
        type: "warning",
        isLoading: false,
        autoClose: 2000,
      });
      setIsAddingToFavorites(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFavorites((prevCart) => [...prevCart, item]);

      // Update toast to success
      toast.update(toastId, {
        render: "Product added to favorites!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Update cart number

      setFavoriteNum((prevNum) => prevNum + 1);
    } catch (error) {
      // Handle potential errors
      toast.update(toastId, {
        render: "Failed to add product!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save favoriteNum to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favoriteNum", JSON.stringify(favoriteNum));
  }, [favoriteNum]);

  return (
    <FavoriteContext.Provider
      value={{
        addToFavorites,
        favorites,
        setFavorites,
        favoriteNum,
        setFavoriteNum,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavoriteContext = () => useContext(FavoriteContext);

