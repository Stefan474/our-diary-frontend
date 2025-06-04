import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { AllEntriesResponse, DiaryEntry } from '../../../models/entry-data.model';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [NgFor, NgIf, SlicePipe],
  templateUrl: './calendar-grid.component.html',
})
export class CalendarGridComponent implements OnInit {
  @Input() month!: number; // 0-11
  @Input() year!: number;
  @Input() entries?: AllEntriesResponse | null;

  calendar: (Date | null)[][] = [];
  entriesByDate: { [dateKey: string]: DiaryEntry } = {};

  ngOnInit() {
    this.generateCalendar(this.year, this.month);
    this.indexEntriesByDate();
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

  indexEntriesByDate() {
    if (!this.entries) return;

    this.entriesByDate = {};

    // Index your entries by date
    this.entries.yourEntries.forEach(entry => {
      const dateKey = this.formatDateKey(new Date(entry.date));
      this.entriesByDate[dateKey] = entry;
    });

    // If you also want to show partner entries, you can combine them
    // or create a separate method to distinguish them
    this.entries.partnerEntries.forEach(entry => {
      const dateKey = this.formatDateKey(new Date(entry.date));
      // You might want to handle conflicts if both you and partner have entries on same date
      if (!this.entriesByDate[dateKey]) {
        this.entriesByDate[dateKey] = entry;
      }
    });
  }

  formatDateKey(date: Date): string {
    // Format: YYYY-MM-DD
    return date.toISOString().split('T')[0];
  }

  getEntryForDate(date: Date | null): DiaryEntry | null {
    if (!date) return null;
    const dateKey = this.formatDateKey(date);
    return this.entriesByDate[dateKey] || null;
  }

  hasEntryForDate(date: Date | null): boolean {
    return this.getEntryForDate(date) !== null;
  }
}
