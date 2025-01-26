import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConsoleService {
  constructor() {
    this.disableLogs();
  }

  disableLogs(): void {
    // Disable console.log
    console.log = () => {};
    // Disable console.warn
    console.warn = () => {};
    // (Optionally) disable other methods
    // console.error = () => {};
    // console.info = () => {};
    // console.debug = () => {};
  }
}
