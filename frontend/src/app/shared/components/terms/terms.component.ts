import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css',
})
export class TermsComponent {
  email = 'syncnap.info@gmail.com';
}
