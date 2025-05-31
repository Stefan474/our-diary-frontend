## Our-Diary Frontend

This is the Angular frontend for the Our-Diary project, a shared calendar/diary app built to demonstrate CRUD operations, user authentication, and reactive data handling using Angular. The backend is powered by .NET Core 8 Web API, while the frontend leverages Angular for a modular, component-driven architecture.

### Tech Stack
- **Angular** - Frontend framework
- **RxJS** - Reactive programming
- **Angular Router** - Client-side routing
- **Angular Guards** - Route protection
- **Angular Interceptors** - HTTP request/response handling
- **Tailwind CSS** - Styling
  
### Features
- **User Authentication:** Login and session management via JWT
- **Diary Entry Management:** Create and read data entries (update delete left out on purpose) 
- **Reactive Data Handling:** RxJS Observables for state management
- **HTTP Interceptor:** Automatic JWT attachment to outgoing HTTP requests
- **Route Guards:** Protect routes based on authentication state

### Project Screenshots
<img src="https://i.imgur.com/nSPiqEM.png" alt="Image 1" width="700"/>
<img src="https://i.imgur.com/OAVy8H2.png" alt="Image 2" width="700"/>
<img src="https://i.imgur.com/yqQzB4z.png" alt="Image 3" width="700"/>
<img src="https://i.imgur.com/ASoxhxq.png" alt="Image 4" width="700"/>
<img src="https://i.imgur.com/ExohBvg.png" alt="Image 5" width="700"/>

### Next Steps
- Implement data caching using BehaviorSubject
- Add user profile management
- Enhance error handling and user feedback

For any questions or feedback, feel free to reach out!
