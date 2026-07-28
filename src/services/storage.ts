import { Booking, Mechanic, ShopSettings } from '../types';
import { SAMPLE_BOOKINGS, INITIAL_MECHANICS, DEFAULT_SHOP_SETTINGS } from '../data/initialData';

const BOOKINGS_STORAGE_KEY = 'prem_auto_bookings_v1';
const MECHANICS_STORAGE_KEY = 'prem_auto_mechanics_v1';
const SETTINGS_STORAGE_KEY = 'prem_auto_settings_v1';

class StorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (!localStorage.getItem(BOOKINGS_STORAGE_KEY)) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(SAMPLE_BOOKINGS));
    }
    if (!localStorage.getItem(MECHANICS_STORAGE_KEY)) {
      localStorage.setItem(MECHANICS_STORAGE_KEY, JSON.stringify(INITIAL_MECHANICS));
    }
    if (!localStorage.getItem(SETTINGS_STORAGE_KEY)) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SHOP_SETTINGS));
    }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  // --- BOOKINGS ---
  public getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return data ? JSON.parse(data) : SAMPLE_BOOKINGS;
    } catch {
      return SAMPLE_BOOKINGS;
    }
  }

  public getBookingById(id: string): Booking | undefined {
    return this.getBookings().find((b) => b.id.toLowerCase() === id.toLowerCase());
  }

  public saveBooking(booking: Booking): Booking {
    const bookings = this.getBookings();
    const existingIndex = bookings.findIndex((b) => b.id === booking.id);

    let updatedList: Booking[];
    if (existingIndex >= 0) {
      updatedList = [...bookings];
      updatedList[existingIndex] = {
        ...booking,
        updatedAt: new Date().toISOString(),
      };
    } else {
      updatedList = [booking, ...bookings];
    }

    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedList));
    this.notify();
    return booking;
  }

  public deleteBooking(id: string) {
    const bookings = this.getBookings().filter((b) => b.id !== id);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    this.notify();
  }

  public generateBookingId(): string {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `PREM-${randomDigits}`;
  }

  // --- MECHANICS ---
  public getMechanics(): Mechanic[] {
    try {
      const data = localStorage.getItem(MECHANICS_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_MECHANICS;
    } catch {
      return INITIAL_MECHANICS;
    }
  }

  public saveMechanic(mechanic: Mechanic) {
    const list = this.getMechanics();
    const idx = list.findIndex((m) => m.id === mechanic.id);
    let updated: Mechanic[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = mechanic;
    } else {
      updated = [...list, mechanic];
    }
    localStorage.setItem(MECHANICS_STORAGE_KEY, JSON.stringify(updated));
    this.notify();
  }

  // --- SHOP SETTINGS ---
  public getSettings(): ShopSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_SHOP_SETTINGS;
    } catch {
      return DEFAULT_SHOP_SETTINGS;
    }
  }

  public saveSettings(settings: ShopSettings) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    this.notify();
  }

  public resetToSampleData() {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(SAMPLE_BOOKINGS));
    localStorage.setItem(MECHANICS_STORAGE_KEY, JSON.stringify(INITIAL_MECHANICS));
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SHOP_SETTINGS));
    this.notify();
  }
}

export const storage = new StorageService();
