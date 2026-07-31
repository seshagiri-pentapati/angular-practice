import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-demo',
  template: `
    <div class="container" style="max-width: 600px; margin: 0 auto;">
      <a routerLink="/" style="display: inline-block; margin-bottom: 20px; font-size: 14px;">&larr; Back to home</a>
      <h2>Contact / Email Demo</h2>
      <p style="color: #666; margin-bottom: 20px;">
        Contact form with Semantic UI-style form controls. Email client functionality demo.
      </p>

      <div class="card">
        <h3 style="margin-bottom: 16px;">Send a Message</h3>
        <form (ngSubmit)="send()">
          <label>Your Name</label>
          <input [(ngModel)]="form.name" name="name" placeholder="Enter your name" required />

          <label>Email Address</label>
          <input type="email" [(ngModel)]="form.email" name="email" placeholder="your@email.com" required />

          <label>Subject</label>
          <select [(ngModel)]="form.subject" name="subject">
            <option value="">Select a subject...</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Support">Support</option>
            <option value="Feedback">Feedback</option>
            <option value="Partnership">Partnership</option>
          </select>

          <label>Message</label>
          <textarea rows="5" [(ngModel)]="form.message" name="message" placeholder="Write your message here..." required></textarea>

          <label>Priority</label>
          <div style="display: flex; gap: 16px; margin-bottom: 12px;">
            <label style="font-weight: 400; display: flex; align-items: center; gap: 4px;">
              <input type="radio" [(ngModel)]="form.priority" name="priority" value="low" /> Low
            </label>
            <label style="font-weight: 400; display: flex; align-items: center; gap: 4px;">
              <input type="radio" [(ngModel)]="form.priority" name="priority" value="normal" /> Normal
            </label>
            <label style="font-weight: 400; display: flex; align-items: center; gap: 4px;">
              <input type="radio" [(ngModel)]="form.priority" name="priority" value="high" /> High
            </label>
          </div>

          <button type="submit" class="btn" [disabled]="sent" style="width: 100%;">
            {{sent ? 'Message Sent!' : 'Send Message'}}
          </button>
        </form>
      </div>

      <div class="card" *ngIf="sent">
        <h3 style="color: #059669; margin-bottom: 8px;">Message Sent Successfully!</h3>
        <p style="font-size: 14px; color: #666;">
          <b>From:</b> {{form.name}} ({{form.email}})<br/>
          <b>Subject:</b> {{form.subject}}<br/>
          <b>Priority:</b> {{form.priority}}<br/>
          <b>Message:</b> {{form.message}}
        </p>
      </div>

      <div class="card">
        <h3 style="margin-bottom: 12px;">Recent Messages</h3>
        <div *ngFor="let msg of inbox" style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">
          <div style="display: flex; justify-content: space-between;">
            <b>{{msg.from}}</b>
            <span style="color: #9ca3af; font-size: 12px;">{{msg.date}}</span>
          </div>
          <div style="color: #4f46e5; font-size: 13px; margin: 2px 0;">{{msg.subject}}</div>
          <div style="color: #6b7280; font-size: 13px;">{{msg.preview}}</div>
        </div>
      </div>
    </div>
  `,
})
export class ContactDemoComponent {
  sent = false;

  form = { name: '', email: '', subject: '', message: '', priority: 'normal' };

  inbox = [
    { from: 'Support Team', subject: 'Welcome to Angular Practice', preview: 'Thank you for exploring the Angular practice demos...', date: 'Today' },
    { from: 'System Admin', subject: 'Your account is ready', preview: 'Your developer account has been created successfully...', date: 'Yesterday' },
    { from: 'Blog Updates', subject: 'New Angular 17 features', preview: 'Check out the latest Angular 17 features including signals...', date: '2 days ago' },
  ];

  send() {
    if (!this.form.name || !this.form.email || !this.form.message) return;
    this.sent = true;
  }
}
