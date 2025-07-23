import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import { useCart } from "@/hooks/useCart";
import { Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  const incrementQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      updateQuantity(item.id, value);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center py-4 border-b">
      <div className="flex-shrink-0 w-full md:w-20 h-20 bg-gray-100 rounded mb-4 md:mb-0 md:mr-4 flex items-center justify-center text-gray-400">
        Product Image
      </div>
      
      <div className="flex-grow md:mr-4">
        <h3 className="font-medium">{item.name}</h3>
        <div className="text-sm text-gray-500 mt-1">Item #{item.id}</div>
      </div>
      
      <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto">
        <div className="flex items-center border rounded mr-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={decrementQuantity}
          >
            -
          </Button>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-12 h-8 text-center border-0"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={incrementQuantity}
          >
            +
          </Button>
        </div>
        
        <div className="font-medium mr-4 w-24 text-right">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};