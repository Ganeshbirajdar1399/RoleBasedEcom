import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-animated-popup',
  imports: [CommonModule],
  templateUrl: './animated-popup.component.html',
  styleUrl: './animated-popup.component.css'
})
export class AnimatedPopupComponent {
  @Input() show: boolean = false;
  @Output() closePopup = new EventEmitter<void>();

  close() {
    this.closePopup.emit();
  }
}
