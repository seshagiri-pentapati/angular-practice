import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav>
      <a routerLink="/" style="background: #1f2937">Home</a>
      <a routerLink="/crud">CRUD Demo</a>
      <a routerLink="/blog">Blog Demo</a>
      <a routerLink="/contact">Contact Demo</a>
    </nav>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
