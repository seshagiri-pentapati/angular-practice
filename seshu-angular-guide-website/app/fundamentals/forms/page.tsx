import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckSquare } from "lucide-react"

const formsQuestions = [
  {
    id: "template-vs-reactive",
    question: "What's the difference between template-driven and reactive forms?",
    answer: `<p>Angular provides two approaches for handling forms:</p>
    <ul>
      <li><strong>Template-driven forms:</strong>
        <ul>
          <li>Form logic defined in template using directives</li>
          <li>Uses NgModel for two-way data binding</li>
          <li>Suitable for simple forms</li>
          <li>Less control over validation timing</li>
        </ul>
      </li>
      <li><strong>Reactive forms:</strong>
        <ul>
          <li>Form logic defined in component using FormControl, FormGroup</li>
          <li>More predictable and testable</li>
          <li>Better for complex forms and dynamic validation</li>
          <li>Immutable data model</li>
        </ul>
      </li>
    </ul>`,
    difficulty: "Medium" as const,
    tags: ["forms", "template-driven", "reactive"],
  },
  {
    id: "form-validation",
    question: "How do you implement form validation in Angular?",
    answer: `<p>Angular provides multiple validation approaches:</p>
    <ul>
      <li><strong>Built-in validators:</strong> required, minLength, maxLength, pattern, email</li>
      <li><strong>Custom validators:</strong> Functions that return validation errors or null</li>
      <li><strong>Async validators:</strong> For server-side validation (returns Observable/Promise)</li>
      <li><strong>Cross-field validation:</strong> Validators that compare multiple fields</li>
    </ul>
    <p>Validation can be applied at FormControl level or FormGroup level for complex scenarios.</p>`,
    difficulty: "Medium" as const,
    tags: ["validation", "forms", "custom-validators"],
  },
  {
    id: "form-arrays",
    question: "What are FormArrays and when would you use them?",
    answer: `<p>FormArray is used to manage an array of FormControl, FormGroup, or other FormArray instances:</p>
    <ul>
      <li><strong>Dynamic forms:</strong> When you don't know the number of form controls at compile time</li>
      <li><strong>Repeating sections:</strong> Like adding multiple addresses, phone numbers, etc.</li>
      <li><strong>Methods:</strong> push(), insert(), removeAt(), clear(), at()</li>
      <li><strong>Validation:</strong> Can have validators applied to the entire array</li>
    </ul>
    <p>Example: Managing a list of skills where users can add/remove items dynamically.</p>`,
    difficulty: "Hard" as const,
    tags: ["form-arrays", "dynamic-forms", "reactive-forms"],
  },
]

export default function FormsPage() {
  return (
    <PageLayout
      title="Forms & Validation"
      description="Master Angular forms with template-driven and reactive approaches"
      badge="Fundamentals"
      previousPage={{ title: "Routing", href: "/fundamentals/routing" }}
      nextPage={{ title: "Intermediate Concepts", href: "/intermediate" }}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div>
          <h2>Angular Forms</h2>
          <p>
            Forms are essential for collecting user input in web applications. Angular provides two approaches:
            template-driven forms (using directives) and reactive forms (using form controls). Each has its strengths
            and is suitable for different scenarios.
          </p>
        </div>

        {/* Forms Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Template-Driven Forms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Form logic in template</li>
                <li>• Uses NgModel directive</li>
                <li>• Two-way data binding</li>
                <li>• Good for simple forms</li>
                <li>• Less code in component</li>
                <li>• Harder to test</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-primary" />
                Reactive Forms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Form logic in component</li>
                <li>• Uses FormControl, FormGroup</li>
                <li>• Immutable data model</li>
                <li>• Better for complex forms</li>
                <li>• More predictable</li>
                <li>• Easier to test</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Template-Driven Forms */}
        <div>
          <h2>Template-Driven Forms</h2>
          <p>
            Template-driven forms use directives in the template to create and manipulate the underlying object model.
            They're suitable for simple scenarios with basic validation requirements.
          </p>
        </div>

        <CodeExample
          title="Template-Driven Form Example"
          description="A complete user registration form using template-driven approach"
          filename="user-registration.component.ts"
          code={`import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  country: string;
  agreeToTerms: boolean;
}

@Component({
  selector: 'app-user-registration',
  template: \`
    <div class="registration-form">
      <h2>User Registration</h2>
      
      <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)" novalidate>
        <!-- First Name -->
        <div class="form-group">
          <label for="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            [(ngModel)]="user.firstName"
            #firstName="ngModel"
            required
            minlength="2"
            class="form-control"
            [class.is-invalid]="firstName.invalid && firstName.touched">
          
          <div *ngIf="firstName.invalid && firstName.touched" class="error-messages">
            <div *ngIf="firstName.errors?.['required']">First name is required</div>
            <div *ngIf="firstName.errors?.['minlength']">First name must be at least 2 characters</div>
          </div>
        </div>

        <!-- Last Name -->
        <div class="form-group">
          <label for="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            [(ngModel)]="user.lastName"
            #lastName="ngModel"
            required
            minlength="2"
            class="form-control"
            [class.is-invalid]="lastName.invalid && lastName.touched">
          
          <div *ngIf="lastName.invalid && lastName.touched" class="error-messages">
            <div *ngIf="lastName.errors?.['required']">Last name is required</div>
            <div *ngIf="lastName.errors?.['minlength']">Last name must be at least 2 characters</div>
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            [(ngModel)]="user.email"
            #email="ngModel"
            required
            email
            class="form-control"
            [class.is-invalid]="email.invalid && email.touched">
          
          <div *ngIf="email.invalid && email.touched" class="error-messages">
            <div *ngIf="email.errors?.['required']">Email is required</div>
            <div *ngIf="email.errors?.['email']">Please enter a valid email</div>
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="user.password"
            #password="ngModel"
            required
            minlength="8"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
            class="form-control"
            [class.is-invalid]="password.invalid && password.touched">
          
          <div *ngIf="password.invalid && password.touched" class="error-messages">
            <div *ngIf="password.errors?.['required']">Password is required</div>
            <div *ngIf="password.errors?.['minlength']">Password must be at least 8 characters</div>
            <div *ngIf="password.errors?.['pattern']">
              Password must contain uppercase, lowercase, number and special character
            </div>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword">Confirm Password *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            [(ngModel)]="user.confirmPassword"
            #confirmPassword="ngModel"
            required
            class="form-control"
            [class.is-invalid]="confirmPassword.invalid && confirmPassword.touched">
          
          <div *ngIf="confirmPassword.invalid && confirmPassword.touched" class="error-messages">
            <div *ngIf="confirmPassword.errors?.['required']">Please confirm your password</div>
          </div>
          
          <!-- Custom validation for password match -->
          <div *ngIf="password.value !== confirmPassword.value && confirmPassword.touched" 
               class="error-messages">
            <div>Passwords do not match</div>
          </div>
        </div>

        <!-- Age -->
        <div class="form-group">
          <label for="age">Age *</label>
          <input
            type="number"
            id="age"
            name="age"
            [(ngModel)]="user.age"
            #age="ngModel"
            required
            min="18"
            max="120"
            class="form-control"
            [class.is-invalid]="age.invalid && age.touched">
          
          <div *ngIf="age.invalid && age.touched" class="error-messages">
            <div *ngIf="age.errors?.['required']">Age is required</div>
            <div *ngIf="age.errors?.['min']">You must be at least 18 years old</div>
            <div *ngIf="age.errors?.['max']">Please enter a valid age</div>
          </div>
        </div>

        <!-- Country -->
        <div class="form-group">
          <label for="country">Country *</label>
          <select
            id="country"
            name="country"
            [(ngModel)]="user.country"
            #country="ngModel"
            required
            class="form-control"
            [class.is-invalid]="country.invalid && country.touched">
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="in">India</option>
          </select>
          
          <div *ngIf="country.invalid && country.touched" class="error-messages">
            <div *ngIf="country.errors?.['required']">Please select a country</div>
          </div>
        </div>

        <!-- Terms Agreement -->
        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              name="agreeToTerms"
              [(ngModel)]="user.agreeToTerms"
              #agreeToTerms="ngModel"
              required>
            I agree to the Terms and Conditions *
          </label>
          
          <div *ngIf="agreeToTerms.invalid && agreeToTerms.touched" class="error-messages">
            <div *ngIf="agreeToTerms.errors?.['required']">You must agree to the terms</div>
          </div>
        </div>

        <!-- Form Status Display -->
        <div class="form-status">
          <p>Form Status: {{ userForm.valid ? 'Valid' : 'Invalid' }}</p>
          <p>Form Touched: {{ userForm.touched ? 'Yes' : 'No' }}</p>
          <p>Form Dirty: {{ userForm.dirty ? 'Yes' : 'No' }}</p>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn-primary"
            [disabled]="userForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Registering...' : 'Register' }}
          </button>
          
          <button
            type="button"
            class="btn-secondary"
            (click)="resetForm(userForm)">
            Reset
          </button>
        </div>
      </form>

      <!-- Debug Information -->
      <div class="debug-info" *ngIf="showDebug">
        <h3>Debug Information</h3>
        <pre>{{ userForm.value | json }}</pre>
        <pre>Form Errors: {{ getFormErrors(userForm) | json }}</pre>
      </div>
    </div>
  \`,
  styles: [\`
    .registration-form { max-width: 600px; margin: 0 auto; padding: 20px; }
    .form-group { margin-bottom: 20px; }
    .form-control { 
      width: 100%; 
      padding: 10px; 
      border: 1px solid #ddd; 
      border-radius: 4px; 
      font-size: 14px;
    }
    .form-control.is-invalid { border-color: #dc3545; }
    .error-messages { color: #dc3545; font-size: 12px; margin-top: 5px; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; }
    .form-status { 
      background: #f8f9fa; 
      padding: 10px; 
      border-radius: 4px; 
      margin: 20px 0; 
      font-size: 12px;
    }
    .form-actions { display: flex; gap: 10px; }
    .btn-primary, .btn-secondary { 
      padding: 12px 24px; 
      border: none; 
      border-radius: 4px; 
      cursor: pointer; 
      font-size: 14px;
    }
    .btn-primary { background: #007bff; color: white; }
    .btn-primary:disabled { background: #6c757d; cursor: not-allowed; }
    .btn-secondary { background: #6c757d; color: white; }
    .debug-info { 
      margin-top: 30px; 
      padding: 15px; 
      background: #f8f9fa; 
      border-radius: 4px;
    }
    .debug-info pre { font-size: 12px; }
  \`]
})
export class UserRegistrationComponent {
  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: 0,
    country: '',
    agreeToTerms: false
  };
  
  isSubmitting = false;
  showDebug = false;
  
  onSubmit(form: any) {
    if (form.valid && this.user.password === this.user.confirmPassword) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('User registered:', this.user);
        alert('Registration successful!');
        this.isSubmitting = false;
        this.resetForm(form);
      }, 2000);
    } else {
      console.log('Form is invalid');
      this.markAllFieldsAsTouched(form);
    }
  }
  
  resetForm(form: any) {
    form.resetForm();
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: 0,
      country: '',
      agreeToTerms: false
    };
  }
  
  private markAllFieldsAsTouched(form: any) {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  }
  
  getFormErrors(form: any): any {
    const errors: any = {};
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      if (control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
  
  toggleDebug() {
    this.showDebug = !this.showDebug;
  }
}`}
        />

        {/* Reactive Forms */}
        <div>
          <h2>Reactive Forms</h2>
          <p>
            Reactive forms provide a model-driven approach to handling form inputs. They offer more control, better
            testability, and are ideal for complex forms with dynamic validation requirements.
          </p>
        </div>

        <CodeExample
          title="Reactive Form Example"
          description="A comprehensive reactive form with custom validators and dynamic controls"
          filename="reactive-form.component.ts"
          code={`import { Component, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  FormArray, 
  FormControl, 
  Validators, 
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';

@Component({
  selector: 'app-reactive-form',
  template: \`
    <div class="reactive-form">
      <h2>User Profile Form (Reactive)</h2>
      
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" novalidate>
        <!-- Personal Information -->
        <fieldset>
          <legend>Personal Information</legend>
          
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                formControlName="firstName"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('firstName')">
              <div class="error-messages" *ngIf="isFieldInvalid('firstName')">
                <div *ngFor="let error of getFieldErrors('firstName')">{{ error }}</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                formControlName="lastName"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('lastName')">
              <div class="error-messages" *ngIf="isFieldInvalid('lastName')">
                <div *ngFor="let error of getFieldErrors('lastName')">{{ error }}</div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email *</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('email')"
              [class.is-pending]="profileForm.get('email')?.pending">
            <div class="error-messages" *ngIf="isFieldInvalid('email')">
              <div *ngFor="let error of getFieldErrors('email')">{{ error }}</div>
            </div>
            <div *ngIf="profileForm.get('email')?.pending" class="pending-message">
              Checking email availability...
            </div>
          </div>
          
          <div class="form-group">
            <label for="username">Username *</label>
            <input
              type="text"
              id="username"
              formControlName="username"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('username')"
              [class.is-pending]="profileForm.get('username')?.pending">
            <div class="error-messages" *ngIf="isFieldInvalid('username')">
              <div *ngFor="let error of getFieldErrors('username')">{{ error }}</div>
            </div>
          </div>
        </fieldset>

        <!-- Address Information -->
        <fieldset formGroupName="address">
          <legend>Address Information</legend>
          
          <div class="form-group">
            <label for="street">Street Address *</label>
            <input
              type="text"
              id="street"
              formControlName="street"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('address.street')">
            <div class="error-messages" *ngIf="isFieldInvalid('address.street')">
              <div *ngFor="let error of getFieldErrors('address.street')">{{ error }}</div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="city">City *</label>
              <input
                type="text"
                id="city"
                formControlName="city"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('address.city')">
              <div class="error-messages" *ngIf="isFieldInvalid('address.city')">
                <div *ngFor="let error of getFieldErrors('address.city')">{{ error }}</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="zipCode">ZIP Code *</label>
              <input
                type="text"
                id="zipCode"
                formControlName="zipCode"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('address.zipCode')">
              <div class="error-messages" *ngIf="isFieldInvalid('address.zipCode')">
                <div *ngFor="let error of getFieldErrors('address.zipCode')">{{ error }}</div>
              </div>
            </div>
          </div>
        </fieldset>

        <!-- Skills (FormArray) -->
        <fieldset>
          <legend>Skills</legend>
          <div formArrayName="skills">
            <div *ngFor="let skill of skillsArray.controls; let i = index" 
                 [formGroupName]="i" 
                 class="skill-item">
              <div class="form-row">
                <div class="form-group">
                  <label>Skill Name *</label>
                  <input
                    type="text"
                    formControlName="name"
                    class="form-control"
                    [class.is-invalid]="isFieldInvalid('skills.' + i + '.name')">
                </div>
                
                <div class="form-group">
                  <label>Experience (years) *</label>
                  <input
                    type="number"
                    formControlName="experience"
                    class="form-control"
                    min="0"
                    max="50"
                    [class.is-invalid]="isFieldInvalid('skills.' + i + '.experience')">
                </div>
                
                <div class="form-group">
                  <label>Proficiency *</label>
                  <select
                    formControlName="proficiency"
                    class="form-control"
                    [class.is-invalid]="isFieldInvalid('skills.' + i + '.proficiency')">
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                
                <button
                  type="button"
                  class="btn-remove"
                  (click)="removeSkill(i)"
                  [disabled]="skillsArray.length <= 1">
                  Remove
                </button>
              </div>
              
              <div class="error-messages" *ngIf="getSkillErrors(i).length > 0">
                <div *ngFor="let error of getSkillErrors(i)">{{ error }}</div>
              </div>
            </div>
          </div>
          
          <button
            type="button"
            class="btn-add"
            (click)="addSkill()">
            Add Skill
          </button>
        </fieldset>

        <!-- Preferences -->
        <fieldset>
          <legend>Preferences</legend>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                formControlName="newsletter">
              Subscribe to newsletter
            </label>
          </div>
          
          <div class="form-group">
            <label>Preferred Contact Method *</label>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  type="radio"
                  formControlName="contactMethod"
                  value="email">
                Email
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  formControlName="contactMethod"
                  value="phone">
                Phone
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  formControlName="contactMethod"
                  value="sms">
                SMS
              </label>
            </div>
            <div class="error-messages" *ngIf="isFieldInvalid('contactMethod')">
              <div *ngFor="let error of getFieldErrors('contactMethod')">{{ error }}</div>
            </div>
          </div>
        </fieldset>

        <!-- Form Actions -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn-primary"
            [disabled]="profileForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Save Profile' }}
          </button>
          
          <button
            type="button"
            class="btn-secondary"
            (click)="resetForm()">
            Reset
          </button>
          
          <button
            type="button"
            class="btn-secondary"
            (click)="loadSampleData()">
            Load Sample Data
          </button>
        </div>

        <!-- Form Status -->
        <div class="form-status">
          <p>Form Valid: {{ profileForm.valid }}</p>
          <p>Form Touched: {{ profileForm.touched }}</p>
          <p>Form Dirty: {{ profileForm.dirty }}</p>
          <p>Form Pending: {{ profileForm.pending }}</p>
        </div>
      </form>

      <!-- Debug Panel -->
      <div class="debug-panel" *ngIf="showDebug">
        <h3>Form Value</h3>
        <pre>{{ profileForm.value | json }}</pre>
        
        <h3>Form Errors</h3>
        <pre>{{ getFormErrors() | json }}</pre>
      </div>
    </div>
  \`,
  styles: [\`
    .reactive-form { max-width: 800px; margin: 0 auto; padding: 20px; }
    fieldset { 
      border: 1px solid #ddd; 
      border-radius: 4px; 
      padding: 20px; 
      margin-bottom: 20px; 
    }
    legend { padding: 0 10px; font-weight: bold; }
    .form-row { display: flex; gap: 15px; }
    .form-row .form-group { flex: 1; }
    .form-group { margin-bottom: 15px; }
    .form-control { 
      width: 100%; 
      padding: 8px; 
      border: 1px solid #ddd; 
      border-radius: 4px; 
    }
    .form-control.is-invalid { border-color: #dc3545; }
    .form-control.is-pending { border-color: #ffc107; }
    .error-messages { color: #dc3545; font-size: 12px; margin-top: 5px; }
    .pending-message { color: #ffc107; font-size: 12px; margin-top: 5px; }
    .skill-item { 
      border: 1px solid #eee; 
      padding: 15px; 
      margin-bottom: 10px; 
      border-radius: 4px; 
    }
    .checkbox-label, .radio-label { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      margin-bottom: 8px;
    }
    .radio-group { display: flex; flex-direction: column; }
    .btn-primary, .btn-secondary, .btn-add, .btn-remove { 
      padding: 8px 16px; 
      border: none; 
      border-radius: 4px; 
      cursor: pointer; 
      margin-right: 10px;
    }
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-add { background: #28a745; color: white; }
    .btn-remove { background: #dc3545; color: white; }
    .btn-primary:disabled { background: #6c757d; cursor: not-allowed; }
    .form-status { 
      background: #f8f9fa; 
      padding: 15px; 
      border-radius: 4px; 
      margin: 20px 0; 
    }
    .debug-panel { 
      background: #f8f9fa; 
      padding: 15px; 
      border-radius: 4px; 
      margin-top: 20px; 
    }
    .debug-panel pre { font-size: 12px; }
  \`]
})
export class ReactiveFormComponent implements OnInit {
  profileForm!: FormGroup;
  isSubmitting = false;
  showDebug = false;
  
  constructor(private fb: any) {}
  
  ngOnInit() {
    this.createForm();
  }
  
  createForm() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', 
        [Validators.required, Validators.email], 
        [this.emailAsyncValidator()]
      ],
      username: ['', 
        [Validators.required, Validators.minLength(3)], 
        [this.usernameAsyncValidator()]
      ],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern(/^\\d{5}(-\\d{4})?$/)]]
      }),
      skills: this.fb.array([this.createSkillGroup()]),
      newsletter: [false],
      contactMethod: ['', Validators.required]
    });
  }
  
  get skillsArray(): any {
    return this.profileForm.get('skills') as any;
  }
  
  createSkillGroup(): any {
    return this.fb.group({
      name: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      proficiency: ['', Validators.required]
    });
  }
  
  addSkill() {
    this.skillsArray.push(this.createSkillGroup());
  }
  
  removeSkill(index: number) {
    if (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(index);
    }
  }
  
  // Custom async validator for email
  emailAsyncValidator(): any {
    return (control: any): Observable<any> => {
      if (!control.value) {
        return of(null);
      }
      
      // Simulate API call to check email availability
      return of(control.value).pipe(
        delay(1000),
        map(email => {
          const unavailableEmails = ['admin@example.com', 'test@example.com'];
          return unavailableEmails.includes(email) 
            ? { emailTaken: 'This email is already registered' }
            : null;
        })
      );
    };
  }
  
  // Custom async validator for username
  usernameAsyncValidator(): any {
    return (control: any): Observable<any> => {
      if (!control.value) {
        return of(null);
      }
      
      // Simulate API call to check username availability
      return of(control.value).pipe(
        delay(800),
        map(username => {
          const unavailableUsernames = ['admin', 'root', 'test', 'user', 'guest'];
          return unavailableUsernames.includes(username.toLowerCase()) 
            ? { usernameTaken: 'This username is not available' }
            : null;
        })
      );
    };
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
  
  getFieldErrors(fieldName: string): string[] {
    const field = this.profileForm.get(fieldName);
    const errors: string[] = [];
    
    if (field && field.errors) {
      Object.keys(field.errors).forEach(key => {
        switch (key) {
          case 'required':
            errors.push('This field is required');
            break;
          case 'minlength':
            errors.push(\`Minimum length is \${field.errors![key].requiredLength}\`);
            break;
          case 'email':
            errors.push('Please enter a valid email address');
            break;
          case 'pattern':
            errors.push('Please enter a valid format');
            break;
          case 'min':
            errors.push(\`Minimum value is \${field.errors![key].min}\`);
            break;
          case 'max':
            errors.push(\`Maximum value is \${field.errors![key].max}\`);
            break;
          case 'emailTaken':
          case 'usernameTaken':
            errors.push(field.errors![key]);
            break;
          default:
            errors.push(\`Invalid \${key}\`);
        }
      });
    }
    
    return errors;
  }
  
  getSkillErrors(index: number): string[] {
    const skillGroup = this.skillsArray.at(index);
    const errors: string[] = [];
    
    if (skillGroup && skillGroup.errors) {
      Object.keys(skillGroup.errors).forEach(key => {
        errors.push(skillGroup.errors![key]);
      });
    }
    
    return errors;
  }
  
  getFormErrors(): any {
    const errors: any = {};
    
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    
    return errors;
  }
  
  onSubmit() {
    if (this.profileForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Profile saved:', this.profileForm.value);
        alert('Profile saved successfully!');
        this.isSubmitting = false;
      }, 2000);
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }
  
  resetForm() {
    this.profileForm.reset();
    this.createForm();
  }
  
  loadSampleData() {
    this.profileForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      username: 'johndoe123',
      address: {
        street: '123 Main St',
        city: 'New York',
        zipCode: '10001'
      },
      newsletter: true,
      contactMethod: 'email'
    });
    
    // Add sample skills
    while (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(1);
    }
    
    this.skillsArray.at(0).patchValue({
      name: 'Angular',
      experience: 3,
      proficiency: 'advanced'
    });
    
    this.addSkill();
    this.skillsArray.at(1).patchValue({
      name: 'TypeScript',
      experience: 2,
      proficiency: 'intermediate'
    });
  }
  
  private markFormGroupTouched(formGroup: any) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof any) {
        this.markFormGroupTouched(control);
      } else if (control instanceof any) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof any) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      }
    });
  }
  
  toggleDebug() {
    this.showDebug = !this.showDebug;
  }
}`}
        />

        {/* Custom Validators */}
        <div>
          <h2>Custom Validators</h2>
          <p>
            Angular allows you to create custom validators for complex validation scenarios. Here are examples of
            synchronous and asynchronous custom validators.
          </p>
        </div>

        <CodeExample
          title="Custom Validators"
          description="Examples of custom synchronous and asynchronous validators"
          filename="custom-validators.ts"
          code={`// 1. Simple Custom Validator
export function forbiddenNameValidator(forbiddenName: RegExp): any {
  return (control: any): any => {
    const forbidden = forbiddenName.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

// 2. Password Strength Validator
export function passwordStrengthValidator(): any {
  return (control: any): any => {
    const value = control.value;
    
    if (!value) {
      return null;
    }
    
    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[#?!@$%^&*-]/.test(value);
    const isValidLength = value.length >= 8;
    
    const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isValidLength;
    
    if (!passwordValid) {
      const errors: any = {};
      
      if (!hasNumber) errors.missingNumber = true;
      if (!hasUpper) errors.missingUppercase = true;
      if (!hasLower) errors.missingLowercase = true;
      if (!hasSpecial) errors.missingSpecialChar = true;
      if (!isValidLength) errors.minLength = { requiredLength: 8, actualLength: value.length };
      
      return { passwordStrength: errors };
    }
    
    return null;
  };
}

// 3. Cross-field Validator (Password Confirmation)
export function passwordMatchValidator(): any {
  return (control: any): any => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };
}

// 4. Date Range Validator
export function dateRangeValidator(startDateField: string, endDateField: string): any {
  return (control: any): any => {
    const startDate = control.get(startDateField);
    const endDate = control.get(endDateField);
    
    if (!startDate || !endDate || !startDate.value || !endDate.value) {
      return null;
    }
    
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    
    return start < end ? null : { dateRange: { start: start, end: end } };
  };
}

// 5. Age Validator
export function ageValidator(minAge: number, maxAge: number): any {
  return (control: any): any => {
    if (!control.value) {
      return null;
    }
    
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;
    
    if (actualAge < minAge) {
      return { ageMin: { requiredAge: minAge, actualAge: actualAge } };
    }
    
    if (actualAge > maxAge) {
      return { ageMax: { requiredAge: maxAge, actualAge: actualAge } };
    }
    
    return null;
  };
}

// 6. File Type Validator
export function fileTypeValidator(allowedTypes: string[]): any {
  return (control: any): any => {
    const file = control.value;
    
    if (!file) {
      return null;
    }
    
    const fileType = file.type;
    const isValidType = allowedTypes.includes(fileType);
    
    return isValidType ? null : { 
      fileType: { 
        allowedTypes: allowedTypes, 
        actualType: fileType 
      } 
    };
  };
}

// 7. File Size Validator
export function fileSizeValidator(maxSizeInMB: number): any {
  return (control: any): any => {
    const file = control.value;
    
    if (!file) {
      return null;
    }
    
    const fileSizeInMB = file.size / (1024 * 1024);
    
    return fileSizeInMB <= maxSizeInMB ? null : { 
      fileSize: { 
        maxSize: maxSizeInMB, 
        actualSize: Math.round(fileSizeInMB * 100) / 100 
      } 
    };
  };
}

// 8. Async Email Validator Service
export class EmailValidatorService {
  constructor(private http: any) {}
  
  validateEmail(email: string): any {
    return this.http.get<{ available: boolean }>(\`/api/validate-email?email=\${email}\`)
      .pipe(
        map(response => response.available),
        catchError(() => of(true)) // Assume available if API fails
      );
  }
}

// 9. Async Email Validator
export function asyncEmailValidator(emailService: any): any {
  return (control: any): any => {
    if (!control.value) {
      return of(null);
    }
    
    return emailService.validateEmail(control.value).pipe(
      delay(500), // Debounce API calls
      map(isAvailable => isAvailable ? null : { emailTaken: true }),
      catchError(() => of(null)) // Handle errors gracefully
    );
  };
}

// 10. Async Username Validator
export function asyncUsernameValidator(): any {
  return (control: any): any => {
    if (!control.value) {
      return of(null);
    }
    
    // Simulate API call
    const unavailableUsernames = ['admin', 'root', 'test', 'user', 'guest'];
    
    return of(control.value).pipe(
      delay(1000),
      map(username => {
        const isAvailable = !unavailableUsernames.includes(username.toLowerCase());
        return isAvailable ? null : { usernameTaken: true };
      })
    );
  };
}

// 11. Credit Card Validator
export function creditCardValidator(): any {
  return (control: any): any => {
    if (!control.value) {
      return null;
    }
    
    const cardNumber = control.value.replace(/\\s/g, ''); // Remove spaces
    
    // Luhn algorithm
    let sum = 0;
    let alternate = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let n = parseInt(cardNumber.charAt(i), 10);
      
      if (alternate) {
        n *= 2;
        if (n > 9) {
          n = (n % 10) + 1;
        }
      }
      
      sum += n;
      alternate = !alternate;
    }
    
    const isValid = (sum % 10) === 0;
    return isValid ? null : { creditCard: true };
  };
}

// 12. Phone Number Validator
export function phoneNumberValidator(): any {
  return (control: any): any => {
    if (!control.value) {
      return null;
    }
    
    // US phone number pattern
    const phonePattern = /^[\\+]?[1-9][\\d]{0,15}$/;
    const isValid = phonePattern.test(control.value.replace(/[\\s\\-\$$\$$]/g, ''));
    
    return isValid ? null : { phoneNumber: true };
  };
}

// Usage Examples:
/*
// In component:
this.form = this.fb.group({
  username: ['', 
    [Validators.required, forbiddenNameValidator(/admin/i)],
    [asyncUsernameValidator()]
  ],
  password: ['', [Validators.required, passwordStrengthValidator()]],
  confirmPassword: ['', Validators.required],
  email: ['', 
    [Validators.required, Validators.email],
    [asyncEmailValidator(this.emailService)]
  ],
  birthDate: ['', [Validators.required, ageValidator(18, 100)]],
  phone: ['', [Validators.required, phoneNumberValidator()]],
  creditCard: ['', creditCardValidator()],
  profileImage: ['', [
    fileTypeValidator(['image/jpeg', 'image/png']),
    fileSizeValidator(5) // 5MB max
  ]]
}, { 
  validators: [passwordMatchValidator(), dateRangeValidator('startDate', 'endDate')] 
});
*/`}
        />

        {/* Interview Questions */}
        <InterviewQuestions questions={formsQuestions} />
      </div>
    </PageLayout>
  )
}
