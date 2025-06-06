import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { NgClass, NgFor, NgIf, SlicePipe, DatePipe } from '@angular/common';
import { AllEntriesResponse, DiaryEntry } from '../../../models/entry-data.model';
import { DayViewComponent } from './day-view/day-view.component';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, DatePipe, DayViewComponent],
  templateUrl: './calendar-grid.component.html',
})
export class CalendarGridComponent implements OnInit {
  @Input() month!: number; // 0-11
  @Input() year!: number;
  @Input() entries?: AllEntriesResponse | null;

  calendar: (Date | null)[][] = [];
  yourEntriesByDate: { [dateKey: string]: DiaryEntry } = {};
  partnerEntriesByDate: { [dateKey: string]: DiaryEntry } = {};
  hoveredDay: number = -1;

  //hooks and lifecycle
  ngOnInit() {
    this.generateCalendar(this.year, this.month);
    this.indexEntriesByDate();
  }

  ngOnChanges(changes: any) {
    if (changes['entries']) {
      this.indexEntriesByDate();
      this.generateCalendar(this.year, this.month);
    }
    if (changes['month'] || changes['year']) {
      this.generateCalendar(this.year, this.month);
    }

  }
  //base functions
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

  //modal
  selectedDate: Date | null = null;
  selectedYourEntry: DiaryEntry | null = null;
  selectedPartnerEntry: DiaryEntry | null = null;

  openDayView(day: Date | null) {
    if (!day) return;

    this.selectedDate = day;
    this.selectedYourEntry = this.getYourEntryForDate(day);
    this.selectedPartnerEntry = this.getPartnerEntryForDate(day);
  }

  //setters
  setMonth(value: number) {
    this.month = value;
    this.generateCalendar(this.year, this.month);
    if (value > 11) {
      this.year++;
      this.month = 0;
    } else if (value < 0) {
      this.year--;
      this.month = 11;
    }
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

  get monthDate(): Date {
    return new Date(this.year, this.month, 1);
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
