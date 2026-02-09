import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  priceLabel: string;
  highlighted: boolean;
  buttonLabel: string;
  buttonSeverity: 'primary' | 'secondary';
  features: string[];
}

@Component({
  selector: 'app-pricing',
  imports: [
    RouterLink,
    DecimalPipe,
    ButtonModule,
    TagModule,
    DividerModule,
    ToggleSwitchModule,
    FormsModule,
  ],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingComponent {
  readonly isYearly = signal(false);
  isYearlyValue = false;

  readonly tiers: PricingTier[] = [
    {
      name: 'Free',
      description: 'Perfect for trying out Eventorg with small personal events.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      priceLabel: 'Free forever',
      highlighted: false,
      buttonLabel: 'Get Started',
      buttonSeverity: 'secondary',
      features: [
        'Up to 2 events',
        '50 attendees per event',
        'Discussion boards',
        'Basic event management',
        '1 team member',
        'Community support',
      ],
    },
    {
      name: 'Starter',
      description: 'For small teams organizing regular events.',
      monthlyPrice: 9,
      yearlyPrice: 7,
      priceLabel: '/month',
      highlighted: false,
      buttonLabel: 'Start Free Trial',
      buttonSeverity: 'secondary',
      features: [
        'Up to 10 events',
        '200 attendees per event',
        'Real-time chat',
        'Discussion boards',
        'Basic financial tracking',
        'Basic analytics',
        '3 team members',
        'Email support',
      ],
    },
    {
      name: 'Pro',
      description: 'For professional organizers and growing teams.',
      monthlyPrice: 29,
      yearlyPrice: 24,
      priceLabel: '/month',
      highlighted: true,
      buttonLabel: 'Start Free Trial',
      buttonSeverity: 'primary',
      features: [
        'Unlimited events',
        '1,000 attendees per event',
        'Real-time chat',
        'Discussion boards',
        'Advanced financial tracking',
        'Sponsor management',
        'Custom branding',
        'Advanced analytics',
        '10 team members',
        'Priority support',
      ],
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom needs.',
      monthlyPrice: null,
      yearlyPrice: null,
      priceLabel: 'Custom pricing',
      highlighted: false,
      buttonLabel: 'Contact Sales',
      buttonSeverity: 'secondary',
      features: [
        'Everything in Pro',
        'Unlimited attendees',
        'Unlimited team members',
        'API access',
        'Advanced reports & export',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'SSO / SAML',
        'On-premise option',
      ],
    },
  ];

  getPrice(tier: PricingTier): string {
    if (tier.monthlyPrice === null) return '';
    if (tier.monthlyPrice === 0) return '$0';
    return this.isYearly() ? `$${tier.yearlyPrice}` : `$${tier.monthlyPrice}`;
  }

  toggleBilling(): void {
    this.isYearlyValue = !this.isYearlyValue;
    this.isYearly.set(this.isYearlyValue);
  }
}
