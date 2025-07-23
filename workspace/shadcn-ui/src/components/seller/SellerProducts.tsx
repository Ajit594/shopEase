import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, Search, Trash2Icon, PencilIcon, EyeIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  sellerId: string;
  inventory: number;
  status: 'active' | 'draft' | 'outOfStock';
  createdAt: string;
}

interface SellerProductsProps {
  sellerId: string;
}

export function SellerProducts({ sellerId }: SellerProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'electronics',
    description: '',
    imageUrl: '',
    inventory: '100',
    status: 'active' as 'active' | 'draft' | 'outOfStock',
  });

  const { toast } = useToast();

  // Fetch products from localStorage
  useEffect(() => {
    const fetchProducts = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Get products from localStorage, or initialize with some mock data if none exist
      const storedProducts = localStorage.getItem('products');
      let allProducts: Product[] = [];
      
      if (storedProducts) {
        allProducts = JSON.parse(storedProducts);
      } else {
        // Create mock products if none exist
        const mockProducts: Product[] = [
          {
            id: 'prod_1',
            name: 'Smartphone X',
            price: 799,
            category: 'electronics',
            description: 'The latest smartphone with amazing features',
            imageUrl: 'https://via.placeholder.com/150',
            sellerId: sellerId,
            inventory: 145,
            status: 'active',
            createdAt: '2023-05-15',
          },
          {
            id: 'prod_2',
            name: 'Laptop Pro',
            price: 1299,
            category: 'electronics',
            description: 'Powerful laptop for professionals',
            imageUrl: 'https://via.placeholder.com/150',
            sellerId: sellerId,
            inventory: 78,
            status: 'active',
            createdAt: '2023-06-10',
          },
          {
            id: 'prod_3',
            name: 'Wireless Headphones',
            price: 199,
            category: 'electronics',
            description: 'High-quality wireless headphones with noise cancellation',
            imageUrl: 'https://via.placeholder.com/150',
            sellerId: 'seller_2',
            inventory: 0,
            status: 'outOfStock',
            createdAt: '2023-07-05',
          },
        ];
        
        allProducts = mockProducts;
        localStorage.setItem('products', JSON.stringify(mockProducts));
      }
      
      // Filter products to only show this seller's products
      const sellerProducts = allProducts.filter(product => product.sellerId === sellerId);
      setProducts(sellerProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [sellerId]);

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      imageUrl: formData.imageUrl || 'https://via.placeholder.com/150',
      sellerId: sellerId,
      inventory: parseInt(formData.inventory),
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Add to localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedStoredProducts = [...storedProducts, newProduct];
    localStorage.setItem('products', JSON.stringify(updatedStoredProducts));

    // Update local state
    setProducts([...products, newProduct]);
    setIsAddProductDialogOpen(false);
    resetForm();

    toast({
      title: "Product created",
      description: "Your new product has been added successfully",
    });
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;

    const updatedProduct = {
      ...selectedProduct,
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      imageUrl: formData.imageUrl,
      inventory: parseInt(formData.inventory),
      status: formData.status,
    };

    // Update in localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedStoredProducts = storedProducts.map((product: Product) =>
      product.id === selectedProduct.id ? updatedProduct : product
    );
    localStorage.setItem('products', JSON.stringify(updatedStoredProducts));

    // Update local state
    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id ? updatedProduct : product
    );
    setProducts(updatedProducts);
    setIsEditProductDialogOpen(false);
    setSelectedProduct(null);
    resetForm();

    toast({
      title: "Product updated",
      description: "Your product information has been updated",
    });
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;

    // Update localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedStoredProducts = storedProducts.filter(
      (product: Product) => product.id !== selectedProduct.id
    );
    localStorage.setItem('products', JSON.stringify(updatedStoredProducts));

    // Update local state
    const updatedProducts = products.filter((product) => product.id !== selectedProduct.id);
    setProducts(updatedProducts);
    setIsDeleteProductDialogOpen(false);
    setSelectedProduct(null);

    toast({
      title: "Product deleted",
      description: "The product has been removed from your inventory",
      variant: "destructive",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'electronics',
      description: '',
      imageUrl: '',
      inventory: '100',
      status: 'active',
    });
  };

  const openEditProductDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl,
      inventory: product.inventory.toString(),
      status: product.status,
    });
    setIsEditProductDialogOpen(true);
  };

  const openDeleteProductDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteProductDialogOpen(true);
  };

  const categories = [
    'electronics',
    'clothing',
    'books',
    'home',
    'beauty',
    'sports',
    'toys',
    'grocery',
    'furniture',
    'wearables',
    'smart home',
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">My Products</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <PlusIcon className="h-4 w-4 mr-1" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Create a new product listing for your store
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="col-span-3"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category" className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    className="col-span-3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    className="col-span-3"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="inventory" className="text-right">
                    Inventory
                  </Label>
                  <Input
                    id="inventory"
                    type="number"
                    min="0"
                    className="col-span-3"
                    value={formData.inventory}
                    onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status" className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="outOfStock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 border rounded-md">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground mt-1">
                You haven't added any products yet or no products match your search.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setIsAddProductDialogOpen(true)}
              >
                <PlusIcon className="h-4 w-4 mr-1" /> Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableCaption>A list of all your products</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <span>{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.inventory}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : product.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                              : 'bg-red-100 text-red-800 hover:bg-red-100'
                          }`}
                        >
                          {product.status === 'active'
                            ? 'Active'
                            : product.status === 'draft'
                            ? 'Draft'
                            : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditProductDialog(product)}
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => openDeleteProductDialog(product)}
                          title="Delete"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update your product information and inventory status
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Price ($)
              </Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                className="col-span-3"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="edit-category" className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                className="col-span-3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                id="edit-imageUrl"
                className="col-span-3"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-inventory" className="text-right">
                Inventory
              </Label>
              <Input
                id="edit-inventory"
                type="number"
                min="0"
                className="col-span-3"
                value={formData.inventory}
                onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="edit-status" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="outOfStock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteProductDialogOpen} onOpenChange={setIsDeleteProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedProduct?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}