import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '@services/health-service';
import { NotificationService } from '@services/notification-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  standalone: true,
  imports: [CommonModule],
})
export class NavbarComponent {
  public healthService = inject(HealthService);
  public notificationService = inject(NotificationService);

  public status = this.healthService.systemHealth.value;
  public toasts = this.notificationService.toasts;
}
