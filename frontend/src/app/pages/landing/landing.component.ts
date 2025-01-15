import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { FeaturesComponent } from '../../shared/components/features/features.component';
import { CtaComponent } from '../../shared/components/cta/cta.component';
import { PricingComponent } from '../../shared/components/pricing/pricing.component';
import { FaqComponent } from '../../shared/components/faq/faq.component';
import { TestimonialComponent } from '../../shared/components/testimonial/testimonial.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    FeaturesComponent,
    CtaComponent,
    PricingComponent,
    FaqComponent,
    TestimonialComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
