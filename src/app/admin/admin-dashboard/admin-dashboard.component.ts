import { Component } from '@angular/core';
import { DummyService } from '../../core/services/dummy.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  constructor(private dummyService: DummyService) {}

  logout(): void {
    this.dummyService.logout();
  }
}
