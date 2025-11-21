import { useState, useEffect } from 'react';
import { Plus, Package, Calendar, AlertCircle, Apple, ShoppingCart, Utensils, ArrowLeft } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export interface Inventory {
  id: string;
  name: string;
  description?: string;
  isPrivate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  inventoryId: string;
  foodItemId?: string;
  customName?: string;
  quantity: number;
  unit?: string;
  expiryDate?: string;
  notes?: string;
  foodItem?: {
    id: string;
    name: string;
    category: string;
    unit: string;
    typicalExpirationDays?: number;
    description?: string;
  };
}

export interface FoodItem {
  id: string;
  name: string;
  unit?: string;
  category?: string;
  typicalExpirationDays?: number;
  sampleCostPerUnit?: number;
  description?: string;
}

export default function InventoryDetailPage() {
  const { inventoryId } = useParams<{ inventoryId: string }>();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  const { useGetInventories, useGetInventoryItems, useAddItemToInventory } = useInventory();
  const { data: inventories, isLoading } = useGetInventories();
  const { data: inventoryItems, isLoading: itemsLoading } = useGetInventoryItems(inventoryId!);
  const addItemMutation = useAddItemToInventory(inventoryId!);

  useEffect(() => {
    if (!inventoryId) {
      setError('Inventory ID is required');
      setLoading(false);
      return;
    }

    // Wait for inventories to load
    if (isLoading) return;

    try {
      // Find the specific inventory from the list of all inventories
      if (inventories) {
        const foundInventory = inventories.find((inv) => inv.id === inventoryId);
        if (foundInventory) {
          setInventory(foundInventory);
          setLoading(false);
        } else {
          setError('Inventory not found');
          setLoading(false);
        }
      } else {
        setError('Failed to load inventories');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load inventory');
      console.error(err);
      setLoading(false);
    }
  }, [inventoryId, inventories, isLoading]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/70">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-xl max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Inventory</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
          >
            Go Back to Inventories
          </button>
        </div>
      </div>
    );
  }

  if (!inventory) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-6 bg-card border border-border rounded-xl max-w-md">
          <Package className="w-12 h-12 text-foreground/70 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground mb-2">Inventory Not Found</h3>
          <p className="text-foreground/70 mb-4">The requested inventory could not be found.</p>
          <button
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
          >
            Go Back to Inventories
          </button>
        </div>
      </div>
    );
  }

  const filteredItems = (inventoryItems || []).filter(item => {
    const itemName = item.customName || item.foodItem?.name || '';
    const itemNotes = item.notes || '';
    return itemName.toLowerCase().includes(search.toLowerCase()) ||
           itemNotes.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-3 max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/inventory')}
            className="p-2 rounded-lg hover:bg-secondary/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-foreground">{inventory.name}</h1>
            <p className="text-sm text-foreground/70">
              {inventory.description || 'Manage your food items'}
            </p>
          </div>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth font-medium flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Total Items</p>
                <p className="text-2xl font-bold text-foreground">{(inventoryItems || []).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Apple className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Fruits & Veggies</p>
                <p className="text-2xl font-bold text-foreground">
                  {(inventoryItems || []).filter(i => {
                    const category = i.foodItem?.category;
                    return ['fruit', 'vegetable'].includes(category || '');
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Utensils className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Expiring Soon</p>
                <p className="text-2xl font-bold text-foreground">
                  {(inventoryItems || []).filter(i => {
                    if (!i.expiryDate) return false;
                    const expDate = new Date(i.expiryDate);
                    const today = new Date();
                    const diffTime = expDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 3 && diffDays >= 0;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search items in this inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>

        {itemsLoading ? (
          <div className="text-center py-12 text-foreground/60">Loading items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No items yet</h3>
            <p className="text-foreground/60 mb-4">Add food items to this inventory</p>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth font-medium"
              onClick={() => setShowAddModal(true)}
            >
              Add Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const itemName = item.customName || item.foodItem?.name || 'Unknown Item';
              const itemCategory = item.foodItem?.category || (item.foodItemId ? 'uncategorized' : 'custom');
              
              return (
                <div key={item.id} className="bg-card rounded-xl border border-border p-6 shadow hover:shadow-lg transition-smooth">
                  <div className="flex items-center gap-3 mb-2">
                    {itemCategory === 'fruit' && <Apple className="w-6 h-6 text-primary" />}
                    {itemCategory === 'vegetable' && <ShoppingCart className="w-6 h-6 text-primary" />}
                    {itemCategory === 'dairy' && <Utensils className="w-6 h-6 text-primary" />}
                    {itemCategory === 'grain' && <Package className="w-6 h-6 text-primary" />}
                    {itemCategory === 'protein' && <Package className="w-6 h-6 text-primary" />}
                    {itemCategory === 'pantry' && <Package className="w-6 h-6 text-primary" />}
                    {itemCategory === 'custom' && <AlertCircle className="w-6 h-6 text-orange-500" />}
                    <div className="flex-1">
                      <span className="font-bold text-lg text-foreground">{itemName}</span>
                      {item.foodItem && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Linked
                        </span>
                      )}
                      {!item.foodItem && item.customName && (
                        <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          Custom
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-foreground font-semibold">{item.quantity} {item.unit}</div>
                    <div className="text-sm text-foreground/70 capitalize">{itemCategory}</div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {item.expiryDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-foreground/70" />
                        <span className="text-foreground/70">Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {item.notes && (
                      <div className="text-foreground/70">
                        <span className="font-medium">Notes:</span> {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onAdd={addItemMutation.mutate}
        />
      )}
    </div>
  );
}

interface AddItemModalProps {
  onClose: () => void;
  onAdd: (item: {
    foodItemId?: string;
    customName?: string;
    quantity: number;
    unit?: string;
    expiryDate?: Date;
    notes?: string;
  }) => void;
}

function AddItemModal({ onClose, onAdd }: AddItemModalProps) {
  const [form, setForm] = useState({
    selectedFoodItemId: '',
    customName: '',
    quantity: 0,
    unit: '',
    expirationDate: '',
    purchaseDate: '',
    location: '',
    notes: '',
    useCustomItem: false,
  });
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingFoodItems, setLoadingFoodItems] = useState(true);

  // Fetch food items from the API
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch('/api/foods');
        if (response.ok) {
          const data = await response.json();
          setFoodItems(data.data || []);
        } else {
          console.error('Failed to fetch food items');
        }
      } catch (error) {
        console.error('Error fetching food items:', error);
      } finally {
        setLoadingFoodItems(false);
      }
    };

    fetchFoodItems();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: name === 'quantity' ? Number(value) : value
      }));
    }

    // Auto-fill unit when food item is selected
    if (name === 'selectedFoodItemId' && value) {
      const selectedFood = foodItems.find(item => item.id === value);
      if (selectedFood) {
        setForm(prev => ({
          ...prev,
          unit: selectedFood.unit || '',
          // Auto-calculate expiry date if typical expiration days is available
          expirationDate: selectedFood.typicalExpirationDays 
            ? new Date(Date.now() + selectedFood.typicalExpirationDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            : prev.expirationDate
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const itemData = {
        foodItemId: form.useCustomItem ? undefined : form.selectedFoodItemId || undefined,
        customName: form.useCustomItem ? form.customName : undefined,
        quantity: form.quantity,
        unit: form.unit,
        expiryDate: form.expirationDate ? new Date(form.expirationDate) : undefined,
        notes: form.notes || undefined,
      };

      await onAdd(itemData);
      onClose();
    } catch (err) {
      setError('Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-50">
      <form
        className="bg-card rounded-2xl border border-border shadow-xl p-8 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-foreground mb-4">Add Item to Inventory</h2>

        {error && (
          <div className="text-red-500 mb-4 p-2 bg-red-50 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* Toggle between existing food items and custom items */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useCustomItem"
              name="useCustomItem"
              checked={form.useCustomItem}
              onChange={handleChange}
              className="rounded"
            />
            <label htmlFor="useCustomItem" className="text-sm text-foreground">
              Add custom item (not in database)
            </label>
          </div>

          {!form.useCustomItem ? (
            // Select from existing food items
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Select Food Item
              </label>
              {loadingFoodItems ? (
                <div className="text-sm text-foreground/60">Loading food items...</div>
              ) : (
                <select
                  name="selectedFoodItemId"
                  value={form.selectedFoodItemId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  required={!form.useCustomItem}
                >
                  <option value="">Select a food item...</option>
                  {foodItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.category}) - {item.unit}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            // Custom item name
            <input
              name="customName"
              required={form.useCustomItem}
              placeholder="Custom item name"
              value={form.customName}
              onChange={handleChange}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <input
              name="quantity"
              type="number"
              min="0"
              required
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            />

            <input
              name="unit"
              required
              placeholder="Unit (kg, L, pcs)"
              value={form.unit}
              onChange={handleChange}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-foreground/70 mb-1">Expiration Date</label>
              <input
                name="expirationDate"
                type="date"
                value={form.expirationDate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground/70 mb-1">Purchase Date</label>
              <input
                name="purchaseDate"
                type="date"
                value={form.purchaseDate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
          </div>



          <input
            name="location"
            placeholder="Storage location (e.g., Fridge, Pantry)"
            value={form.location}
            onChange={handleChange}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          />

          <textarea
            name="notes"
            placeholder="Additional notes"
            value={form.notes}
            onChange={handleChange}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            rows={2}
          />
        </div>

        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth font-medium flex-1"
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-secondary/10 transition-smooth font-medium flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}