import { Component } from '@angular/core';

interface BlogPost {
  id: number; title: string; category: string; excerpt: string; date: string; author: string;
}

@Component({
  selector: 'app-blog-demo',
  template: `
    <div class="container" style="max-width: 900px; margin: 0 auto;">
      <a routerLink="/" style="display: inline-block; margin-bottom: 20px; font-size: 14px;">&larr; Back to home</a>
      <h2>Blog Demo</h2>
      <p style="color: #666; margin-bottom: 20px;">
        Blog listing with categories and post details (Angular Router demo)
      </p>

      <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
        <button class="btn" [class.btn-sm]="activeCategory !== 'all'" (click)="activeCategory='all'">All</button>
        <button class="btn btn-sm" *ngFor="let cat of categories" (click)="activeCategory=cat">{{cat}}</button>
      </div>

      <div *ngIf="selectedPost; else listView" class="card">
        <button class="btn btn-sm" (click)="selectedPost = null" style="margin-bottom: 12px;">&larr; Back to list</button>
        <h3 style="font-size: 22px; margin-bottom: 8px;">{{selectedPost.title}}</h3>
        <div style="font-size: 13px; color: #888; margin-bottom: 12px;">
          {{selectedPost.category}} &middot; {{selectedPost.date}} &middot; {{selectedPost.author}}
        </div>
        <p style="line-height: 1.7;">{{selectedPost.excerpt}}</p>
        <p style="line-height: 1.7; margin-top: 12px; color: #666;">
          This is the full blog post content. In a real app, this would be fetched from a server
          based on the route parameter. Angular Router makes it easy to navigate between posts
          using routerLink and route parameters.
        </p>
      </div>

      <ng-template #listView>
        <div style="display: grid; gap: 16px;">
          <div class="card" *ngFor="let post of filteredPosts" style="cursor: pointer;" (click)="selectedPost = post">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <h3 style="font-size: 18px; color: #4f46e5;">{{post.title}}</h3>
              <span style="background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; font-size: 12px;">{{post.category}}</span>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 8px;">{{post.excerpt}}</p>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 8px;">{{post.date}} &middot; {{post.author}}</div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
})
export class BlogDemoComponent {
  activeCategory = 'all';
  selectedPost: BlogPost | null = null;

  categories = ['Angular', 'TypeScript', 'RxJS'];

  posts: BlogPost[] = [
    { id: 1, title: 'Getting Started with Angular Signals', category: 'Angular', excerpt: 'Signals are a new reactive primitive in Angular that provide fine-grained reactivity...', date: '2024-03-15', author: 'Jane Dev' },
    { id: 2, title: 'Understanding TypeScript Generics', category: 'TypeScript', excerpt: 'Generics allow creating reusable components that work with multiple types rather than a single one...', date: '2024-03-10', author: 'Jane Dev' },
    { id: 3, title: 'RxJS Operators You Should Know', category: 'RxJS', excerpt: 'Learn the most useful RxJS operators for handling async data streams in Angular...', date: '2024-03-05', author: 'Bob Code' },
    { id: 4, title: 'Angular 17 Features Overview', category: 'Angular', excerpt: 'Angular 17 brings new control flow syntax, deferred loading, signals, and more...', date: '2024-02-28', author: 'Jane Dev' },
    { id: 5, title: 'TypeScript Decorators Explained', category: 'TypeScript', excerpt: 'Decorators are a special kind of declaration that can be attached to classes, methods, properties...', date: '2024-02-20', author: 'Bob Code' },
  ];

  get filteredPosts(): BlogPost[] {
    return this.activeCategory === 'all' ? this.posts : this.posts.filter(p => p.category === this.activeCategory);
  }
}
