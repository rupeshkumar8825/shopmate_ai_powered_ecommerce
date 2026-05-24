import type { CategoryDataType, SliderDataType } from "../types/homePageTypes";

// all the constants related to the home page comes here
export const homePageSliderData : SliderDataType[] = [
    {
      id: 1,
      title: "Premium Electronics",
      subtitle: "Discover the latest tech innovations",
      description:
        "Up to 50% off on premium headphones, smartwatches, and more",
      image: "./electronics.jpg",
      buttonText: "Shop Electronics",
      url: "/products?category=Electronics",
    },
    {
      id: 2,
      title: "Fashion Forward",
      subtitle: "Style meets comfort",
      description: "New arrivals in designer clothing and accessories",
      image: "./fashion.jpg",
      buttonText: "Explore Fashion",
      url: "/products?category=Fashion",
    },
    {
      id: 3,
      title: "Home & Garden",
      subtitle: "Transform your space",
      description: "Beautiful furniture and decor for every home",
      image: "./furniture.jpg",
      buttonText: "Shop Home",
      url: `/products?category=Home & Garden`,
    },
]


export const listOfSupportedCategoriesData : CategoryDataType[] = [
  {
    id: "1",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300",
  },
  {
    id: "2",
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300",
  },
  {
    id: "3",
    name: "Home & Garden",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300",
  },
  {
    id: "4",
    name: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
  },
  {
    id: "5",
    name: "Books",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300",
  },
  {
    id: "6",
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300",
  },
  {
    id: "7",
    name: "Automotive",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300",
  },
  {
    id: "8",
    name: "Kids & Baby",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300",
  },
]