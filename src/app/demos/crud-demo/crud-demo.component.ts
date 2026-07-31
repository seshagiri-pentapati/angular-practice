import { Component } from '@angular/core';

interface User {
  id: number; name: string; email: string; role: string;
}

interface Customer {
  id: number; name: string; phone: string; city: string;
}

interface Associate {
  id: number; name: string; skill: string; experience: number;
}

@Component({
  selector: 'app-crud-demo',
  template: `
    <div class="container" style="max-width: 900px; margin: 0 auto;">
      <a routerLink="/" style="display: inline-block; margin-bottom: 20px; font-size: 14px;">&larr; Back to home</a>
      <h2>CRUD Demo (NgRx-style State)</h2>
      <p style="color: #666; margin-bottom: 20px;">
        User, Customer, and Associate management with NgRx-style state management patterns
      </p>

      <div style="display: flex; gap: 12px; margin-bottom: 20px;">
        <button class="btn" [class.btn-sm]="activeTab !== 'users'" (click)="activeTab='users'">Users</button>
        <button class="btn" [class.btn-sm]="activeTab !== 'customers'" (click)="activeTab='customers'">Customers</button>
        <button class="btn" [class.btn-sm]="activeTab !== 'associates'" (click)="activeTab='associates'">Associates</button>
      </div>

      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0; font-size: 18px; text-transform: capitalize;">{{activeTab}}</h3>
          <button class="btn" (click)="showForm = !showForm; editingUser = null">
            {{showForm ? 'Cancel' : 'Add ' + activeTab.slice(0,-1)}}
          </button>
        </div>

        <div *ngIf="showForm" style="margin-bottom: 20px; padding: 16px; background: #f9fafb; border-radius: 8px;">
          <h4 style="margin-bottom: 12px;">{{editingUser ? 'Edit' : 'Add New'}} {{activeTab.slice(0,-1)}}</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div><label>Name</label><input [(ngModel)]="formName" placeholder="Name" /></div>
            <div *ngIf="activeTab === 'users'"><label>Email</label><input [(ngModel)]="formEmail" placeholder="Email" /></div>
            <div *ngIf="activeTab === 'users'"><label>Role</label><input [(ngModel)]="formRole" placeholder="Role" /></div>
            <div *ngIf="activeTab === 'customers'"><label>Phone</label><input [(ngModel)]="formPhone" placeholder="Phone" /></div>
            <div *ngIf="activeTab === 'customers'"><label>City</label><input [(ngModel)]="formCity" placeholder="City" /></div>
            <div *ngIf="activeTab === 'associates'"><label>Skill</label><input [(ngModel)]="formSkill" placeholder="Skill" /></div>
            <div *ngIf="activeTab === 'associates'"><label>Experience (years)</label><input type="number" [(ngModel)]="formExperience" placeholder="Experience" /></div>
          </div>
          <button class="btn" (click)="save()" style="margin-top: 12px;">{{editingUser ? 'Update' : 'Save'}}</button>
        </div>

        <table>
          <thead><tr>
            <th>ID</th><th>Name</th>
            <th *ngIf="activeTab === 'users'">Email</th><th *ngIf="activeTab === 'users'">Role</th>
            <th *ngIf="activeTab === 'customers'">Phone</th><th *ngIf="activeTab === 'customers'">City</th>
            <th *ngIf="activeTab === 'associates'">Skill</th><th *ngIf="activeTab === 'associates'">Experience</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            <tr *ngFor="let item of getActiveList()">
              <td>{{item.id}}</td><td>{{item.name}}</td>
              <td *ngIf="activeTab === 'users'">{{(item as any).email}}</td>
              <td *ngIf="activeTab === 'users'">{{(item as any).role}}</td>
              <td *ngIf="activeTab === 'customers'">{{(item as any).phone}}</td>
              <td *ngIf="activeTab === 'customers'">{{(item as any).city}}</td>
              <td *ngIf="activeTab === 'associates'">{{(item as any).skill}}</td>
              <td *ngIf="activeTab === 'associates'">{{(item as any).experience}}</td>
              <td>
                <button class="btn btn-sm" (click)="edit(item)" style="margin-right: 4px;">Edit</button>
                <button class="btn btn-sm btn-danger" (click)="remove(item.id)">Del</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class CrudDemoComponent {
  activeTab = 'users';
  showForm = false;
  editingUser: any = null;
  formName = ''; formEmail = ''; formRole = ''; formPhone = ''; formCity = ''; formSkill = ''; formExperience = 0;

  users: User[] = [
    { id: 1, name: 'Alice Smith', email: 'alice@test.com', role: 'Admin' },
    { id: 2, name: 'Bob Jones', email: 'bob@test.com', role: 'User' },
  ];
  customers: Customer[] = [
    { id: 1, name: 'Acme Corp', phone: '555-0100', city: 'New York' },
  ];
  associates: Associate[] = [
    { id: 1, name: 'John Doe', skill: 'Angular', experience: 5 },
  ];

  nextId: Record<string, number> = { users: 3, customers: 2, associates: 2 };

  getActiveList(): any[] {
    return this[this.activeTab as keyof this] as any;
  }

  save() {
    const list = this.getActiveList();
    if (this.editingUser) {
      const idx = list.findIndex(i => i.id === this.editingUser.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], name: this.formName, email: this.formEmail, role: this.formRole, phone: this.formPhone, city: this.formCity, skill: this.formSkill, experience: this.formExperience };
      }
    } else {
      list.push({ id: this.nextId[this.activeTab]++, name: this.formName, email: this.formEmail, role: this.formRole, phone: this.formPhone, city: this.formCity, skill: this.formSkill, experience: this.formExperience });
    }
    this.showForm = false; this.editingUser = null; this.resetForm();
  }

  edit(item: any) {
    this.editingUser = item;
    this.formName = item.name; this.formEmail = item.email || ''; this.formRole = item.role || '';
    this.formPhone = item.phone || ''; this.formCity = item.city || ''; this.formSkill = item.skill || ''; this.formExperience = item.experience || 0;
    this.showForm = true;
  }

  remove(id: number) {
    const key = this.activeTab as keyof this;
    (this as any)[key] = (this as any)[key].filter((i: any) => i.id !== id);
  }

  resetForm() { this.formName = ''; this.formEmail = ''; this.formRole = ''; this.formPhone = ''; this.formCity = ''; this.formSkill = ''; this.formExperience = 0; }
}
