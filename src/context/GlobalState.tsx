import { createContext, FC, ReactNode, useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { mockProducts } from "../mockDB/db";

type ContextType = {
  products?: ProductType[];
  cartItemCount?: number;
  totalPrice?: number;
  savedItemsCount?: number;
  addToCart?: (product: ProductType) => void;
  deleteFromCart?: (id: number | string) => void;
  setQuantity?: (qty: string, id: number | string) => void;
  decrementQty?: (id: number | string) => void;
  incrementQty?: (id: number | string) => void;
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
  quantity?: number | string;
}

// Create context
export const GlobalContext = createContext<ContextType>({});

// Provider component
export const Provider: FC<ReactNode> = ({ children }) => {
  const toast = useToast();
  const [products, setProducts] = useState<ProductType[]>(mockProducts);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [clickedItems, setClickedItems] = useState<Record<string, boolean>>({});
  const [savedItemsCount, setSavedItemsCount] = useState(0);

  useEffect(() => {
    const productsInCart = products.filter(product => product.inCart === true);
    const productPrices = productsInCart.map(
      product => +product.price * +product.quantity!
    );
    setTotalPrice(productPrices.reduce((a, b) => a + b, 0));
  }, [products]);


  const toggleSaved = (id: string | number) => {
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.id === id
          ? { ...prevProduct, isSaved: !prevProduct.isSaved }
          : prevProduct
      )
    );
    setClickedItems(prev => {
      const newClickedItems = { ...prev };
      // Since the object starts empty, the first time an item is clicked to be saved, newClickedItems[id] is undefined, therefore, setting its value to !newClickedItems[id] is basically coercing !undefined to true
      newClickedItems[id] = !newClickedItems[id];
      // Filter the newClickedItems object and return only the properties that have their value as true
      const currentlySaved = Object.filter(
        newClickedItems,
        (value: boolean) => value === true
      );
      setSavedItemsCount(Object.keys(currentlySaved).length);
      return { ...newClickedItems };
    });
  };

  const addToCart = (product: ProductType) => {
    toast({
      title: "Product successfully added to your cart",
      status: "success",
      duration: 1500,
      isClosable: true,
    });
    setCartItemCount(prev => prev + 1);
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.id === product.id
          ? { ...prevProduct, quantity: 1, inCart: true }
          : prevProduct
      )
    );
  };

  const deleteFromCart = (id: number | string) => {
    setCartItemCount(prev => prev - 1);
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.id === id ? { ...prevProduct, inCart: false } : prevProduct
      )
    );
  };

  const setQuantity = (qty: string, id: number | string) => {
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.id === id ? { ...prevProduct, quantity: qty } : prevProduct
      )
    );
  };

  const decrementQty = (id: number | string) => {
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.id === id
          ? { ...prevProduct, quantity: +prevProduct.quantity! - 1 }
          : prevProduct
      )
    );
  };

  const incrementQty = (id: number | string) => {
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.id === id
          ? { ...prevProduct, quantity: +prevProduct.quantity! + 1 }
          : prevProduct
      )
    );
  };

  return (
    <GlobalContext.Provider
      value={{
        products,
        cartItemCount,
        totalPrice,
        savedItemsCount,
        addToCart,
        deleteFromCart,
        setQuantity,
        incrementQty,
        decrementQty,
        toggleSaved,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

declare global {
  interface ObjectConstructor {
    filter: (obj: any, predicate: any) => any;
  }
}
// Custom function to filter objects
Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});
