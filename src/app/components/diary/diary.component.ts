import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css'],
  imports: [NgIf, NgFor]
})
export class DiaryComponent implements OnInit {

  allEntries: any = [] ;  // Class property to hold the data

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAllEntries().subscribe({
      next: (response) => {console.log('Data:', response); this.allEntries = response;},
      error: (err) => console.error('Error:', err)
    });}

  logout(): void {
    this.authService.logout();
  }
}
