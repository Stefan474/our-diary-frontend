import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgIf, NgFor } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css'],
  imports: [NgIf, NgFor, DatePipe, FormsModule]
})
export class DiaryComponent implements OnInit {

  allEntries: any = [] ;  // Class property to hold the data
  user: any;
  partnerEmail: string= '';
  message: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAllEntries().subscribe({
      next: (response) => {console.log('Data:', response); this.allEntries = response;},
      error: (err) => console.error('Error:', err)
    });
    this.getUser();

}

  ngAfterViewInit(): void {

    if (!this.user.partnerEmail) {
      this.message = "Enter your partner's email to connect!"
    }
    else {
    this.message = "Waiting for partner's response! Once you are connected press the comfirm button below to begin!"
    }
  }

  ngOnChanges(): void {
    console.log('ngOnChanges() called');
    this.authService.getAllEntries().subscribe({
      next: (response) => {console.log('Data:', response); this.allEntries = response;},
      error: (err) => console.error('Error:', err)
    });

  }

  logout(): void {
    this.authService.logout();
  }

  responseData: any = null;
  errorData: any = null;
  decodedToken: any = null;
  tokenExpiration: string = 'Not available';

  getUser(): void {
    console.log('Testing getUser()...');
    console.log('Current token:', this.authService.getToken());

    this.authService.getUser().subscribe(
      (response) => {
        console.log('getUser() response:', response);
        this.responseData = response;
        this.errorData = null;
        localStorage.setItem('user', JSON.stringify(response));
        console.log('User stored:', localStorage.getItem('user'));
        this.user = response;
      },
      (error) => {
        console.error('getUser() error:', error);
        this.errorData = {
          status: error.status,
          message: error.message,
          error: error.error
        };
        this.responseData = null;

        // If we get a 401, check if the token is actually invalid or expired
        if (error.status === 401) {
          console.log('401 Unauthorized - Token might be invalid or expired');
          console.log('Token exists:', !!this.authService.getToken());
          console.log('Is token expired according to client:', this.authService.isTokenExpired());
        }
      }
    );
  }

  handleConnect(): void {
    this.authService.connectPartner(this.partnerEmail).subscribe({
      next: (response) => {
        console.log('partner request sent:', response);
        this.getUser();
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.message = error.error;
      }
    });
  }

  handleConfirm(): void {
    this.getUser();
    if (!this.user.isConnected) {
      this.message = "Your partner did not accept yet! Please connect to your partner before confirming!"
    }
  }

  addEntry: boolean = false;
  handleWriteEntry(): void {
    this.addEntry = true;
  }

  entryMessage: string = '';
  handleEntryPost(): void {;
    this.authService.addPost(this.entryMessage).subscribe({
      next: (response) => {
        console.log('Entry posted:', response);
      },
      error: (error) => {
        console.error('Entry post error:', error);
      }
    });
    this.addEntry = false;
  }
}
