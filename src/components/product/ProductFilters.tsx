import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCategories } from "@/data/products";

export interface FilterOptions {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  minRating: number;
}

interface ProductFiltersProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

export const ProductFilters = ({ 
  filters, 
  onChange, 
  onReset 
}: ProductFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const allCategories = getCategories();
  
  const handleCategoryChange = (category: string) => {
    const updatedCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];
    
    const newFilters = { ...localFilters, categories: updatedCategories };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { 
      ...localFilters, 
      minPrice: value[0], 
      maxPrice: value[1] 
    };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleInStockChange = (checked: boolean) => {
    const newFilters = { ...localFilters, inStock: checked };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleRatingChange = (value: number[]) => {
    const newFilters = { ...localFilters, minRating: value[0] };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "stock", "rating"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {allCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={localFilters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider 
                defaultValue={[localFilters.minPrice, localFilters.maxPrice]} 
                min={0} 
                max={500} 
                step={10}
                onValueChange={handlePriceChange}
              />
              <div className="flex items-center justify-between">
                <div className="grid gap-1">
                  <Label htmlFor="min-price">Min</Label>
                  <Input
                    id="min-price"
                    type="number"
                    min={0}
                    max={localFilters.maxPrice}
                    value={localFilters.minPrice}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      handlePriceChange([value, localFilters.maxPrice]);
                    }}
                  />
                </div>
                <div>-</div>
                <div className="grid gap-1">
                  <Label htmlFor="max-price">Max</Label>
                  <Input
                    id="max-price"
                    type="number"
                    min={localFilters.minPrice}
                    max={500}
                    value={localFilters.maxPrice}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      handlePriceChange([localFilters.minPrice, value]);
                    }}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stock">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="in-stock"
                checked={localFilters.inStock}
                onCheckedChange={(checked) => handleInStockChange(checked as boolean)}
              />
              <Label htmlFor="in-stock">In Stock Only</Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Slider 
                defaultValue={[localFilters.minRating]} 
                min={0} 
                max={5} 
                step={0.5}
                onValueChange={handleRatingChange}
              />
              <div className="flex items-center justify-between">
                <Label htmlFor="min-rating">{localFilters.minRating}+ stars</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};