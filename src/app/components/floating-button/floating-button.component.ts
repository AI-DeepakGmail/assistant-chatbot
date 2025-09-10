import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss'],
    standalone: false,
})
export class FloatingButtonComponent {
  @Output() toggle = new EventEmitter<void>();
  toggleChat() {
    this.toggle.emit();
  }
}
