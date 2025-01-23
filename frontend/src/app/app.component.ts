import { afterNextRender, Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { NgxLoadingBar } from '@ngx-loading-bar/core';
import { IStaticMethods } from 'preline/preline';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxLoadingBar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Frontend';

  constructor(private router: Router) {
    afterNextRender(() => {
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          setTimeout(() => {
            window.HSStaticMethods.autoInit();
          }, 100);
        }
      });
    });
  }
}
