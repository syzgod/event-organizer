import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();

  readonly productLinks = [
    { label: 'Features', route: '/', fragment: 'features' },
    { label: 'Pricing', route: '/pricing' },
    { label: 'How It Works', route: '/', fragment: 'how-it-works' },
  ];

  readonly companyLinks = [
    { label: 'About Us', route: '/' },
    { label: 'Careers', route: '/' },
    { label: 'Blog', route: '/' },
    { label: 'Contact', route: '/' },
  ];

  readonly legalLinks = [
    { label: 'Privacy Policy', route: '/' },
    { label: 'Terms of Service', route: '/' },
    { label: 'Cookie Policy', route: '/' },
  ];
}
