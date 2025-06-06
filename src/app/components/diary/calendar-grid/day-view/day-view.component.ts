import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DiaryEntry } from '../../../../models/entry-data.model';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [NgIf, DatePipe],
  templateUrl: './day-view.component.html',
})
export class DayViewComponent {
  @Input() date!: Date;
  @Input() yourEntry: DiaryEntry | null = null;
  @Input() partnerEntry: DiaryEntry | null = null;

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
