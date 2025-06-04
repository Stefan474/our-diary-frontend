import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { AllEntriesResponse, DiaryEntry } from '../../../models/entry-data.model';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [NgFor, NgIf, SlicePipe, NgClass],
  templateUrl: './calendar-grid.component.html',
})
export class CalendarGridComponent implements OnInit {
  @Input() month!: number; // 0-11
  @Input() year!: number;
  @Input() entries?: AllEntriesResponse | null;

  calendar: (Date | null)[][] = [];
  yourEntriesByDate: { [dateKey: string]: DiaryEntry } = {};
  partnerEntriesByDate: { [dateKey: string]: DiaryEntry } = {};

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

    // fill initial empty cells
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push(null);
    }

    // fill dates
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

    this.yourEntriesByDate = {};
    this.partnerEntriesByDate = {};

    //  your entries by date
    this.entries.yourEntries.forEach(entry => {
      const dateKey = this.formatDateKey(new Date(entry.date));
      this.yourEntriesByDate[dateKey] = entry;
    });

    //  partner entries by date
    this.entries.partnerEntries.forEach(entry => {
      const dateKey = this.formatDateKey(new Date(entry.date));
      this.partnerEntriesByDate[dateKey] = entry;
    });
  }

  formatDateKey(date: Date): string {
    // Format: YYYY-MM-DD
    return date.toISOString().split('T')[0];
  }

  // get your entry for a specific date
  getYourEntryForDate(date: Date | null): DiaryEntry | null {
    if (!date) return null;
    const dateKey = this.formatDateKey(date);
    return this.yourEntriesByDate[dateKey] || null;
  }

  // get partner entry for a specific date
  getPartnerEntryForDate(date: Date | null): DiaryEntry | null {
    if (!date) return null;
    const dateKey = this.formatDateKey(date);
    return this.partnerEntriesByDate[dateKey] || null;
  }

  // check if you have an entry for a specific date
  hasYourEntryForDate(date: Date | null): boolean {
    return this.getYourEntryForDate(date) !== null;
  }

  // check if partner has an entry for a specific date
  hasPartnerEntryForDate(date: Date | null): boolean {
    return this.getPartnerEntryForDate(date) !== null;
  }

  // check if either you or partner has an entry for a specific date
  hasAnyEntryForDate(date: Date | null): boolean {
    return this.hasYourEntryForDate(date) || this.hasPartnerEntryForDate(date);
  }

  // check if both you and partner have entries for a specific date
  hasBothEntriesForDate(date: Date | null): boolean {
    return this.hasYourEntryForDate(date) && this.hasPartnerEntryForDate(date);
  }

  // old method for backward compatibility to make sure the site doesn't break lol
  getEntryForDate(date: Date | null): DiaryEntry | null {
    return this.getYourEntryForDate(date) || this.getPartnerEntryForDate(date);
  }

  // old method for backwards comp
  hasEntryForDate(date: Date | null): boolean {
    return this.hasAnyEntryForDate(date);
  }
}
