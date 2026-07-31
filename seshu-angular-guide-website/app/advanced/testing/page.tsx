import PageLayout from "../../../components/page-layout"
import CodeExample from "../../../components/code-example"
import InterviewQuestions from "../../../components/interview-questions"

export default function TestingPage() {
  const testingExamples = [
    {
      title: "Unit Testing Components",
      code: `// user.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { UserComponent } from './user.component';
import { UserService } from './user.service';
import { of, throwError } from 'rxjs';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    // Create spy object for UserService
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser']);

    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    // Arrange
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    userService.getUsers.and.returnValue(of(mockUsers));

    // Act
    component.ngOnInit();

    // Assert
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading users', () => {
    // Arrange
    const errorMessage = 'Failed to load users';
    userService.getUsers.and.returnValue(throwError(() => new Error(errorMessage)));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.users).toEqual([]);
    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalse();
  });

  it('should delete user when delete button is clicked', () => {
    // Arrange
    const userId = 1;
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    component.users = mockUsers;
    userService.deleteUser.and.returnValue(of({}));

    // Act
    component.deleteUser(userId);

    // Assert
    expect(userService.deleteUser).toHaveBeenCalledWith(userId);
    expect(component.users.length).toBe(1);
    expect(component.users.find(u => u.id === userId)).toBeUndefined();
  });

  it('should render user list correctly', () => {
    // Arrange
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    component.users = mockUsers;

    // Act
    fixture.detectChanges();

    // Assert
    const userElements = debugElement.queryAll(By.css('.user-item'));
    expect(userElements.length).toBe(2);
    
    const firstUserName = userElements[0].query(By.css('.user-name'));
    expect(firstUserName.nativeElement.textContent).toContain('John Doe');
  });

  it('should show loading spinner when loading', () => {
    // Arrange
    component.loading = true;

    // Act
    fixture.detectChanges();

    // Assert
    const loadingElement = debugElement.query(By.css('.loading-spinner'));
    expect(loadingElement).toBeTruthy();
  });

  it('should emit user selected event', () => {
    // Arrange
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    spyOn(component.userSelected, 'emit');

    // Act
    component.selectUser(mockUser);

    // Assert
    expect(component.userSelected.emit).toHaveBeenCalledWith(mockUser);
  });
});`,
    },
    {
      title: "Testing Services with HTTP",
      code: `// user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from './user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://api.example.com/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users', () => {
    // Arrange
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];

    // Act
    service.getUsers().subscribe(users => {
      // Assert
      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(2);
    });

    // Assert HTTP request
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should create user', () => {
    // Arrange
    const newUser: Partial<User> = { name: 'New User', email: 'new@example.com' };
    const createdUser: User = { id: 3, ...newUser } as User;

    // Act
    service.createUser(newUser).subscribe(user => {
      // Assert
      expect(user).toEqual(createdUser);
    });

    // Assert HTTP request
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(createdUser);
  });

  it('should update user', () => {
    // Arrange
    const userId = 1;
    const updatedUser: User = { id: userId, name: 'Updated Name', email: 'updated@example.com' };

    // Act
    service.updateUser(userId, updatedUser).subscribe(user => {
      // Assert
      expect(user).toEqual(updatedUser);
    });

    // Assert HTTP request
    const req = httpMock.expectOne(\`\${apiUrl}/\${userId}\`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });

  it('should delete user', () => {
    // Arrange
    const userId = 1;

    // Act
    service.deleteUser(userId).subscribe(response => {
      // Assert
      expect(response).toEqual({});
    });

    // Assert HTTP request
    const req = httpMock.expectOne(\`\${apiUrl}/\${userId}\`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle HTTP error', () => {
    // Arrange
    const errorMessage = 'Server error';

    // Act
    service.getUsers().subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        // Assert
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    });

    // Assert HTTP request
    const req = httpMock.expectOne(apiUrl);
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should retry failed requests', () => {
    // Arrange
    const mockUsers: User[] = [{ id: 1, name: 'John', email: 'john@example.com' }];
    let callCount = 0;

    // Act
    service.getUsersWithRetry().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    // Assert - First request fails
    const req1 = httpMock.expectOne(apiUrl);
    req1.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    // Assert - Second request succeeds
    const req2 = httpMock.expectOne(apiUrl);
    req2.flush(mockUsers);
  });
});`,
    },
    {
      title: "Testing Reactive Forms",
      code: `// user-form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create form with initial values', () => {
    expect(component.userForm).toBeDefined();
    expect(component.userForm.get('name')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
    expect(component.userForm.get('age')?.value).toBe(null);
  });

  it('should validate required fields', () => {
    // Act
    component.userForm.patchValue({
      name: '',
      email: '',
      age: null
    });

    // Assert
    expect(component.userForm.get('name')?.hasError('required')).toBeTruthy();
    expect(component.userForm.get('email')?.hasError('required')).toBeTruthy();
    expect(component.userForm.get('age')?.hasError('required')).toBeTruthy();
    expect(component.userForm.invalid).toBeTruthy();
  });

  it('should validate email format', () => {
    // Act
    component.userForm.patchValue({
      email: 'invalid-email'
    });

    // Assert
    expect(component.userForm.get('email')?.hasError('email')).toBeTruthy();
    
    // Act - valid email
    component.userForm.patchValue({
      email: 'valid@example.com'
    });

    // Assert
    expect(component.userForm.get('email')?.hasError('email')).toBeFalsy();
  });

  it('should validate age range', () => {
    // Act - age too low
    component.userForm.patchValue({ age: 17 });
    expect(component.userForm.get('age')?.hasError('min')).toBeTruthy();

    // Act - age too high
    component.userForm.patchValue({ age: 101 });
    expect(component.userForm.get('age')?.hasError('max')).toBeTruthy();

    // Act - valid age
    component.userForm.patchValue({ age: 25 });
    expect(component.userForm.get('age')?.valid).toBeTruthy();
  });

  it('should show validation errors in template', () => {
    // Arrange
    component.userForm.patchValue({
      name: '',
      email: 'invalid-email'
    });
    component.userForm.markAllAsTouched();
    fixture.detectChanges();

    // Assert
    const nameError = fixture.debugElement.query(By.css('[data-test="name-error"]'));
    const emailError = fixture.debugElement.query(By.css('[data-test="email-error"]'));
    
    expect(nameError.nativeElement.textContent).toContain('Name is required');
    expect(emailError.nativeElement.textContent).toContain('Please enter a valid email');
  });

  it('should emit form data on valid submission', () => {
    // Arrange
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    };
    spyOn(component.formSubmit, 'emit');
    
    component.userForm.patchValue(formData);

    // Act
    component.onSubmit();

    // Assert
    expect(component.formSubmit.emit).toHaveBeenCalledWith(formData);
  });

  it('should not emit on invalid submission', () => {
    // Arrange
    spyOn(component.formSubmit, 'emit');
    component.userForm.patchValue({
      name: '',
      email: 'invalid-email',
      age: null
    });

    // Act
    component.onSubmit();

    // Assert
    expect(component.formSubmit.emit).not.toHaveBeenCalled();
    expect(component.userForm.touched).toBeTruthy();
  });

  it('should disable submit button when form is invalid', () => {
    // Arrange
    component.userForm.patchValue({
      name: '',
      email: '',
      age: null
    });
    fixture.detectChanges();

    // Assert
    const submitButton = fixture.debugElement.query(By.css('[data-test="submit-button"]'));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it('should reset form', () => {
    // Arrange
    component.userForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });

    // Act
    component.resetForm();

    // Assert
    expect(component.userForm.get('name')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
    expect(component.userForm.get('age')?.value).toBe(null);
    expect(component.userForm.pristine).toBeTruthy();
  });
});`,
    },
    {
      title: "Integration Testing with Router",
      code: `// app.component.spec.ts (Integration Test)
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

// Mock components for testing
@Component({ template: 'Home Component' })
class MockHomeComponent { }

@Component({ template: 'About Component' })
class MockAboutComponent { }

@Component({ template: 'Contact Component' })
class MockContactComponent { }

describe('AppComponent (Integration)', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockHomeComponent,
        MockAboutComponent,
        MockContactComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: '/home', pathMatch: 'full' },
          { path: 'home', component: MockHomeComponent },
          { path: 'about', component: MockAboutComponent },
          { path: 'contact', component: MockContactComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home by default', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/home');
  });

  it('should navigate to about page', async () => {
    await router.navigate(['/about']);
    expect(location.path()).toBe('/about');
  });

  it('should navigate to contact page', async () => {
    await router.navigate(['/contact']);
    expect(location.path()).toBe('/contact');
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement;
    const navLinks = compiled.querySelectorAll('nav a');
    
    expect(navLinks.length).toBe(3);
    expect(navLinks[0].textContent).toContain('Home');
    expect(navLinks[1].textContent).toContain('About');
    expect(navLinks[2].textContent).toContain('Contact');
  });

  it('should highlight active navigation link', async () => {
    await router.navigate(['/about']);
    fixture.detectChanges();

    const activeLink = fixture.nativeElement.querySelector('nav a.active');
    expect(activeLink.textContent).toContain('About');
  });

  it('should handle invalid routes', async () => {
    await router.navigate(['/invalid-route']);
    // Depending on your routing configuration
    // You might redirect to a 404 page or home
    expect(location.path()).toBe('/invalid-route');
  });
});

// Testing with Guards
describe('AuthGuard Integration', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access when user is authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});`,
    },
    {
      title: "E2E Testing with Cypress",
      code: `// cypress/e2e/user-management.cy.ts
describe('User Management', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/users');
    
    // Mock API responses
    cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers');
    cy.intercept('POST', '/api/users', { fixture: 'user-created.json' }).as('createUser');
    cy.intercept('DELETE', '/api/users/*', {}).as('deleteUser');
  });

  it('should display user list', () => {
    // Wait for API call
    cy.wait('@getUsers');
    
    // Check if users are displayed
    cy.get('[data-cy="user-list"]').should('be.visible');
    cy.get('[data-cy="user-item"]').should('have.length.greaterThan', 0);
    
    // Check user details
    cy.get('[data-cy="user-item"]').first().within(() => {
      cy.get('[data-cy="user-name"]').should('contain.text', 'John Doe');
      cy.get('[data-cy="user-email"]').should('contain.text', 'john@example.com');
    });
  });

  it('should create new user', () => {
    // Click add user button
    cy.get('[data-cy="add-user-btn"]').click();
    
    // Fill form
    cy.get('[data-cy="user-form"]').within(() => {
      cy.get('[data-cy="name-input"]').type('New User');
      cy.get('[data-cy="email-input"]').type('newuser@example.com');
      cy.get('[data-cy="age-input"]').type('25');
      
      // Submit form
      cy.get('[data-cy="submit-btn"]').click();
    });
    
    // Wait for API call
    cy.wait('@createUser');
    
    // Check success message
    cy.get('[data-cy="success-message"]').should('contain.text', 'User created successfully');
    
    // Check if user is added to list
    cy.get('[data-cy="user-list"]').should('contain.text', 'New User');
  });

  it('should validate form inputs', () => {
    cy.get('[data-cy="add-user-btn"]').click();
    
    // Try to submit empty form
    cy.get('[data-cy="submit-btn"]').click();
    
    // Check validation errors
    cy.get('[data-cy="name-error"]').should('contain.text', 'Name is required');
    cy.get('[data-cy="email-error"]').should('contain.text', 'Email is required');
    cy.get('[data-cy="age-error"]').should('contain.text', 'Age is required');
    
    // Test email validation
    cy.get('[data-cy="email-input"]').type('invalid-email');
    cy.get('[data-cy="submit-btn"]').click();
    cy.get('[data-cy="email-error"]').should('contain.text', 'Please enter a valid email');
  });

  it('should delete user', () => {
    cy.wait('@getUsers');
    
    // Click delete button for first user
    cy.get('[data-cy="user-item"]').first().within(() => {
      cy.get('[data-cy="delete-btn"]').click();
    });
    
    // Confirm deletion
    cy.get('[data-cy="confirm-dialog"]').within(() => {
      cy.get('[data-cy="confirm-btn"]').click();
    });
    
    // Wait for API call
    cy.wait('@deleteUser');
    
    // Check success message
    cy.get('[data-cy="success-message"]').should('contain.text', 'User deleted successfully');
  });

  it('should handle API errors', () => {
    // Mock API error
    cy.intercept('GET', '/api/users', { statusCode: 500, body: 'Server Error' }).as('getUsersError');
    
    // Reload page
    cy.reload();
    cy.wait('@getUsersError');
    
    // Check error message
    cy.get('[data-cy="error-message"]').should('contain.text', 'Failed to load users');
  });

  it('should search users', () => {
    cy.wait('@getUsers');
    
    // Type in search box
    cy.get('[data-cy="search-input"]').type('John');
    
    // Check filtered results
    cy.get('[data-cy="user-item"]').should('have.length', 1);
    cy.get('[data-cy="user-item"]').first().should('contain.text', 'John Doe');
    
    // Clear search
    cy.get('[data-cy="search-input"]').clear();
    cy.get('[data-cy="user-item"]').should('have.length.greaterThan', 1);
  });

  it('should be responsive', () => {
    // Test mobile view
    cy.viewport('iphone-6');
    cy.get('[data-cy="mobile-menu"]').should('be.visible');
    cy.get('[data-cy="desktop-menu"]').should('not.be.visible');
    
    // Test desktop view
    cy.viewport(1280, 720);
    cy.get('[data-cy="mobile-menu"]').should('not.be.visible');
    cy.get('[data-cy="desktop-menu"]').should('be.visible');
  });
});

// cypress/fixtures/users.json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 25
  }
]

// cypress/fixtures/user-created.json
{
  "id": 3,
  "name": "New User",
  "email": "newuser@example.com",
  "age": 25
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What are the different types of testing in Angular?",
      answer:
        "Angular supports three main types of testing: 1) **Unit Testing** - Testing individual components, services, and functions in isolation using Jasmine and Karma, 2) **Integration Testing** - Testing how multiple components work together, often using TestBed and RouterTestingModule, 3) **End-to-End (E2E) Testing** - Testing the complete application flow using tools like Cypress or Protractor.",
    },
    {
      question: "Explain the role of TestBed in Angular testing.",
      answer:
        "TestBed is Angular's primary testing utility that creates a testing module to configure and create components for testing. It provides methods like configureTestingModule() to set up dependencies, createComponent() to instantiate components, and inject() to get service instances. TestBed essentially creates a mini Angular environment for testing.",
    },
    {
      question: "How do you test HTTP requests in Angular?",
      answer:
        "HTTP requests are tested using HttpClientTestingModule and HttpTestingController. You import HttpClientTestingModule in your test setup, inject HttpTestingController, make the service call, then use expectOne() to verify the request and flush() to provide mock responses. Always call httpMock.verify() in afterEach to ensure no unmatched requests.",
    },
    {
      question: "What's the difference between spies and mocks in Angular testing?",
      answer:
        "Spies are used to track function calls and optionally provide return values using jasmine.createSpy() or spyOn(). Mocks are complete fake implementations of objects/services created with jasmine.createSpyObj(). Spies are good for testing if methods were called, while mocks provide controlled behavior for dependencies.",
    },
    {
      question: "How do you test reactive forms in Angular?",
      answer:
        "Reactive forms testing involves: 1) Importing ReactiveFormsModule in test configuration, 2) Testing form validation by setting values and checking form.valid/invalid states, 3) Testing individual form control errors using hasError(), 4) Testing form submission by calling component methods and verifying emitted events, 5) Testing template integration with fixture.detectChanges().",
    },
    {
      question: "What are the best practices for Angular testing?",
      answer:
        "Best practices include: 1) Follow AAA pattern (Arrange, Act, Assert), 2) Use descriptive test names, 3) Test behavior, not implementation, 4) Mock external dependencies, 5) Use data-cy attributes for E2E selectors, 6) Keep tests focused and isolated, 7) Use beforeEach for common setup, 8) Test both happy path and error scenarios, 9) Maintain good test coverage.",
    },
    {
      question: "How do you test Angular components with async operations?",
      answer:
        "Async operations are tested using: 1) **fakeAsync/tick()** - For testing setTimeout, setInterval, and Promises, 2) **async/await** - For testing Observables and HTTP calls, 3) **done callback** - For manual async control, 4) **fixture.whenStable()** - To wait for all async operations to complete. Use detectChanges() after async operations to update the view.",
    },
    {
      question: "What tools and frameworks are commonly used for Angular testing?",
      answer:
        "Common testing tools include: 1) **Jasmine** - Testing framework with describe/it syntax, 2) **Karma** - Test runner for unit tests, 3) **Cypress** - Modern E2E testing framework, 4) **Jest** - Alternative to Jasmine/Karma, 5) **Angular Testing Library** - Simple and complete testing utilities, 6) **Spectator** - Powerful testing library for Angular, 7) **Protractor** - Legacy E2E framework (deprecated).",
    },
  ]

  return (
    <PageLayout
      title="Angular Testing"
      description="Master comprehensive testing strategies for Angular applications including unit, integration, and E2E testing"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Overview</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 leading-relaxed mb-4">
              Testing is crucial for building reliable Angular applications. Angular provides excellent testing support
              with tools like TestBed, Jasmine, and Karma for unit testing, plus integration with modern E2E frameworks
              like Cypress. A comprehensive testing strategy ensures code quality, prevents regressions, and enables
              confident refactoring.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Unit Testing</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Component testing</li>
                  <li>• Service testing</li>
                  <li>• Pipe testing</li>
                  <li>• Directive testing</li>
                  <li>• Guard testing</li>
                  <li>• Resolver testing</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Integration Testing</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Component integration</li>
                  <li>• Router testing</li>
                  <li>• Form testing</li>
                  <li>• HTTP testing</li>
                  <li>• Module testing</li>
                  <li>• Guard integration</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">E2E Testing</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• User workflows</li>
                  <li>• Cross-browser testing</li>
                  <li>• API integration</li>
                  <li>• Performance testing</li>
                  <li>• Accessibility testing</li>
                  <li>• Visual regression</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Examples</h2>
          <div className="space-y-6">
            {testingExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Interview Questions</h2>
          <InterviewQuestions questions={interviewQuestions} />
        </section>
      </div>
    </PageLayout>
  )
}
