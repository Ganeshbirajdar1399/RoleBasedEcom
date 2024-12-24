import { Component } from '@angular/core';
import { DummyService } from '../../core/services/dummy.service';

@Component({
  selector: 'app-user-dashboard',
  imports: [],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent {
  constructor(private dummyService: DummyService) {}
  logout(): void {
    this.dummyService.logout();
  }
}
