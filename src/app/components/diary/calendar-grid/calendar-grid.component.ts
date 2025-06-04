import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { DiaryComponent } from '../diary.component';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './calendar-grid.component.html',
})
export class CalendarGridComponent implements OnInit {
  @Input() month!: number; // 0-11
  @Input() year!: number;
  @Input() entries!: any[];

  calendar: (Date | null)[][] = [];

  ngOnInit() {
    this.generateCalendar(this.year, this.month);
  }

  generateCalendar(year: number, month: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const calendar: (Date | null)[][] = [];

    let currentWeek: (Date | null)[] = [];
    let dayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Fill initial empty cells
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Fill dates
    for (let day = 1; day <= lastDay.getDate(); day++) {
      currentWeek.push(new Date(year, month, day));

      if (currentWeek.length === 7) {
        calendar.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill remaining cells
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      calendar.push(currentWeek);
    }

    this.calendar = calendar;
  }
}
