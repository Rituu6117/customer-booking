export type BookingStatus = 
  | 'Pending'
  | 'Accepted'
  | 'In Progress'
  | 'Ready for Delivery'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected';

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  googleMapsUrl: string;
  fetchedAt?: string;
}

export interface Mechanic {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  avatar: string;
  isAvailable: boolean;
  rating?: number;
}

export interface Booking {
  id: string; // e.g. PREM-8492
  createdAt: string;
  updatedAt: string;
  
  // Customer Details
  customerName: string;
  mobileNumber: string;
  email?: string;
  
  // Vehicle Details
  bikeNumber: string;
  bikeBrand: string;
  bikeModel: string;
  
  // Service Details
  serviceType: string;
  pickupRequired: boolean;
  preferredDate: string;
  preferredTime: string;
  address: string;
  problemDescription: string;
  bikePhotoUrl?: string;
  
  // Location
  location?: GPSLocation;
  
  // Owner & Processing Details
  status: BookingStatus;
  assignedMechanicId?: string;
  assignedMechanicName?: string;
  estimatedCost?: number;
  ownerNotes?: string;
  estimatedCompletionTime?: string;
  
  // Custom metadata
  whatsappSent?: boolean;
}

export interface ServiceCatalogItem {
  id: string;
  name: string;
  description: string;
  estimatedPrice: string;
  duration: string;
  badge?: string;
}

export interface ShopSettings {
  shopName: string;
  ownerPhone: string; // e.g., "919876543210" for WhatsApp
  shopAddress: string;
  workingHours: string;
  autoOpenWhatsapp: boolean;
}
