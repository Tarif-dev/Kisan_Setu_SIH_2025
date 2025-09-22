import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../../contexts/LanguageContext";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  farmer: {
    name: string;
    location: string;
    rating: number;
    image: string;
  };
  image: string;
  category: string;
  description: string;
  quantity: number;
  certification: string[];
  freshness: string;
  harvestDate: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const Marketplace = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});

  const categories: Category[] = [
    { id: "all", name: t("marketplace.all"), icon: "grid", color: "#3B82F6" },
    {
      id: "vegetables",
      name: t("marketplace.vegetables"),
      icon: "leaf",
      color: "#10B981",
    },
    {
      id: "fruits",
      name: t("marketplace.fruits"),
      icon: "nutrition",
      color: "#F59E0B",
    },
    {
      id: "grains",
      name: t("marketplace.grains"),
      icon: "restaurant",
      color: "#8B5CF6",
    },
    {
      id: "dairy",
      name: t("marketplace.dairy"),
      icon: "water",
      color: "#06B6D4",
    },
    {
      id: "organic",
      name: t("marketplace.organic"),
      icon: "flower",
      color: "#84CC16",
    },
  ];

  const products: Product[] = [
    {
      id: "1",
      name: t("marketplace.products.freshTomatoes.name"),
      price: 45,
      unit: t("marketplace.units.kg"),
      farmer: {
        name: t("marketplace.farmers.rajeshKumar"),
        location: t("marketplace.locations.haryana"),
        rating: 4.8,
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      image:
        "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=200&fit=crop",
      category: "vegetables",
      description: t("marketplace.products.freshTomatoes.description"),
      quantity: 50,
      certification: [
        t("marketplace.certifications.organic"),
        t("marketplace.certifications.fssai"),
      ],
      freshness: t("marketplace.freshnessTypes.harvestedToday"),
      harvestDate: "2025-09-13",
    },
    {
      id: "2",
      name: t("marketplace.products.basmatiRice.name"),
      price: 120,
      unit: t("marketplace.units.kg"),
      farmer: {
        name: t("marketplace.farmers.priyaSingh"),
        location: t("marketplace.locations.punjab"),
        rating: 4.9,
        image:
          "https://images.unsplash.com/photo-1494790108755-2616b612b8b5?w=100&h=100&fit=crop&crop=face",
      },
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop",
      category: "grains",
      description: t("marketplace.products.basmatiRice.description"),
      quantity: 100,
      certification: [
        t("marketplace.certifications.premiumGrade"),
        t("marketplace.certifications.exportQuality"),
      ],
      freshness: t("marketplace.freshnessTypes.freshStock"),
      harvestDate: "2025-08-25",
    },
    {
      id: "3",
      name: t("marketplace.products.freshMangoes.name"),
      price: 80,
      unit: t("marketplace.units.kg"),
      farmer: {
        name: t("marketplace.farmers.sureshPatel"),
        location: t("marketplace.locations.gujarat"),
        rating: 4.7,
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      },
      image:
        "https://images.unsplash.com/photo-1553279745-f28ffbfe2de7?w=300&h=200&fit=crop",
      category: "fruits",
      description: t("marketplace.products.freshMangoes.description"),
      quantity: 30,
      certification: [
        t("marketplace.certifications.organic"),
        t("marketplace.certifications.premium"),
      ],
      freshness: t("marketplace.freshnessTypes.treeFresh"),
      harvestDate: "2025-09-10",
    },
    {
      id: "4",
      name: t("marketplace.products.farmFreshMilk.name"),
      price: 65,
      unit: t("marketplace.units.liter"),
      farmer: {
        name: t("marketplace.farmers.mohitSharma"),
        location: t("marketplace.locations.rajasthan"),
        rating: 4.6,
        image:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
      },
      image:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop",
      category: "dairy",
      description: t("marketplace.products.farmFreshMilk.description"),
      quantity: 20,
      certification: [
        t("marketplace.certifications.fssai"),
        t("marketplace.certifications.pasteurized"),
      ],
      freshness: t("marketplace.freshnessTypes.dailyFresh"),
      harvestDate: "2025-09-13",
    },
    {
      id: "5",
      name: t("marketplace.products.organicSpinach.name"),
      price: 25,
      unit: t("marketplace.units.bunch"),
      farmer: {
        name: t("marketplace.farmers.anitaDevi"),
        location: t("marketplace.locations.uttarPradesh"),
        rating: 4.8,
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      },
      image:
        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=200&fit=crop",
      category: "vegetables",
      description: t("marketplace.products.organicSpinach.description"),
      quantity: 40,
      certification: [
        t("marketplace.certifications.organic"),
        t("marketplace.certifications.pesticideFree"),
      ],
      freshness: t("marketplace.freshnessTypes.morningFresh"),
      harvestDate: "2025-09-13",
    },
    {
      id: "6",
      name: t("marketplace.products.wheatFlour.name"),
      price: 55,
      unit: t("marketplace.units.kg"),
      farmer: {
        name: t("marketplace.farmers.vikramSingh"),
        location: t("marketplace.locations.madhyaPradesh"),
        rating: 4.5,
        image:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=face",
      },
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop",
      category: "grains",
      description: t("marketplace.products.wheatFlour.description"),
      quantity: 80,
      certification: [
        t("marketplace.certifications.organic"),
        t("marketplace.certifications.stoneGround"),
      ],
      freshness: t("marketplace.freshnessTypes.freshGround"),
      harvestDate: "2025-09-01",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    Alert.alert(
      t("marketplace.alerts.addedToCart"),
      t("marketplace.alerts.productAdded")
    );
  };

  const buyNow = (product: Product) => {
    Alert.alert(
      t("marketplace.alerts.ondcOrder"),
      `${t("marketplace.alerts.proceedToBuy")} ${product.name} ${t("marketplace.alerts.from")} ${product.farmer.name}?\n\n${t("marketplace.alerts.price")}: ₹${product.price}/${product.unit}`,
      [
        { text: t("marketplace.alerts.cancel"), style: "cancel" },
        {
          text: t("marketplace.alerts.proceed"),
          onPress: () => {
            Alert.alert(
              t("marketplace.alerts.orderPlaced"),
              t("marketplace.alerts.orderSuccess")
            );
          },
        },
      ]
    );
  };

  const contactFarmer = (farmer: any) => {
    Alert.alert(
      t("marketplace.alerts.contactFarmer"),
      `${t("marketplace.alerts.connectWith")} ${farmer.name} ${t("marketplace.alerts.from")} ${farmer.location}`,
      [
        {
          text: t("marketplace.alerts.call"),
          onPress: () =>
            Alert.alert(
              t("marketplace.alerts.calling"),
              `${t("marketplace.alerts.calling")} ${farmer.name}...`
            ),
        },
        {
          text: t("marketplace.alerts.message"),
          onPress: () =>
            Alert.alert(
              t("marketplace.alerts.message"),
              `${t("marketplace.alerts.openingChat")} ${farmer.name}...`
            ),
        },
        { text: t("marketplace.alerts.cancel"), style: "cancel" },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      className="bg-gray-800 rounded-2xl m-2 border border-gray-700 overflow-hidden"
      style={{ width: "47%" }}
      onPress={() => setSelectedProduct(item)}
    >
      <Image source={{ uri: item.image }} className="w-full h-32" />

      {/* Freshness Badge */}
      <View className="absolute top-2 left-2 bg-green-500 rounded-full px-2 py-1">
        <Text className="text-white text-xs font-medium">{item.freshness}</Text>
      </View>

      <View className="p-3">
        <Text className="text-white font-semibold text-base mb-1">
          {item.name}
        </Text>
        <Text className="text-green-400 font-bold text-lg">
          ₹{item.price}/{item.unit}
        </Text>

        {/* Farmer Info */}
        <View className="flex-row items-center mt-2 mb-2">
          <Image
            source={{ uri: item.farmer.image }}
            className="w-6 h-6 rounded-full mr-2"
          />
          <Text className="text-gray-400 text-xs flex-1">
            {item.farmer.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text className="text-gray-400 text-xs ml-1">
              {item.farmer.rating}
            </Text>
          </View>
        </View>

        {/* Certifications */}
        <View className="flex-row flex-wrap mb-2">
          {item.certification.slice(0, 2).map((cert, index) => (
            <View
              key={index}
              className="bg-blue-500/20 rounded-full px-2 py-1 mr-1 mb-1"
            >
              <Text className="text-blue-400 text-xs">{cert}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => addToCart(item.id)}
            className="bg-gray-700 rounded-lg px-3 py-2 flex-1 mr-1"
          >
            <Text className="text-white text-xs text-center font-medium">
              Add to Cart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => buyNow(item)}
            className="bg-green-500 rounded-lg px-3 py-2 flex-1 ml-1"
          >
            <Text className="text-white text-xs text-center font-medium">
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-gray-900">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-white">
            {t("marketplace.title")}
          </Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.push("/farmer-onboarding")}
              className="mr-3"
            >
              <Ionicons name="add-circle" size={24} color="#22C55E" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Cart",
                  `You have ${Object.keys(cartItems).length} items in cart`
                )
              }
            >
              <View>
                <Ionicons name="cart" size={24} color="white" />
                {Object.keys(cartItems).length > 0 && (
                  <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {Object.values(cartItems).reduce((a, b) => a + b, 0)}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ONDC Badge */}
        <View className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 mb-4">
          <View className="flex-row items-center">
            <Ionicons name="globe" size={20} color="#3B82F6" />
            <View className="ml-3 flex-1">
              <Text className="text-blue-400 font-semibold">
                {t("marketplace.ondcBadge.poweredBy")}
              </Text>
              <Text className="text-gray-300 text-sm">
                {t("marketplace.ondcBadge.directFrom")}
              </Text>
            </View>
          </View>
        </View>

        {/* Farmer CTA */}
        <View className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-green-400 font-semibold">
                {t("marketplace.farmerCta.question")}
              </Text>
              <Text className="text-gray-300 text-sm">
                {t("marketplace.farmerCta.description")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/farmer-onboarding")}
              className="bg-green-500 rounded-lg px-4 py-2"
            >
              <Text className="text-white font-medium">
                {t("marketplace.farmerCta.joinButton")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="bg-gray-800 rounded-xl flex-row items-center px-4 py-3 mb-4">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t("marketplace.searchProducts")}
            placeholderTextColor="#9CA3AF"
            className="text-white ml-3 flex-1"
          />
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <Ionicons name="options" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`mr-3 px-4 py-2 rounded-xl flex-row items-center ${
                selectedCategory === category.id ? "bg-blue-500" : "bg-gray-800"
              }`}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={
                  selectedCategory === category.id ? "white" : category.color
                }
              />
              <Text
                className={`ml-2 font-medium ${
                  selectedCategory === category.id
                    ? "text-white"
                    : "text-gray-300"
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 8 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Product Detail Modal */}
      <Modal
        visible={selectedProduct !== null}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedProduct && (
          <View className="flex-1 bg-gray-900">
            <ScrollView>
              {/* Header */}
              <View className="relative">
                <Image
                  source={{ uri: selectedProduct.image }}
                  className="w-full h-64"
                />
                <TouchableOpacity
                  onPress={() => setSelectedProduct(null)}
                  className="absolute top-12 left-4 bg-black/50 rounded-full p-2"
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <View className="absolute top-12 right-4 bg-green-500 rounded-full px-3 py-1">
                  <Text className="text-white text-sm font-medium">
                    {selectedProduct.freshness}
                  </Text>
                </View>
              </View>

              <View className="p-4">
                {/* Product Info */}
                <Text className="text-white text-2xl font-bold mb-2">
                  {selectedProduct.name}
                </Text>
                <Text className="text-green-400 text-3xl font-bold mb-4">
                  ₹{selectedProduct.price}/{selectedProduct.unit}
                </Text>

                {/* Farmer Card */}
                <View className="bg-gray-800 rounded-xl p-4 mb-4">
                  <Text className="text-white font-semibold mb-3">
                    Farmer Details
                  </Text>
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: selectedProduct.farmer.image }}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <View className="flex-1">
                      <Text className="text-white font-medium">
                        {selectedProduct.farmer.name}
                      </Text>
                      <Text className="text-gray-400 text-sm">
                        {selectedProduct.farmer.location}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Ionicons name="star" size={16} color="#F59E0B" />
                        <Text className="text-gray-400 text-sm ml-1">
                          {selectedProduct.farmer.rating} rating
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => contactFarmer(selectedProduct.farmer)}
                      className="bg-blue-500 rounded-lg px-4 py-2"
                    >
                      <Text className="text-white font-medium">Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Product Details */}
                <View className="bg-gray-800 rounded-xl p-4 mb-4">
                  <Text className="text-white font-semibold mb-3">
                    Product Details
                  </Text>
                  <Text className="text-gray-300 text-sm leading-5 mb-3">
                    {selectedProduct.description}
                  </Text>

                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-400">Available Quantity:</Text>
                    <Text className="text-white">
                      {selectedProduct.quantity} {selectedProduct.unit}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-400">Harvest Date:</Text>
                    <Text className="text-white">
                      {selectedProduct.harvestDate}
                    </Text>
                  </View>

                  {/* Certifications */}
                  <Text className="text-gray-400 mb-2">Certifications:</Text>
                  <View className="flex-row flex-wrap">
                    {selectedProduct.certification.map((cert, index) => (
                      <View
                        key={index}
                        className="bg-blue-500/20 rounded-full px-3 py-1 mr-2 mb-2"
                      >
                        <Text className="text-blue-400 text-sm">{cert}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => addToCart(selectedProduct.id)}
                    className="bg-gray-700 rounded-xl py-4 px-6 flex-1"
                  >
                    <Text className="text-white text-center font-semibold text-lg">
                      Add to Cart
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => buyNow(selectedProduct)}
                    className="bg-green-500 rounded-xl py-4 px-6 flex-1"
                  >
                    <Text className="text-white text-center font-semibold text-lg">
                      Buy Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default Marketplace;
