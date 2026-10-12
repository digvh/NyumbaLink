// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Home,
  Building2,
  LandPlot,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Users,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Play,
  PlusCircle,
  Utensils,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import ListingCard from '@/components/listing/ListingCard';
import CitySlider from '@/components/slider/CitySlider';
import { mockListings, getFeaturedListings } from '@/data/mockListings';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [stats, setStats] = useState({ properties: 0, users: 0, cities: 0 });

  // Animated counters
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev: { properties: number; users: number; cities: number }) => ({
        properties: prev.properties < 5000 ? prev.properties + 50 : 5000,
        users: prev.users < 10000 ? prev.users + 100 : 10000,
        cities: prev.cities < 50 ? prev.cities + 1 : 50,
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', label: 'All Properties', icon: Home, color: 'from-indigo-500 to-purple-500' },
    { id: 'HOTEL', label: 'Hotels', icon: Building2, color: 'from-blue-500 to-cyan-500' },
    { id: 'LODGE', label: 'Lodges', icon: Building2, color: 'from-green-500 to-emerald-500' },
    { id: 'SELF_CONTAINED_ROOM', label: 'Self-Contained', icon: Home, color: 'from-purple-500 to-pink-500' },
    { id: 'BAR', label: 'Bars', icon: Utensils, color: 'from-rose-500 to-pink-500' },
    { id: 'RESTAURANT', label: 'Restaurants', icon: Utensils, color: 'from-orange-500 to-amber-500' },
    { id: 'LAND', label: 'Land for Sale', icon: LandPlot, color: 'from-amber-500 to-orange-500' },
  ];

  const featuredListings = getFeaturedListings().slice(0, 6);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="blob w-96 h-96 bg-indigo-400 top-20 -left-20" />
      <div className="blob w-96 h-96 bg-purple-400 top-40 right-0" style={{ animationDelay: '2s' }} />
      <div className="blob w-96 h-96 bg-pink-400 bottom-20 left-1/3" style={{ animationDelay: '4s' }} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-lg mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                #1 Property Platform in Tanzania
              </span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Find Your</span>
              <br />
              <span className="gradient-text">Perfect Home</span>
              <br />
              <span className="text-gray-900 dark:text-white">in Tanzania</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10">
              Discover rooms, apartments, lodges, and land near you with real-time location search
            </p>

            {/* Glassmorphic Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <div className="glass-card !p-2 flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center px-4">
                  <MapPin className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter location, area, or landmark..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(e.target.value)
                    }
                    className="w-full py-3 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
                <Link href={`/search?q=${searchQuery}`}>
                  <GlassButton
                    variant="gradient"
                    size="md"
                    icon={<Search className="w-5 h-5" />}
                    className="md:px-8"
                  >
                    Search
                  </GlassButton>
                </Link>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto"
            >
              {[
                { label: 'Properties', value: stats.properties.toLocaleString() + '+', icon: Home },
                { label: 'Happy Users', value: stats.users.toLocaleString() + '+', icon: Users },
                { label: 'Cities', value: stats.cities + '+', icon: MapPin },
              ].map((stat, i) => (
                <GlassCard key={i} padding="sm" className="text-center">
                  <stat.icon className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                </GlassCard>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* City-Based Slider */}
      <section className="relative py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Top Picks in <span className="gradient-text">Your City</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Curated selection of the best hotels, lodges, rooms, and land near you
            </p>
          </motion.div>

          <CitySlider />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Browse by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find exactly what you're looking for with our curated categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className="w-full group"
                >
                  <GlassCard padding="md" className="text-center h-full cursor-pointer" hover>
                    <div
                      className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {category.label}
                    </span>
                  </GlassCard>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                Featured <span className="gradient-text">Listings</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Handpicked properties for you
              </p>
            </div>
            <Link href="/search">
              <GlassButton variant="glass" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                View All
              </GlassButton>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Why Choose <span className="gradient-text">NyumbaLink</span>?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              We're revolutionizing property search in Tanzania with cutting-edge technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Verified Listings',
                description: 'Every property is verified to ensure authenticity',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: Zap,
                title: 'Real-Time Search',
                description: 'Find properties near you with GPS-powered search',
                gradient: 'from-yellow-500 to-orange-500',
              },
              {
                icon: Star,
                title: 'Trusted Reviews',
                description: 'Real reviews from verified tenants and guests',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: TrendingUp,
                title: 'Direct Owner Contact',
                description: 'No brokers, no markups, just direct deals',
                gradient: 'from-purple-500 to-pink-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard padding="lg" className="h-full text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Search',
                description: 'Enter your location and browse properties near you',
                icon: Search,
              },
              {
                step: '02',
                title: 'Explore',
                description: 'View photos, floor plans, and 360° virtual tours',
                icon: Play,
              },
              {
                step: '03',
                title: 'Connect',
                description: 'Contact owners directly via WhatsApp or phone',
                icon: CheckCircle2,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <GlassCard padding="lg" className="text-center">
                  <div className="text-6xl font-bold gradient-text mb-4 opacity-50">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard
              padding="lg"
              className="relative overflow-hidden text-center !bg-gradient-to-br !from-indigo-500/90 !via-purple-500/90 !to-pink-500/90"
            >
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  Ready to List Your Property?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of property owners on NyumbaLink and reach millions of potential tenants
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/list-property">
                    <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/30 hover:-translate-y-1 inline-flex items-center gap-2">
                      <PlusCircle className="w-5 h-5" />
                      List Property Free
                    </button>
                  </Link>
                  <Link href="/search">
                    <button className="bg-white/20 backdrop-blur-xl text-white px-8 py-4 rounded-2xl font-bold border-2 border-white/30 hover:bg-white/30 transition-all duration-300 inline-flex items-center gap-2">
                      Browse Properties
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}