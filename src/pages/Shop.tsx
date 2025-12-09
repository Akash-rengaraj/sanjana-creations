import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, Truck, ShieldCheck, RotateCcw, Minus, Plus } from 'lucide-react';
import { gsap } from 'gsap';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { getProductById } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('Gold');
    const imageRef = useRef<HTMLImageElement>(null);
    const addToCart = useCartStore(state => state.addToCart);
    const navigate = useNavigate();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const data = await getProductById(Number(id));
                setProduct(data);
                if (data.image) {
                    // Ensure image is an array for the gallery
                    // If backend only stores one image string, wrap it
                    // Ideally backend should store array, but for now we adapt
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-xl text-gray-500">Product not found</p>
            </div>
        );
    }

    // Adapter for single image to array
    const productImages = product.images || [product.image];
    const productSizes = product.sizes || ['S', 'M', 'L', 'XL']; // Default if missing
    const productColors = product.colors || ['Gold', 'Silver']; // Default if missing

    const relatedProducts = [
        {
            id: '2',
            name: 'Antique Gold Plated Bangles',
            price: 1299,
            originalPrice: 1899,
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1887&auto=format&fit=crop',
            rating: 4.5,
            reviews: 89
        },
        {
            id: '3',
            name: 'Designer Pearl Drop Earrings',
            price: 899,
            originalPrice: 1299,
            image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=1887&auto=format&fit=crop',
            rating: 4.9,
            reviews: 210,
            isNew: true
        },
        {
            id: '4',
            name: 'Traditional Temple Choker',
            price: 3999,
            originalPrice: 5499,
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1887&auto=format&fit=crop',
            rating: 4.7,
            reviews: 156
        }
    ];

    const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        if (imageRef.current) {
            imageRef.current.style.transformOrigin = `${x * 100}% ${y * 100}%`;
            imageRef.current.style.transform = 'scale(1.5)';
        }
    };

    const handleImageLeave = () => {
        if (imageRef.current) {
            imageRef.current.style.transform = 'scale(1)';
        }
    };

    useEffect(() => {
        // Entrance animation
        gsap.from('.product-details > *', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }, [id]);

    return (
        <div className="bg-white min-h-screen py-10">
            <div className="container mx-auto px-4 md:px-6">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-8">
                    Home / Shop / {product.name}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div
                            className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
                            onMouseMove={handleImageHover}
                            onMouseLeave={handleImageLeave}
                        >
                            <img
                                ref={imageRef}
                                src={productImages[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-200"
                            />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {productImages.map((img: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 transition-colors ${selectedImage === index ? 'border-gold' : 'border-transparent'}`}
                                >
                                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-details">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl md:text-4xl font-heading font-bold text-navy">{product.name}</h1>
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                                <Heart size={24} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-gold">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">({product.reviews} Reviews)</span>
                            <span className="text-green-600 text-sm font-bold">In Stock</span>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-bold text-navy">₹{product.price.toLocaleString()}</span>
                                <span className="text-xl text-gray-400 line-through">₹{(product.originalPrice || product.price * 1.2).toLocaleString()}</span>
                                <span className="bg-orange/10 text-orange px-2 py-1 rounded text-sm font-bold">
                                    {Math.round((((product.originalPrice || product.price * 1.2) - product.price) / (product.originalPrice || product.price * 1.2)) * 100)}% OFF
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Price inclusive of all taxes</p>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Options */}
                        <div className="space-y-6 mb-8">
                            <div>
                                <span className="block font-bold text-navy mb-2">Size</span>
                                <div className="flex gap-3">
                                    {productSizes.map((size: string) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-10 h-10 rounded border flex items-center justify-center font-bold transition-all ${selectedSize === size ? 'bg-navy text-white border-navy' : 'border-gray-300 text-gray-600 hover:border-navy'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="block font-bold text-navy mb-2">Color</span>
                                <div className="flex gap-3">
                                    {productColors.map((color: string) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 py-2 rounded border flex items-center justify-center font-medium transition-all ${selectedColor === color ? 'bg-navy text-white border-navy' : 'border-gray-300 text-gray-600 hover:border-navy'}`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="block font-bold text-navy mb-2">Quantity</span>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-300 rounded">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center font-bold">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-8">
                            <Button
                                variant="primary"
                                size="lg"
                                className="flex-1"
                                onClick={() => {
                                    addToCart({
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        image: productImages[0],
                                        quantity: quantity,
                                        size: selectedSize,
                                        color: selectedColor
                                    });
                                    alert('Added to cart!');
                                }}
                            >
                                Add to Cart
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="flex-1"
                                onClick={() => {
                                    addToCart({
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        image: productImages[0],
                                        quantity: quantity,
                                        size: selectedSize,
                                        color: selectedColor
                                    });
                                    navigate('/cart');
                                }}
                            >
                                Buy Now
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Truck className="text-gold" size={20} />
                                <span>Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <ShieldCheck className="text-gold" size={20} />
                                <span>1 Year Warranty</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <RotateCcw className="text-gold" size={20} />
                                <span>30 Days Return</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-20">
                    <h2 className="text-2xl font-heading font-bold text-navy mb-8">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
