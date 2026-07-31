import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="container" style="max-width: 900px; margin: 0 auto;">
      <h2>Angular Practice Demos</h2>
      <p style="color: #666; margin-bottom: 24px;">
        All Angular learning projects consolidated into one app
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;">
        <a routerLink="/crud" class="card" style="display: block; cursor: pointer;">
          <h3 style="color: #4f46e5; margin-bottom: 8px;">CRUD Demo</h3>
          <p style="color: #666; font-size: 14px;">
            User, customer, and associate management with NgRx-style state
          </p>
          <span class="btn" style="margin-top: 12px; display: inline-block;">Open</span>
        </a>

        <a routerLink="/blog" class="card" style="display: block; cursor: pointer;">
          <h3 style="color: #4f46e5; margin-bottom: 8px;">Blog Demo</h3>
          <p style="color: #666; font-size: 14px;">
            Blog listing with categories, routing, and post details
          </p>
          <span class="btn" style="margin-top: 12px; display: inline-block;">Open</span>
        </a>

        <a routerLink="/contact" class="card" style="display: block; cursor: pointer;">
          <h3 style="color: #4f46e5; margin-bottom: 8px;">Contact Demo</h3>
          <p style="color: #666; font-size: 14px;">
            Email/contact form with Semantic UI-style form controls
          </p>
          <span class="btn" style="margin-top: 12px; display: inline-block;">Open</span>
        </a>
      </div>
    </div>
  `,
})
export class HomeComponent {}
