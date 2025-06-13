import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { NgClass, NgFor, NgIf, DatePipe } from '@angular/common';
import { AllEntriesResponse, DiaryEntry } from '../../../models/entry-data.model';
import { DayViewComponent } from './day-view/day-view.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, DatePipe, DayViewComponent],
  templateUrl: './calendar-grid.component.html',
  animations: [
    trigger('slideLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100px) scale(0.95)', filter: 'blur(2px)' }),
        animate('450ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)' })
        ),
      ])
    ]),
    trigger('slideRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100px) scale(0.95)', filter: 'blur(2px)' }),
        animate('450ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)' })
        ),
      ])
    ])
  ]
})
export class CalendarGridComponent implements OnInit, OnChanges {
  @Input() month!: number; // 0-11
  @Input() year!: number;
  @Input() entries?: AllEntriesResponse | null;

  calendar: (Date | null)[][] = [];
  yourEntriesByDate: Record<string, DiaryEntry> = {};
  partnerEntriesByDate: Record<string, DiaryEntry> = {};
  hoveredDay = -1;

  // modal
  selectedDate: Date | null = null;
  selectedYourEntry: DiaryEntry | null = null;
  selectedPartnerEntry: DiaryEntry | null = null;

  // animation
  slideDirection: 'left' | 'right' = 'left';
  showCalendar = true;

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

  private generateCalendar(year: number, month: number) {
    // how many days in this UTC-month:
    const daysInUTCmonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

    // what weekday does the 1st fall on (local)?
    const firstLocal = new Date(year, month, 1);
    const startDow = firstLocal.getDay(); // 0=Sun .. 6=Sat

    const cal: (Date | null)[][] = [];
    let week: (Date | null)[] = [];

    // leading blanks
    for (let i = 0; i < startDow; i++) {
      week.push(null);
    }

    // fill each day as a UTC-constructed Date
    for (let d = 1; d <= daysInUTCmonth; d++) {
      week.push(new Date(Date.UTC(year, month, d)));
      if (week.length === 7) {
        cal.push(week);
        week = [];
      }
    }
    // trailing blanks
    if (week.length) {
      while (week.length < 7) {
        week.push(null);
      }
      cal.push(week);
    }

    this.calendar = cal;
  }

  openDayView(day: Date | null) {
    if (!day) return;
    this.selectedDate = day;
    this.selectedYourEntry = this.getYourEntryForDate(day);
    this.selectedPartnerEntry = this.getPartnerEntryForDate(day);
  }

  setMonth(newMonth: number) {
    let m = newMonth, y = this.year;
    const forward = newMonth > this.month || (newMonth === 0 && this.month === 11);

    if (m < 0) { m = 11; y--; }
    else if (m > 11) { m = 0; y++; }

    this.slideDirection = forward ? 'left' : 'right';
    this.showCalendar = false;

    setTimeout(() => {
      this.month = m;
      this.year = y;
      this.generateCalendar(y, m);
      this.showCalendar = true;
    }, 50);
  }

  private indexEntriesByDate() {
    if (!this.entries) return;
    this.yourEntriesByDate = {};
    this.partnerEntriesByDate = {};

    for (const e of this.entries.yourEntries) {
      const d = new Date(e.date);              // parsed as UTC
      this.yourEntriesByDate[this.formatDateKey(d)] = e;
    }
    for (const e of this.entries.partnerEntries) {
      const d = new Date(e.date);
      this.partnerEntriesByDate[this.formatDateKey(d)] = e;
    }
  }

  /** YYYY-MM-DD using UTC getters only */
  private formatDateKey(date: Date): string {
    const Y = date.getUTCFullYear();
    const M = String(date.getUTCMonth() + 1).padStart(2, '0');
    const D = String(date.getUTCDate()).padStart(2, '0');
    return `${Y}-${M}-${D}`;
  }

  private getYourEntryForDate(date: Date | null) {
    if (!date) return null;
    return this.yourEntriesByDate[this.formatDateKey(date)] || null;
  }
  private getPartnerEntryForDate(date: Date | null) {
    if (!date) return null;
    return this.partnerEntriesByDate[this.formatDateKey(date)] || null;
  }

  hasYourEntryForDate(date: Date | null): boolean {
    return !!this.getYourEntryForDate(date);
  }
  hasPartnerEntryForDate(date: Date | null): boolean {
    return !!this.getPartnerEntryForDate(date);
  }
  hasAnyEntryForDate(date: Date | null): boolean {
    return this.hasYourEntryForDate(date) || this.hasPartnerEntryForDate(date);
  }
  hasBothEntriesForDate(date: Date | null): boolean {
    return this.hasYourEntryForDate(date) && this.hasPartnerEntryForDate(date);
  }

  // backwards-compat
  getEntryForDate(date: Date | null) {
    return this.getYourEntryForDate(date) || this.getPartnerEntryForDate(date);
  }
  hasEntryForDate(date: Date | null) {
    return this.hasAnyEntryForDate(date);
  }

  /** still use local for the display header */
  get monthDate(): Date {
    return new Date(this.year, this.month, 1);
  }
}
