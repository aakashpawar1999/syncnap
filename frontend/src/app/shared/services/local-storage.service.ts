import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isLocalStorageAvailable(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  setItem(key: string, value: any): void {
    if (this.isLocalStorageAvailable()) {
      try {
        const valueSerialized = JSON.stringify(value);
        localStorage.setItem(key, valueSerialized);
      } catch (e) {
        console.error('Error saving to localStorage', e);
      }
    }
  }

  getItem(key: string): any {
    if (this.isLocalStorageAvailable()) {
      try {
        const valueSerialized = localStorage.getItem(key);
        return valueSerialized ? JSON.parse(valueSerialized) : null;
      } catch (e) {
        console.error('Error getting data from localStorage', e);
        return null;
      }
    }
    return null;
  }
}
