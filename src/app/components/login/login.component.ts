import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule]
})
export class LoginComponent {
    email = '';
    password = '';

    constructor(private authService: AuthService, private router: Router) {}

    handleLogin(): void {
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          const token = response.token;
          if (token) {
            localStorage.setItem('authToken', token);
            console.log('Login successful. Token stored:', token);
            this.router.navigate(['/diary']);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
        },
      });
    }

  handleRegister(): void {
    this.authService.register(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
      },
      error: (error) => {
        console.error('Registration error:', error);
      }
    });
  }
}
