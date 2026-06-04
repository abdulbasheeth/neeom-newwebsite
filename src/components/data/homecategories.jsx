import React from "react";
import { FaPumpSoap } from "react-icons/fa";
import { Shirt } from "lucide-react";
import trolleyIconUrl from "../../assets/bins.svg"; 

export const categories = [
  {
    id: "amenities",
    slug: "amenities",
    label: "Guest Amenities & Equipments",
    icon: "🧴",
    description: "Enhance your guests' experience with our high-quality, thoughtfully curated amenities...",
    image: "https://neomhotelsupplies.com/wp-content/uploads/2025/04/360_F_645496777_ssrbr9xzfOqAJ7lXSQ0ncPHZp0XsusFe.jpg",
  },
  {
    id: "linens",
    slug: "bed-and-bath-linens",
    label: "Bed & Bath Linens",
    icon: "🛏️",
    description: "Indulge your guests with our premium bed and bath linens...",
    image: "https://neomhotelsupplies.com/wp-content/uploads/2025/04/Bed-linens-by-icon-linens-1.jpg",
  },


{
  id: "chemicals",
  slug: "chemicals-and-accessories",
  label: "Laundry Chemicals & Accessories",
  icon: <FaPumpSoap color="#E63946" size={22} />, // 🔴 change color here
  description: "Ensure spotless results with our high-quality laundry chemicals and accessories...",
  image: "https://neomhotelsupplies.com/wp-content/uploads/2025/04/Effective-industrial-cleaning-ma.jpg",
},

    {
    id: "eco-bags",
    slug: "eco-friendly-reusable-bags",
    label: "Eco-Friendly Sustainable Bags",
    icon: "♻️",
    description: "Sustainable and durable, our eco-friendly reusable bags offer a practical solution...",
    image: "https://neomhotelsupplies.com/wp-content/uploads/2025/04/FB_shutterstock_195527888-1.jpg",
  },
   {
    id: "non-woven",
    slug: "non-woven-bags-and-covers",
    label: "Non Woven Bags & Covers",
    icon: "🛍️",
    description: "Indulge your guests with our premium non-woven bags and covers...",
    image: "https://neomhotelsupplies.com/wp-content/uploads/2025/04/51RisLFyUjL._AC_UF10001000_QL80.jpg",
  },

 {
    id: "ppe",
    slug: "disposable-ppe",
    label: "Non Woven Disposable Essentials PPE",
    icon: (
      <Shirt
        className="w-6 h-6"
        style={{
          fill: "#2563eb",
          stroke: "#2563eb",
        }}
      />
    ),
    description:
      "Protect your staff and guests with our range of disposable personal protective equipment...",
    image: "",
  },


  {
    id: "promotions",
    slug: "promotional-giveaways",
    label: "Corporate Gifts & Giveaways",
    icon: "🎁",
    description: "Make a lasting impression with our customized promotional giveaways...",
    image: "https://neomhotelsupplies.com/wp-content/uploads/2025/04/promotional-products-samples-108.jpg",
  },

   {
    id: "cleaning",
    slug: "cleaning-tools-and-equipment",
    label: "Cleaaning Equipments & Accessories",
    icon: "🧹",
    description: "Equip your team with our professional-grade cleaning tools and equipment...",
    image: "https://neomhotelsupplies.com/wp-content/uploads/2025/04/home-cleaning-set-ai-technology-.webp",
  },

{
    id: "bins",
    slug: "trolleys-and-bins",
    label: "Bins & Trolleys",
    icon: <img src={trolleyIconUrl} alt="trolley" style={{ width: 35, height: 35 }} />,
    description: "Keep your operations smooth and efficient with our durable trolleys...",
    image: "https://neomhotelsupplies.com/wp-content/uploads/2025/04/istockphoto-1373252677-612x612-1.jpg",
},
     {
    id: "fuel",
    slug: "chafing-fuel-and-charcoal",
    label: "Chafing Fuel & Charcoals",
    icon: "🔥",
    description: "Keep food warm and ready to serve with our reliable chafing fuel...",
    image: "https://neomhotelsupplies.com/wp-content/uploads/2025/04/black-charcoal-powder-facial-mas.jpg",
  },



 
  
  
];