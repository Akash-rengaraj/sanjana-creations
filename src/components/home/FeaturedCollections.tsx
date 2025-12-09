
import { useRef, useEffect, useState } from 'react';
import ProductCard from '../ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts } from '../../services/productService';

const FeaturedCollections = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data: any = await getProducts();
                // Duplicate for infinite scroll effect
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        fetchProducts();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 320; // Card width + gap
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    // Auto-scroll effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollContainerRef.current && !scrollContainerRef.current.matches(':hover')) {
                const { current } = scrollContainerRef;
                if (current.scrollLeft + current.clientWidth >= current.scrollWidth - 10) {
                    current.scrollTo({ left: 0, behavior: 'auto' }); // Reset instantly
                } else {
                    current.scrollBy({ left: 1, behavior: 'auto' }); // Slow drift
                }
            }
        }, 1000000); // Slowed down from 30ms to 50ms

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-20 bg-cream overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy mb-2">Featured Collections</h2>
                        <p className="text-gray-600">New Arrivals & Best Sellers</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full border border-navy text-navy hover:bg-navy hover:text-gold transition-colors z-10 bg-white"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full border border-navy text-navy hover:bg-navy hover:text-gold transition-colors z-10 bg-white"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {products.length > 0 ? (
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar hover:cursor-grab active:cursor-grabbing"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {products.map((product, index) => (
                            <div key={`${product.id}-${index}`} className="min-w-[280px] md:min-w-[320px] snap-start transform transition-transform hover:scale-105 duration-300">
                                <ProductCard {...product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>No products available at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedCollections;
