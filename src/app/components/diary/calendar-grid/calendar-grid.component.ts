import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { NgClass, NgFor, NgIf, SlicePipe, DatePipe } from '@angular/common';
import { AllEntriesResponse, DiaryEntry } from '../../../models/entry-data.model';
import { DayViewComponent } from './day-view/day-view.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, DatePipe, DayViewComponent],
  templateUrl: './calendar-grid.component.html',
  animations: [
    trigger('calendarSwitch', [
      transition('* => *', [
        style({
          opacity: 0,
          transform: 'translateX(30px) scale(0.95)',
          filter: 'blur(2px)'
        }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({
            opacity: 1,
            transform: 'translateX(0) scale(1)',
            filter: 'blur(0px)'
          })
        ),
      ])
    ])
  ]
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
    this.currentMonthKey = `${this.year}-${this.month}`;
  }

  ngOnChanges(changes: any) {
    if (changes['entries']) {
      this.indexEntriesByDate();
      this.generateCalendar(this.year, this.month);
    }
    if (changes['month'] || changes['year']) {
      this.generateCalendar(this.year, this.month);
      this.currentMonthKey = `${this.year}-${this.month}`;
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


  //aniamation stuff
  currentMonthKey: string = '';

  //setters

  setMonth(newMonth: number) {
    let tempMonth = newMonth;
    let tempYear = this.year;

    if (tempMonth > 11) {
      tempMonth = 0;
      tempYear++;
    } else if (tempMonth < 0) {
      tempMonth = 11;
      tempYear--;
    }

    this.month = tempMonth;
    this.year = tempYear;

    this.currentMonthKey = `${tempYear}-${tempMonth}`;

    this.generateCalendar(this.year, this.month);
  }


  generateCalendarData(year: number, month: number): (Date | null)[][] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const calendar: (Date | null)[][] = [];

    let currentWeek: (Date | null)[] = [];
    let dayOfWeek = firstDay.getDay(); // 0 = Sunday

    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      currentWeek.push(new Date(year, month, day));
      if (currentWeek.length === 7) {
        calendar.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      calendar.push(currentWeek);
    }

    return calendar;
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
