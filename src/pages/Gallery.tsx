import { useState, useEffect } from 'react';
import { Filter as FilterIcon, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Filter from '../components/gallery/Filter';
import { getProducts } from '../services/productService';

const Gallery = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="bg-cream min-h-screen">
            {/* Header */}
            <div className="bg-navy text-white py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Collections</h1>
                    <p className="text-gray-300">Discover our exquisite range of handcrafted jewelry.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <button
                        className="lg:hidden flex items-center gap-2 text-navy font-bold"
                        onClick={() => setIsFilterOpen(true)}
                    >
                        <FilterIcon size={20} /> Filters
                    </button>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search for jewelry..."
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">Sort by:</span>
                        <select className="border-none bg-transparent font-bold text-navy focus:ring-0 cursor-pointer">
                            <option>Newest First</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Popularity</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filter */}
                    <Filter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        {...product}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                <p>No products found.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-12 flex justify-center gap-2">
                            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-navy transition-colors">1</button>
                            <button className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center">2</button>
                            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-navy transition-colors">3</button>
                            <span className="flex items-end px-2">...</span>
                            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-navy transition-colors">12</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gallery;
