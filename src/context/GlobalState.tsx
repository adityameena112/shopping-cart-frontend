import { createContext, FC, ReactNode, useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { mockProducts } from "../mockDB/db";

type ContextType = {
  products?: ProductType[];
  cartItemCount?: number;
  cartItems?: CartItemType[];
  addToCart?: (product: ProductType) => void;
  deleteFromCart?: (id: number | string) => void;
  setQuantity?: (qty: string, id: number | string) => void;
  decrementQty?: (id: number | string) => void;
  incrementQty?: (id: number | string) => void;
  totalPrice?: number;
  savedItemsCount?: number;
  toggleSaved?: (id: number | string) => void;
};

export interface ProductType {
  id: string;
  imageUrl: string;
  imageAlt: string | undefined;
  title: string | null;
  shortDescription: string | null;
  description?: string | null;
  brand?: string | null;
  price: string | number;
  tag: string | null;
  tagline: string | null;
  rating: number | null;
  reviewCount?: number | null;
  isSaved?: boolean;
  inCart?: boolean;
}

export type CartItemType = ProductType & {
  quantity?: number | string;
};

// Create context
export const GlobalContext = createContext<ContextType>({});

// Provider component
export const Provider: FC<ReactNode> = ({ children }) => {
  const toast = useToast();
  const [products, setProducts] = useState<ProductType[]>(mockProducts);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [clickedItems, setClickedItems] = useState<Record<string, boolean>>({});
  const [savedItemsCount, setSavedItemsCount] = useState(0);

  useEffect(() => {
    const productPrices = cartItems.map(product =>
      product.quantity ? +product.price * +product.quantity : +product.price
    );
    setTotalPrice(productPrices.reduce((a, b) => a + b, 0));
  }, [cartItems]);

  const toggleSaved = (id: string | number) => {
    const productExists: ProductType | undefined = products.find(
      product => product.id === id
    );
    if (productExists) {
      const newProducts = products.map(product =>
        product.id === id
          ? {
              ...productExists,
              isSaved: !product.isSaved,
            }
          : product
      );
      setProducts(newProducts);
    }
    const itemExistsInCart: CartItemType | undefined = cartItems.find(
      item => item.id === id
    );
    if (itemExistsInCart) {
      const newCartItems = cartItems.map(item =>
        item.id === id
          ? {
              ...itemExistsInCart,
              isSaved: !item.isSaved,
            }
          : item
      );
      setCartItems(newCartItems);
    }
    setClickedItems(prev => {
      const newClickedItems = { ...prev };
      newClickedItems[id] = !newClickedItems[id];
      const currentlySaved = Object.filter(
        newClickedItems,
        (value: boolean) => value === true
      );
      setSavedItemsCount(Object.keys(currentlySaved).length);
      return { ...newClickedItems };
    });
  };

  const addToCart = (product: ProductType) => {
    const itemExistsInCart: CartItemType | undefined = cartItems.find(
      item => item.id === product.id
    );
    // If item does not exist in cart
    if (!itemExistsInCart) {
      toast({
        title: "Product successfully added to your cart",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
      setCartItemCount(prev => prev + 1);
      setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
      setProducts(prevProducts =>
        prevProducts.map(prevProduct =>
          prevProduct.id === product.id
            ? { ...prevProduct, inCart: true }
            : prevProduct
        )
      );
    }
  };

  const deleteFromCart = (id: number | string) => {
    setCartItemCount(prev => prev - 1);
    const newCartItems = cartItems.filter(product => product.id !== id);
    setCartItems(newCartItems);
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.id === id ? { ...prevProduct, inCart: false } : prevProduct
      )
    );
  };

  const setQuantity = (qty: string, id: number | string) => {
    const itemExistsInCart: CartItemType | undefined = cartItems.find(
      item => item.id === id
    );
    if (itemExistsInCart) {
      const newCartItems = cartItems.map(item =>
        item.id === id
          ? {
              ...itemExistsInCart,
              quantity: qty,
            }
          : item
      );
      setCartItems(newCartItems);
    }
  };
  const decrementQty = (id: number | string) => {
    const itemExistsInCart: CartItemType | undefined = cartItems.find(
      item => item.id === id
    );
    if (itemExistsInCart) {
      const newQty = +itemExistsInCart.quantity! - 1;
      const newCartItems = cartItems.map(item =>
        item.id === id
          ? {
              ...itemExistsInCart,
              quantity: newQty,
            }
          : item
      );
      setCartItems(newCartItems);
    }
  };
  const incrementQty = (id: number | string) => {
    const itemExistsInCart: CartItemType | undefined = cartItems.find(
      item => item.id === id
    );
    if (itemExistsInCart) {
      const newQty = +itemExistsInCart.quantity! + 1;
      const newCartItems = cartItems.map(item =>
        item.id === id
          ? {
              ...itemExistsInCart,
              quantity: newQty,
            }
          : item
      );
      setCartItems(newCartItems);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        products,
        cartItemCount,
        cartItems,
        addToCart,
        deleteFromCart,
        setQuantity,
        incrementQty,
        decrementQty,
        totalPrice,
        savedItemsCount,
        toggleSaved,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Increment quantity when adding to cart
//   const newCartItems = cartItems.map(item =>
//     item.id === id
//       ? {
//           ...itemExistsInCart,
//           quantity:
//             +itemExistsInCart.quantity! + 1,
//         }
//       : item
//   );
//   setCartItems(newCartItems);
