import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaChevronLeft, 
  FaChevronRight, 
  FaExternalLinkAlt, 
  FaTimes, 
  FaStar,
  FaInfoCircle,
  FaImages
} from 'react-icons/fa';
import { galleryService } from '../../services/gallery.service';

// Premium Gallery Detail Modal (Unchanged)
const GalleryDetailModal = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 bg-gradient-to-b from-black/50 to-transparent">
              <div className="flex items-center gap-3">
                {item.featured && (
                  <span className="inline-flex items-center gap-1 bg-yellow-500 text-white text-sm px-3 py-1 rounded-full">
                    <FaStar className="text-xs" /> Featured
                  </span>
                )}
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 h-[80vh]">
              {/* Media Display */}
              <div className="relative bg-black">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={item.url}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                      {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                )}
              </div>

              {/* Details Panel */}
              <div className="p-8 lg:p-12 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h2>
                    <p className="text-gray-600">{item.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="font-medium text-gray-900 capitalize">{item.category}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p className="font-medium text-gray-900 capitalize">{item.type}</p>
                    </div>
                    {item.dimensions && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Dimensions</p>
                        <p className="font-medium text-gray-900">
                          {item.dimensions.width} × {item.dimensions.height}
                        </p>
                      </div>
                    )}
                    {item.format && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Format</p>
                        <p className="font-medium text-gray-900 uppercase">{item.format}</p>
                      </div>
                    )}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <FaExternalLinkAlt />
                          Open Original
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

// Premium Image Gallery Slider Component
const ImageGallerySlider = () => {
  const [sliderItems, setSliderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Get slider items from API
  useEffect(() => {
    fetchSliderItems();
  }, []);

  // Video-aware autoplay system
  useEffect(() => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);

    const currentItem = sliderItems[activeIndex];
    
    if (!currentItem || !isPlaying || sliderItems.length <= 1) return;

    if (currentItem.type === 'video') {
      // For videos, we handle slide change via video events
      return;
    }

    // For images, use interval (5 seconds)
    intervalRef.current = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [activeIndex, isPlaying, sliderItems]);

  const fetchSliderItems = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getSliderItems();
      
      // REMOVED THE FILTER - Backend already returns showOnSlider=true items
      // JUST SORT the items: featured first, then by date
      const sortedItems = (response.data || []).sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setSliderItems(sortedItems);
    } catch (error) {
      console.error('Failed to load slider items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoEnded = useCallback(() => {
    goToNextSlide();
  }, []);

  const handleVideoPlay = useCallback(() => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  }, []);

  const goToNextSlide = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % sliderItems.length);
    setIsPlaying(true);
  }, [sliderItems.length]);

  const goToPrevSlide = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + sliderItems.length) % sliderItems.length);
    setIsPlaying(true);
  }, [sliderItems.length]);

  const goToSlide = useCallback((index) => {
    setActiveIndex(index);
    setIsPlaying(true);
  }, []);

  const handleDetailClick = useCallback((item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  }, []);

  // Get current active item
  const currentItem = sliderItems[activeIndex];

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-6xl h-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  // FIX: Show message when no slider items instead of returning null
  if (sliderItems.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-100 mb-6">
              <FaImages className="text-3xl text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Slider Items Configured
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              The admin hasn't added any media items to the homepage slider yet.
              Please check back later or contact the administrator.
            </p>
            <div className="text-sm text-gray-500">
              Admin Tip: Toggle "Show on Slider" ON for gallery items
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #000 2%, transparent 2%)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          {/* Main Slider */}
          <div className="relative max-w-8xl mx-auto">
            {/* Navigation Buttons */}
            <button
              onClick={goToPrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all"
            >
              <FaChevronLeft />
            </button>
            
            <button
              onClick={goToNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all"
            >
              <FaChevronRight />
            </button>

            {/* Auto-play Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-700 hover:bg-white"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            {/* Main Slider Container */}
            <div className="relative h-[500px] md:h-[500px] rounded-3xl overflow-hidden shadow-sm">
              <AnimatePresence mode="wait">
                {currentItem && (
                  <motion.div
                    key={currentItem._id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {/* Media Display */}
                    {currentItem.type === 'image' ? (
                      <img
                        src={currentItem.url}
                        alt={currentItem.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          ref={videoRef}
                          src={currentItem.url}
                          autoPlay
                          muted
                          loop={false}
                          onEnded={handleVideoEnded}
                          onPlay={handleVideoPlay}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                          {Math.floor(currentItem.duration / 60)}:{(currentItem.duration % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                    )}

                    {/* Conditional Overlay based on showDetailButton */}
                    {currentItem.showDetailButton ? (
                      <>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                          <div className="max-w-3xl">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {currentItem.featured && (
                                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm px-4 py-1.5 rounded-full">
                                  <FaStar className="text-xs" /> Featured
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full">
                                {currentItem.category}
                              </span>
                              {currentItem.type === 'video' && (
                                <span className="inline-flex items-center gap-1 bg-red-500/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full border border-red-500/30">
                                  Video
                                </span>
                              )}
                            </div>

                            {/* Title & Description */}
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                              {currentItem.title}
                            </h3>
                            <p className="text-lg text-white/90 mb-6 line-clamp-2">
                              {currentItem.description}
                            </p>

                            {/* Tags */}
                            {currentItem.tags && currentItem.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-6">
                                {currentItem.tags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block bg-white/10 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4">
                              <button
                                onClick={() => handleDetailClick(currentItem)}
                                className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative flex items-center gap-2 font-semibold">
                                  View Details
                                  <FaExternalLinkAlt className="text-sm" />
                                </span>
                              </button>
                              
                              <button
                                onClick={() => window.open(currentItem.url, '_blank')}
                                className="group px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                              >
                                <span className="flex items-center gap-2">
                                  Open Full Size
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Minimal UI when showDetailButton is false
                      <div className="absolute bottom-4 right-4">
                        {currentItem.showDetailButton === false && (
                          <button
                            onClick={() => handleDetailClick(currentItem)}
                            className="group w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                            title="Show Details"
                          >
                            <FaInfoCircle className="text-white text-lg" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Progress Bar - Only for images when playing */}
                    {currentItem.type === 'image' && isPlaying && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 5, ease: "linear" }}
                          key={`progress-${currentItem._id}`}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>           
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <GalleryDetailModal
        item={selectedItem}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </>
  );
};

export default ImageGallerySlider;