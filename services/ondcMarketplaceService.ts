// ONDC Marketplace Service
// This service handles all marketplace operations including farmer onboarding,
// product listings, order management, and customer interactions

import i18next from '../config/i18n';
import { translateLocation } from '../utils/translationUtils';

// Translation helper functions
const translateProductCategory = (category: string): string => {
  const key = `marketplace.categories.${category.toLowerCase().replace(/\s+/g, '')}`;
  const translated = i18next.t(key);
  return translated === key ? category : translated;
};

const translateProductInfo = (text: string): string => {
  const key = `marketplace.info.${text.toLowerCase().replace(/\s+/g, '')}`;
  const translated = i18next.t(key);
  return translated === key ? text : translated;
};

export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: {
    state: string;
    district: string;
    village: string;
    pincode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  profile: {
    image?: string;
    rating: number;
    totalOrders: number;
    joinDate: string;
    verified: boolean;
    certifications: string[];
  };
  farmDetails: {
    farmSize: number; // in acres
    cropTypes: string[];
    farmingMethod: "organic" | "traditional" | "mixed";
    soilType: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  ondcDetails: {
    sellerId: string;
    catalogId: string;
    networkParticipant: string;
    status: "active" | "pending" | "suspended";
  };
}

export interface Product {
  id: string;
  farmerId: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  unit: string;
  quantity: number;
  minimumOrder: number;
  images: string[];
  specifications: {
    variety: string;
    harvestDate: string;
    shelfLife: string;
    storageConditions: string;
    processingMethod?: string;
  };
  certifications: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fiber: number;
    vitamins: string[];
  };
  availability: {
    isAvailable: boolean;
    seasonalAvailability: string[];
    estimatedDelivery: string;
  };
  ondcAttributes: {
    itemId: string;
    catalogId: string;
    gstPercent: number;
    hsnCode: string;
    fulfillmentOptions: string[];
  };
  location: {
    pickupAddress: string;
    serviceableAreas: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  ondcOrderId: string;
  customerId: string;
  farmerId: string;
  items: OrderItem[];
  orderDetails: {
    totalAmount: number;
    tax: number;
    deliveryCharges: number;
    finalAmount: number;
    paymentMethod: string;
    paymentStatus: "pending" | "completed" | "failed" | "refunded";
  };
  deliveryDetails: {
    address: string;
    pincode: string;
    phone: string;
    preferredTime: string;
    instructions?: string;
  };
  status:
    | "placed"
    | "confirmed"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled";
  timeline: OrderTimeline[];
  createdAt: string;
  estimatedDelivery: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderTimeline {
  status: string;
  timestamp: string;
  description: string;
  location?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: CustomerAddress[];
  preferences: {
    preferredFarmers: string[];
    dietaryRestrictions: string[];
    favoriteCategories: string[];
  };
  orderHistory: string[];
}

export interface CustomerAddress {
  id: string;
  type: "home" | "office" | "other";
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

class ONDCMarketplaceService {
  private baseURL = "https://api.ondc.org/v1"; // ONDC Gateway URL
  private appId = "kisan-setu-app";
  private apiKey = process.env.EXPO_PUBLIC_ONDC_API_KEY || "demo-key";

  // Farmer Management
  async registerFarmer(
    farmerData: Partial<Farmer>
  ): Promise<{ success: boolean; farmerId?: string; error?: string }> {
    try {
      // Validate farmer data
      if (!farmerData.name || !farmerData.phone || !farmerData.location) {
        return { success: false, error: "Missing required farmer information" };
      }

      // Create ONDC seller profile
      const ondcSellerData = {
        name: farmerData.name,
        description: `Fresh produce from ${farmerData.location?.village}, ${farmerData.location?.district}`,
        category: "agriculture",
        subcategory: "fresh_produce",
        location: farmerData.location,
        contact: {
          phone: farmerData.phone,
          email: farmerData.email,
        },
      };

      // Register with ONDC network
      const ondcResponse = await this.makeONDCRequest(
        "/sellers/register",
        "POST",
        ondcSellerData
      );

      if (!ondcResponse.success) {
        return {
          success: false,
          error: "Failed to register with ONDC network",
        };
      }

      // Create farmer profile in our database
      const farmer: Farmer = {
        id: this.generateId(),
        name: farmerData.name!,
        email: farmerData.email || "",
        phone: farmerData.phone!,
        location: farmerData.location!,
        profile: {
          rating: 5.0,
          totalOrders: 0,
          joinDate: new Date().toISOString(),
          verified: false,
          certifications: farmerData.profile?.certifications || [],
        },
        farmDetails: farmerData.farmDetails || {
          farmSize: 0,
          cropTypes: [],
          farmingMethod: "traditional",
          soilType: "",
        },
        bankDetails: farmerData.bankDetails || {
          accountNumber: "",
          ifscCode: "",
          bankName: "",
          accountHolderName: farmerData.name!,
        },
        ondcDetails: {
          sellerId: ondcResponse.data.sellerId,
          catalogId: ondcResponse.data.catalogId,
          networkParticipant: ondcResponse.data.networkParticipant,
          status: "pending",
        },
      };

      // Store farmer data (in production, this would be saved to database)
      await this.storeFarmerData(farmer);

      return { success: true, farmerId: farmer.id };
    } catch (error) {
      console.error("Farmer registration error:", error);
      return {
        success: false,
        error: "Registration failed. Please try again.",
      };
    }
  }

  async getFarmerProfile(farmerId: string): Promise<Farmer | null> {
    try {
      // In production, fetch from database
      return await this.getFarmerFromStorage(farmerId);
    } catch (error) {
      console.error("Error fetching farmer profile:", error);
      return null;
    }
  }

  // Product Management
  async addProduct(
    product: Partial<Product>
  ): Promise<{ success: boolean; productId?: string; error?: string }> {
    try {
      if (!product.farmerId || !product.name || !product.price) {
        return {
          success: false,
          error: "Missing required product information",
        };
      }

      const farmer = await this.getFarmerProfile(product.farmerId);
      if (!farmer) {
        return { success: false, error: "Farmer not found" };
      }

      // Create ONDC item listing
      const ondcItemData = {
        sellerId: farmer.ondcDetails.sellerId,
        catalogId: farmer.ondcDetails.catalogId,
        item: {
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
          images: product.images,
          specifications: product.specifications,
        },
      };

      const ondcResponse = await this.makeONDCRequest(
        "/catalog/items",
        "POST",
        ondcItemData
      );

      if (!ondcResponse.success) {
        return { success: false, error: "Failed to list product on ONDC" };
      }

      // Create product record
      const newProduct: Product = {
        id: this.generateId(),
        farmerId: product.farmerId,
        name: product.name,
        description: product.description || "",
        category: product.category || "vegetables",
        subcategory: product.subcategory || "",
        price: product.price,
        unit: product.unit || "kg",
        quantity: product.quantity || 0,
        minimumOrder: product.minimumOrder || 1,
        images: product.images || [],
        specifications: product.specifications || {
          variety: "",
          harvestDate: new Date().toISOString().split("T")[0],
          shelfLife: "7 days",
          storageConditions: "Cool and dry place",
        },
        certifications: product.certifications || [],
        availability: {
          isAvailable: true,
          seasonalAvailability: [],
          estimatedDelivery: "2-3 days",
        },
        ondcAttributes: {
          itemId: ondcResponse.data.itemId,
          catalogId: farmer.ondcDetails.catalogId,
          gstPercent: 5,
          hsnCode: "0703",
          fulfillmentOptions: ["delivery", "pickup"],
        },
        location: {
          pickupAddress: `${farmer.location.village}, ${farmer.location.district}, ${farmer.location.state}`,
          serviceableAreas: [farmer.location.district],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store product data
      await this.storeProductData(newProduct);

      return { success: true, productId: newProduct.id };
    } catch (error) {
      console.error("Product creation error:", error);
      return {
        success: false,
        error: "Failed to add product. Please try again.",
      };
    }
  }

  // Translate product information for display
  private translateProduct(product: Product): Product {
    return {
      ...product,
      name: translateProductInfo(product.name),
      description: translateProductInfo(product.description),
      category: translateProductCategory(product.category),
      subcategory: translateProductCategory(product.subcategory),
      unit: translateProductInfo(product.unit),
      price: product.price, // Keep numeric value, format when displaying
      specifications: {
        ...product.specifications,
        variety: translateProductInfo(product.specifications.variety),
        storageConditions: translateProductInfo(product.specifications.storageConditions),
        processingMethod: product.specifications.processingMethod 
          ? translateProductInfo(product.specifications.processingMethod)
          : undefined,
      },
      location: {
        ...product.location,
        pickupAddress: product.location.pickupAddress
          .split(', ')
          .map(part => translateLocation(part))
          .join(', '),
        serviceableAreas: product.location.serviceableAreas.map(area => translateLocation(area)),
      }
    };
  }

  async getProducts(filters?: {
    category?: string;
    location?: string;
    farmerId?: string;
    searchQuery?: string;
    priceRange?: { min: number; max: number };
  }): Promise<Product[]> {
    try {
      // In production, this would query the database with filters
      const allProducts = await this.getAllProductsFromStorage();

      if (!filters) return allProducts.map(product => this.translateProduct(product));

      const filteredProducts = allProducts.filter((product) => {
        if (filters.category && product.category !== filters.category)
          return false;
        if (filters.farmerId && product.farmerId !== filters.farmerId)
          return false;
        if (
          filters.searchQuery &&
          !product.name
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase())
        )
          return false;
        if (
          filters.priceRange &&
          (product.price < filters.priceRange.min ||
            product.price > filters.priceRange.max)
        )
          return false;
        if (
          filters.location &&
          !product.location.serviceableAreas.includes(filters.location)
        )
          return false;

        return true;
      });

      return filteredProducts.map(product => this.translateProduct(product));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  // Order Management
  async placeOrder(orderData: {
    customerId: string;
    items: { productId: string; quantity: number }[];
    deliveryAddress: CustomerAddress;
    paymentMethod: string;
  }): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      // Validate order data
      if (!orderData.customerId || !orderData.items.length) {
        return { success: false, error: "Invalid order data" };
      }

      // Get product details and calculate totals
      const orderItems: OrderItem[] = [];
      let totalAmount = 0;

      for (const item of orderData.items) {
        const product = await this.getProductFromStorage(item.productId);
        if (!product) {
          return {
            success: false,
            error: `Product ${item.productId} not found`,
          };
        }

        if (product.quantity < item.quantity) {
          return {
            success: false,
            error: `Insufficient quantity for ${product.name}`,
          };
        }

        const itemTotal = product.price * item.quantity;
        orderItems.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: itemTotal,
        });

        totalAmount += itemTotal;
      }

      const tax = totalAmount * 0.05; // 5% GST
      const deliveryCharges = 50; // Fixed delivery charge
      const finalAmount = totalAmount + tax + deliveryCharges;

      // Create ONDC order
      const ondcOrderData = {
        items: orderItems.map((item) => ({
          itemId: item.productId,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: orderData.paymentMethod,
        totalAmount: finalAmount,
      };

      const ondcResponse = await this.makeONDCRequest(
        "/orders",
        "POST",
        ondcOrderData
      );

      if (!ondcResponse.success) {
        return { success: false, error: "Failed to place order through ONDC" };
      }

      // Create order record
      const order: Order = {
        id: this.generateId(),
        ondcOrderId: ondcResponse.data.orderId,
        customerId: orderData.customerId,
        farmerId: orderItems[0].productId, // Assuming single farmer for now
        items: orderItems,
        orderDetails: {
          totalAmount,
          tax,
          deliveryCharges,
          finalAmount,
          paymentMethod: orderData.paymentMethod,
          paymentStatus: "pending",
        },
        deliveryDetails: {
          address: `${orderData.deliveryAddress.address}, ${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state}`,
          pincode: orderData.deliveryAddress.pincode,
          phone: "", // Would be fetched from customer profile
          preferredTime: "Morning (9 AM - 12 PM)",
        },
        status: "placed",
        timeline: [
          {
            status: "placed",
            timestamp: new Date().toISOString(),
            description: "Order placed successfully",
          },
        ],
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(), // 3 days from now
      };

      // Store order data
      await this.storeOrderData(order);

      // Update product quantities
      for (const item of orderData.items) {
        await this.updateProductQuantity(item.productId, item.quantity);
      }

      return { success: true, orderId: order.id };
    } catch (error) {
      console.error("Order placement error:", error);
      return {
        success: false,
        error: "Failed to place order. Please try again.",
      };
    }
  }

  async getOrderStatus(orderId: string): Promise<Order | null> {
    try {
      return await this.getOrderFromStorage(orderId);
    } catch (error) {
      console.error("Error fetching order status:", error);
      return null;
    }
  }

  // Search and Discovery
  async searchProducts(
    query: string,
    filters?: {
      category?: string;
      location?: string;
      priceRange?: { min: number; max: number };
    }
  ): Promise<Product[]> {
    try {
      const translatedQuery = i18next.language === 'hi' 
        ? translateProductInfo(query) 
        : query;

      const products = await this.getProducts({
        searchQuery: translatedQuery,
        ...filters,
      });

      // Sort by relevance and farmer rating
      const sortedProducts = products.sort((a, b) => {
        const aName = i18next.language === 'hi' 
          ? translateProductInfo(a.name) 
          : a.name;
        const bName = i18next.language === 'hi'
          ? translateProductInfo(b.name)
          : b.name;

        const aRelevance = aName.toLowerCase().includes(translatedQuery.toLowerCase())
          ? 1
          : 0;
        const bRelevance = bName.toLowerCase().includes(translatedQuery.toLowerCase())
          ? 1
          : 0;

        if (aRelevance !== bRelevance) {
          return bRelevance - aRelevance;
        }

        // If same relevance, sort by farmer rating (would need to fetch farmer data)
        return 0;
      });

      return sortedProducts.map(product => this.translateProduct(product));
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  }

  // Helper methods for ONDC API communication
  private async makeONDCRequest(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // In production, this would make actual API calls to ONDC Gateway
      // For now, we'll simulate successful responses
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      const mockResponses: { [key: string]: any } = {
        "/sellers/register": {
          success: true,
          data: {
            sellerId: this.generateId(),
            catalogId: this.generateId(),
            networkParticipant: "ondc-gateway",
          },
        },
        "/catalog/items": {
          success: true,
          data: {
            itemId: this.generateId(),
          },
        },
        "/orders": {
          success: true,
          data: {
            orderId: this.generateId(),
          },
        },
      };

      return mockResponses[endpoint] || { success: true, data: {} };
    } catch (error) {
      console.error("ONDC API error:", error);
      return { success: false, error: "Network error" };
    }
  }

  // Storage helper methods (in production, these would interact with a database)
  private async storeFarmerData(farmer: Farmer): Promise<void> {
    // Simulate database storage
    console.log("Storing farmer data:", farmer.name);
  }

  private async getFarmerFromStorage(farmerId: string): Promise<Farmer | null> {
    // Simulate database retrieval
    return null;
  }

  private async storeProductData(product: Product): Promise<void> {
    // Simulate database storage
    console.log("Storing product data:", product.name);
  }

  private async getAllProductsFromStorage(): Promise<Product[]> {
    // Return mock data for demonstration
    return [];
  }

  private async getProductFromStorage(
    productId: string
  ): Promise<Product | null> {
    // Simulate database retrieval
    return null;
  }

  private async storeOrderData(order: Order): Promise<void> {
    // Simulate database storage
    console.log("Storing order data:", order.id);
  }

  private async getOrderFromStorage(orderId: string): Promise<Order | null> {
    // Simulate database retrieval
    return null;
  }

  private async updateProductQuantity(
    productId: string,
    quantitySold: number
  ): Promise<void> {
    // Simulate inventory update
    console.log(`Updating product ${productId} quantity by -${quantitySold}`);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export const ondcMarketplaceService = new ONDCMarketplaceService();
