import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AIChatBox from '../Ui/AiChatbox'; 
import { productImages } from "./productImages";
import { folder2Images } from "./Folder2";
import { folder3Images } from "./Folder3";
import { folder9Images } from "./Folder9";
import { folder8Images } from "./Folder8";
import { folder4Images } from "./Folder4";
import { folder5Images } from "./Folder5";
import { folder7Images } from "./Folder7";
import { folder6Images } from "./Folder6";
import { folder10Images } from "./Folder10";
import { faShirt } from '@fortawesome/free-solid-svg-icons';
import trolleyIconUrl from "../../assets/bins.svg"; 

export const categories = [
  { id: "amenities", label: "Guest Amenities & Equipments", icon: "🧴" },
  { id: "linens", label: "Bed & Bath Linens", icon: "🛏️" },
  { id: "chemicals", label: "Laundry Chemicals & Accessories", icon: "🫧" },
  { id: "eco-bags", label: "Eco-Friendly Sustainable Bags", icon: "♻️" },
  { id: "non-woven", label: "Non Woven Bags & Covers", icon: "🛍️" },
 { id: "ppe", label: "Non woven Disposable Essentials PPE", icon: <FontAwesomeIcon icon={faShirt} className="w-4 h-4 md:w-5 md:h-5 block text-sky-500 group-hover:text-white" /> },
  { id: "promotions", label: "Corporate Gifts & Giveaways", icon: "🎁" },
  { id: "cleaning", label: "Cleaning Equipments & Accessories", icon: "🧹" },
  {
  id: "bins",
  label: "Bins & Trolleys",
  icon: <img src={trolleyIconUrl} alt="trolley" style={{ width: 30, height: 30 }} />,
  },
  { id: "fuel", label: "Chafing Fuel & Charcoals", icon: "🔥" },
];

export const allProducts = [
  ...productImages,
  ...folder2Images,
  ...folder3Images,
  ...folder9Images,
  ...folder8Images,
  ...folder4Images,
  ...folder5Images,
  ...folder7Images,
  ...folder6Images,
  ...folder10Images,
];

const CategoryButton = ({ category, isSelected, onClick, isMobile = false }) => {
  const baseClasses = isMobile
    ? "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-2 whitespace-nowrap"
    : "w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center group";

  const selectedClasses = isMobile
    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
    : "bg-indigo-50 text-indigo-700 font-medium";

  const unselectedClasses = isMobile
    ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
    : "text-slate-700 hover:bg-slate-900 hover:text-white transition-colors duration-200";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
      aria-current={isSelected ? "page" : undefined}
    >
      {category?.icon && <span>{category.icon}</span>}
      <span>{category?.label || "All Products"}</span>
      {!isMobile && isSelected && (
        <span className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full" />
      )}
    </button>
  );
};

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [fastMovingIds, setFastMovingIds] = useState([]);

  const searchRef = useRef(null);

  const handleWhatsAppClick = (product) => {
    const phoneNumber = "971527087748";
    const message = `Hi, I am interested in getting a quote for: ${product.name}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    setFastMovingIds(prev => {
      const filtered = prev.filter(id => id !== product.id);
      return [product.id, ...filtered];
    });
  };

  const scrollToSearch = useCallback((behavior = 'smooth') => {
    if (searchRef.current) {
      searchRef.current.scrollIntoView({ 
        behavior: behavior, 
        block: 'start' 
      });
    }
  }, []);

  useEffect(() => {
    if (categoryFromUrl && searchRef.current) {
      setTimeout(() => {
        scrollToSearch('instant');
      }, 100);
    }
  }, [categoryFromUrl, scrollToSearch]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesCategory = selectedCategory
        ? p.category?.toLowerCase() === selectedCategory.toLowerCase()
        : true;
      const matchesSearch = searchQuery
        ? p.name?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    const fastIndexMap = new Map();
    fastMovingIds.forEach((id, idx) => {
      fastIndexMap.set(id, idx);
    });

    const fastProducts = [];
    const otherProducts = [];

    for (const product of filteredProducts) {
      if (fastIndexMap.has(product.id)) {
        fastProducts.push(product);
      } else {
        otherProducts.push(product);
      }
    }

    fastProducts.sort((a, b) => fastIndexMap.get(a.id) - fastIndexMap.get(b.id));

    return [...fastProducts, ...otherProducts];
  }, [filteredProducts, fastMovingIds]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const clearSearch = () => setSearchQuery("");

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
    
    scrollToSearch('smooth');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3" aria-label="Product categories">
            <div className="sticky top-24 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pr-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3 sticky top-5 bg-slate-50 py-2 z-10">
                Categories
              </h3>
              <CategoryButton
                category={{ icon: "📦", label: "All Products" }}
                isSelected={!selectedCategory}
                onClick={() => handleCategorySelect(null)}
              />
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onClick={() => handleCategorySelect(category.id)}
                />
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">

            {/* Search Section */}
            <div ref={searchRef} className="mb-8 scroll-mt-20">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Product Search</h1>
              <p className="text-slate-500 mt-13 mb-4">Find the perfect items for your business needs.</p>

              <div className="relative">
                <label htmlFor="search" className="sr-only">Search by product name</label>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by product name..."
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 hover:border-blue-300 transition-all text-slate-700 placeholder-slate-400"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filter Bar */}
            <div className="lg:hidden mb-6 overflow-x-auto overflow-y-hidden pb-2 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                <CategoryButton
                  category={{ icon: "📦", label: "All" }}
                  isSelected={!selectedCategory}
                  onClick={() => handleCategorySelect(null)}
                  isMobile
                />
                {categories.map((category) => (
                  <CategoryButton
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory === category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    isMobile
                  />
                ))}
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {selectedCategory
                  ? categories.find(c => c.id === selectedCategory)?.label
                  : "All Products"}
              </h2>
              <span className="text-sm text-slate-500">{sortedProducts.length} items</span>
            </div>

            {/* Product Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col relative"
                  >
                    <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400?text=Image+not+found';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
                      
                      {fastMovingIds.includes(product.id) && (
                        <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                          <span>🔥</span> Fast Moving
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-white text-lg font-semibold tracking-tight leading-tight drop-shadow-lg">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                      <button 
                        onClick={() => handleWhatsAppClick(product)}
                        className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-500 active:scale-[0.98] transition-all duration-200 shadow-sm group-hover:shadow-md flex items-center justify-center gap-2"
                      >
                        <svg 
                          className="h-4 w-4" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.15-.67.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.134.298-.347.447-.52.149-.174.198-.297.298-.495.099-.198.05-.371-.025-.52-.075-.149-.67-1.614-.918-2.21-.242-.579-.487-.5-.67-.51-.173-.01-.371-.01-.57-.01-.198 0-.52.074-.792.371-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        </svg>
                        Get a Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-slate-800">No products found</h3>
                <p className="text-slate-500 mt-1">Try adjusting your search or filter.</p>
                <button
                  onClick={() => handleCategorySelect(null)}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View All Products
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* AI Chat Box - placed at the bottom right */}
      <AIChatBox products={allProducts} categoriesList={categories} />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default Product;