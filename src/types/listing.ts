// src/types/listing.ts

export type ListingCategory =
  | 'HOTEL'
  | 'LODGE'
  | 'SELF_CONTAINED_ROOM'
  | 'RESTAURANT'
  | 'BAR'
  | 'LAND';

export type PriceType = 'PER_NIGHT' | 'PER_MONTH' | 'SALE';
export type ViewType = 'SEA' | 'MOUNTAIN' | 'CITY' | 'GARDEN' | 'STREET' | 'NONE';
export type ListingStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REJECTED';
export type PhotoType = 'EXTERIOR' | 'INTERIOR' | 'ROOM' | 'PANORAMA' | 'LAND' | 'OTHER';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  priceType: PriceType;
  priceTzs: number;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  region: string;
  city?: string;
  floorLevel?: number;
  totalFloors?: number;
  hasElevator: boolean;
  viewType: ViewType;
  amenities: Record<string, boolean>;
  status: ListingStatus;
  viewsCount: number;
  featured: boolean;
  isVerified: boolean;
  ownerId: string;
  owner?: {
    fullName: string;
    verificationStatus: string;
    phoneNumber: string;
  };
  photos?: ListingPhoto[];
  primaryPhoto?: string;
  distanceMeters?: number;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListingPhoto {
  id: string;
  listingId: string;
  photoUrl: string;
  photoType: PhotoType;
  isPrimary: boolean;
  isPanorama: boolean;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    fullName: string;
    avatarUrl?: string;
  };
}

export interface ListingFilters {
  category?: ListingCategory;
  minPrice?: number;
  maxPrice?: number;
  priceType?: PriceType;
  district?: string;
  region?: string;
  viewType?: ViewType;
  hasElevator?: boolean;
  sortBy?: 'distance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
}