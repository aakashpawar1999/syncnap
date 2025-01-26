import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { SeoService } from '../../shared/services/seo.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeaderComponent, HeroComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.setMetaData();
  }

  setMetaData() {
    this.seoService.setMetaTags([{ name: 'robots', content: 'index, follow' }]);
    this.seoService.setTitle('SyncNap');
    this.seoService.setDescription(
      'Simplify your workflows by connecting Supabase with Airtable in just a few clicks. Sync tables seamlessly and stay in control of your data.',
    );
    this.seoService.setMetaTags([
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'SyncNap' },
      {
        name: 'twitter:description',
        content:
          'Simplify your workflows by connecting Supabase with Airtable in just a few clicks. Sync tables seamlessly and stay in control of your data.',
      },
      // {
      //   name: 'twitter:image',
      //   content:
      //     'https://',
      // },
    ]);
    this.seoService.setMetaPropertyTags([
      { property: 'og:title', content: 'SyncNap' },
      {
        property: 'og:description',
        content:
          'Simplify your workflows by connecting Supabase with Airtable in just a few clicks. Sync tables seamlessly and stay in control of your data.',
      },
      // {
      //   property: 'og:image',
      //   content:
      //     'https://',
      // },
      { property: 'og:url', content: 'https://syncnap.com' },
    ]);
    this.seoService.setCanonicalURL('https://syncnap.com');
  }
}
