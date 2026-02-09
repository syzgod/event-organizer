import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, ButtonModule, CardModule, DividerModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  readonly features = [
    {
      icon: 'pi pi-calendar',
      title: 'Event Management',
      description:
        'Create, schedule, and manage events end-to-end with powerful tools for every stage of your event lifecycle.',
    },
    {
      icon: 'pi pi-comments',
      title: 'Real-time Chat',
      description:
        'Instant messaging for event teams, sponsors, and attendees. Stay connected with real-time communication.',
    },
    {
      icon: 'pi pi-th-large',
      title: 'Discussion Boards',
      description:
        'Forum-style boards for each event and globally. Discuss ideas, share updates, and collaborate professionally.',
    },
    {
      icon: 'pi pi-chart-bar',
      title: 'Financial Tracking',
      description:
        'Track budgets, costs, and expected income. Generate reports and keep your event finances transparent.',
    },
    {
      icon: 'pi pi-handshake',
      title: 'Sponsor Management',
      description:
        'Manage sponsor agreements, track contributions, and give sponsors visibility into their events.',
    },
    {
      icon: 'pi pi-shield',
      title: 'Admin Dashboard',
      description:
        'Full platform oversight with user management, event moderation, subscription tracking, and analytics.',
    },
  ];

  readonly steps = [
    {
      number: '01',
      title: 'Create Your Event',
      description:
        'Set up your event with all the details — dates, venue, capacity, and budget in minutes.',
    },
    {
      number: '02',
      title: 'Invite & Collaborate',
      description:
        'Bring in your team, sponsors, and attendees. Use chat and boards to coordinate everything.',
    },
    {
      number: '03',
      title: 'Manage & Deliver',
      description:
        'Track finances, monitor engagement, and deliver a successful event with real-time insights.',
    },
  ];

  readonly stats = [
    { value: '10,000+', label: 'Events Organized' },
    { value: '50,000+', label: 'Active Users' },
    { value: '120+', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' },
  ];
}
