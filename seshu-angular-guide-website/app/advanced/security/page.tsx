import PageLayout from "../../../components/page-layout"
import CodeExample from "../../../components/code-example"
import InterviewQuestions from "../../../components/interview-questions"

export default function SecurityPage() {
  const securityExamples = [
    {
      title: "XSS Prevention and Sanitization",
      code: `// XSS Prevention in Angular
import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-secure-content',
  template: \`
    <div class="secure-content">
      <h3>XSS Prevention Examples</h3>
      
      <!-- ✅ Safe - Angular automatically sanitizes -->
      <div>{{ userInput }}</div>
      
      <!-- ✅ Safe - Using innerHTML with sanitization -->
      <div [innerHTML]="sanitizedHtml"></div>
      
      <!-- ⚠️ Dangerous - Bypassing sanitization (only when necessary) -->
      <div [innerHTML]="trustedHtml"></div>
      
      <!-- ✅ Safe - URL sanitization -->
      <a [href]="sanitizedUrl">Safe Link</a>
      
      <!-- ✅ Safe - Style sanitization -->
      <div [style]="sanitizedStyle">Styled content</div>
      
      <!-- Form with validation -->
      <form [formGroup]="secureForm" (ngSubmit)="onSubmit()">
        <input 
          formControlName="userInput" 
          placeholder="Enter text"
          [class.invalid]="isFieldInvalid('userInput')"
        >
        <div *ngIf="isFieldInvalid('userInput')" class="error">
          Invalid input detected
        </div>
        <button type="submit" [disabled]="secureForm.invalid">Submit</button>
      </form>
    </div>
  \`
})
export class SecureContentComponent implements OnInit {
  userInput = '';
  sanitizedHtml: SafeHtml = '';
  trustedHtml: SafeHtml = '';
  sanitizedUrl: SafeUrl = '';
  sanitizedStyle: any = '';
  secureForm: FormGroup;

  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {
    this.secureForm = this.fb.group({
      userInput: ['', [Validators.required, this.noScriptValidator]]
    });
  }

  ngOnInit() {
    // Example of sanitizing user content
    const userHtml = '<p>Hello <script>alert("XSS")</script> World</p>';
    this.sanitizedHtml = this.sanitizer.sanitize(SecurityContext.HTML, userHtml) || '';
    
    // Only bypass sanitization when you trust the content
    const trustedContent = '<p>This is <strong>trusted</strong> content</p>';
    this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml(trustedContent);
    
    // URL sanitization
    const userUrl = 'javascript:alert("XSS")';
    this.sanitizedUrl = this.sanitizer.sanitize(SecurityContext.URL, userUrl) || '';
    
    // Style sanitization
    const userStyle = 'color: red; background: url(javascript:alert("XSS"))';
    this.sanitizedStyle = this.sanitizer.sanitize(SecurityContext.STYLE, userStyle);
  }

  // Custom validator to prevent script injection
  noScriptValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value)) {
      return { scriptDetected: true };
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.secureForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.secureForm.valid) {
      const sanitizedInput = this.sanitizer.sanitize(
        SecurityContext.HTML, 
        this.secureForm.value.userInput
      );
      console.log('Sanitized input:', sanitizedInput);
    }
  }
}

// Secure Pipe for Content Sanitization
@Pipe({
  name: 'secureSanitize'
})
export class SecureSanitizePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, context: SecurityContext = SecurityContext.HTML): SafeHtml {
    return this.sanitizer.sanitize(context, value) || '';
  }
}`,
    },
    {
      title: "Authentication and Authorization",
      code: `// JWT Authentication Service
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize user from stored token
    this.initializeUser();
  }

  private initializeUser() {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const user = this.getUserFromToken(token);
      this.currentUserSubject.next(user);
    } else {
      this.logout();
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', { username, password })
      .pipe(
        map(response => {
          this.setTokens(response.token, response.refreshToken);
          this.currentUserSubject.next(response.user);
          return response;
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      this.logout();
      return throwError('No refresh token available');
    }

    return this.http.post<AuthResponse>('/api/auth/refresh', { refreshToken })
      .pipe(
        map(response => {
          this.setTokens(response.token, response.refreshToken);
          this.currentUserSubject.next(response.user);
          return response;
        }),
        catchError(error => {
          this.logout();
          return throwError(error);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles.includes(role) || false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUserSubject.value;
    return roles.some(role => user?.roles.includes(role)) || false;
  }

  private setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  private getUserFromToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        username: payload.username,
        email: payload.email,
        roles: payload.roles || []
      };
    } catch {
      return null;
    }
  }
}

// Auth Guard
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkAuth(route);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkAuth(route);
  }

  private checkAuth(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check role-based access
    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && !this.authService.hasAnyRole(requiredRoles)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}

// Role-based Directive
@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {
  @Input() appHasRole: string | string[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView() {
    const roles = Array.isArray(this.appHasRole) ? this.appHasRole : [this.appHasRole];
    const hasPermission = this.authService.hasAnyRole(roles);

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}`,
    },
    {
      title: "HTTP Security and Interceptors",
      code: `// Security HTTP Interceptor
import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent,
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add security headers
    let secureReq = this.addSecurityHeaders(req);
    
    // Add auth token
    secureReq = this.addAuthToken(secureReq);

    return next.handle(secureReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:
              return this.handle401Error(secureReq, next);
            case 403:
              return this.handle403Error(error);
            default:
              return throwError(error);
          }
        }
        return throwError(error);
      })
    );
  }

  private addSecurityHeaders(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    });
  }

  private addAuthToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken();
    if (token) {
      return req.clone({
        setHeaders: {
          Authorization: \`Bearer \${token}\`
        }
      });
    }
    return req;
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.token);
          return next.handle(this.addAuthToken(req));
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(() => next.handle(this.addAuthToken(req)))
      );
    }
  }

  private handle403Error(error: HttpErrorResponse): Observable<never> {
    // Log security violation
    console.error('Access forbidden:', error);
    // Redirect to unauthorized page or show message
    return throwError(error);
  }
}

// CSRF Protection Service
@Injectable({
  providedIn: 'root'
})
export class CsrfService {
  private csrfToken: string | null = null;

  constructor(private http: HttpClient) {}

  getCsrfToken(): Observable<string> {
    if (this.csrfToken) {
      return of(this.csrfToken);
    }

    return this.http.get<{token: string}>('/api/csrf-token').pipe(
      map(response => {
        this.csrfToken = response.token;
        return this.csrfToken;
      })
    );
  }

  addCsrfToken(req: HttpRequest<any>): HttpRequest<any> {
    if (this.csrfToken && this.isModifyingRequest(req)) {
      return req.clone({
        setHeaders: {
          'X-CSRF-Token': this.csrfToken
        }
      });
    }
    return req;
  }

  private isModifyingRequest(req: HttpRequest<any>): boolean {
    return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  }
}

// Content Security Policy Service
@Injectable({
  providedIn: 'root'
})
export class CspService {
  private nonce: string;

  constructor() {
    this.nonce = this.generateNonce();
    this.setupCSP();
  }

  private generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  private setupCSP(): void {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = \`
      default-src 'self';
      script-src 'self' 'nonce-\${this.nonce}';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://api.example.com;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    \`.replace(/\s+/g, ' ').trim();
    
    document.head.appendChild(meta);
  }

  getNonce(): string {
    return this.nonce;
  }
}`,
    },
    {
      title: "Input Validation and Sanitization",
      code: `// Comprehensive Input Validation
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom Validators
export class SecurityValidators {
  
  // Prevent SQL injection patterns
  static noSqlInjection(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const sqlPatterns = [
      /('|(\\')|(;)|(\\|)|(\\*)|(%))/i,
      /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i,
      /(script|javascript|vbscript|onload|onerror|onclick)/i
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(value)) {
        return { sqlInjection: true };
      }
    }
    return null;
  }

  // Prevent XSS attacks
  static noXss(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(value)) {
        return { xssDetected: true };
      }
    }
    return null;
  }

  // Validate file uploads
  static secureFile(allowedTypes: string[], maxSize: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (!file) return null;

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        return { invalidFileType: { allowed: allowedTypes, actual: file.type } };
      }

      // Check file size
      if (file.size > maxSize) {
        return { fileTooLarge: { maxSize, actualSize: file.size } };
      }

      // Check file name for malicious patterns
      const dangerousPatterns = [
        /\.(exe|bat|cmd|scr|pif|com)$/i,
        /\.\./,
        /[<>:"|?*]/
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(file.name)) {
          return { maliciousFileName: true };
        }
      }

      return null;
    };
  }

  // Strong password validation
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const errors: any = {};

    if (value.length < 8) {
      errors.minLength = true;
    }

    if (!/[A-Z]/.test(value)) {
      errors.requiresUppercase = true;
    }

    if (!/[a-z]/.test(value)) {
      errors.requiresLowercase = true;
    }

    if (!/[0-9]/.test(value)) {
      errors.requiresNumber = true;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      errors.requiresSpecialChar = true;
    }

    // Check for common weak passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
    if (commonPasswords.includes(value.toLowerCase())) {
      errors.commonPassword = true;
    }

    return Object.keys(errors).length ? { strongPassword: errors } : null;
  }

  // Email validation with additional security checks
  static secureEmail(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    // Basic email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return { invalidEmail: true };
    }

    // Check for suspicious patterns
    if (value.includes('..') || value.startsWith('.') || value.endsWith('.')) {
      return { suspiciousEmail: true };
    }

    // Check domain length
    const domain = value.split('@')[1];
    if (domain.length > 253) {
      return { domainTooLong: true };
    }

    return null;
  }
}

// Secure Form Component
@Component({
  selector: 'app-secure-form',
  template: \`
    <form [formGroup]="secureForm" (ngSubmit)="onSubmit()" class="secure-form">
      <h3>Secure Form Example</h3>
      
      <!-- Email Field -->
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          id="email"
          type="email" 
          formControlName="email"
          [class.invalid]="isFieldInvalid('email')"
          autocomplete="email"
        >
        <div *ngIf="isFieldInvalid('email')" class="error-messages">
          <div *ngIf="secureForm.get('email')?.errors?.['required']">
            Email is required
          </div>
          <div *ngIf="secureForm.get('email')?.errors?.['invalidEmail']">
            Please enter a valid email address
          </div>
          <div *ngIf="secureForm.get('email')?.errors?.['suspiciousEmail']">
            Email format appears suspicious
          </div>
        </div>
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password">Password:</label>
        <input 
          id="password"
          type="password" 
          formControlName="password"
          [class.invalid]="isFieldInvalid('password')"
          autocomplete="new-password"
        >
        <div *ngIf="isFieldInvalid('password')" class="error-messages">
          <div *ngIf="secureForm.get('password')?.errors?.['required']">
            Password is required
          </div>
          <div *ngIf="secureForm.get('password')?.errors?.['strongPassword']" class="password-requirements">
            <div>Password must contain:</div>
            <ul>
              <li [class.met]="!secureForm.get('password')?.errors?.['strongPassword']?.minLength">
                At least 8 characters
              </li>
              <li [class.met]="!secureForm.get('password')?.errors?.['strongPassword']?.requiresUppercase">
                One uppercase letter
              </li>
              <li [class.met]="!secureForm.get('password')?.errors?.['strongPassword']?.requiresLowercase">
                One lowercase letter
              </li>
              <li [class.met]="!secureForm.get('password')?.errors?.['strongPassword']?.requiresNumber">
                One number
              </li>
              <li [class.met]="!secureForm.get('password')?.errors?.['strongPassword']?.requiresSpecialChar">
                One special character
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Comment Field -->
      <div class="form-group">
        <label for="comment">Comment:</label>
        <textarea 
          id="comment"
          formControlName="comment"
          [class.invalid]="isFieldInvalid('comment')"
          maxlength="500"
        ></textarea>
        <div *ngIf="isFieldInvalid('comment')" class="error-messages">
          <div *ngIf="secureForm.get('comment')?.errors?.['xssDetected']">
            Potentially harmful content detected
          </div>
          <div *ngIf="secureForm.get('comment')?.errors?.['sqlInjection']">
            Invalid characters detected
          </div>
        </div>
      </div>

      <!-- File Upload -->
      <div class="form-group">
        <label for="file">Upload File:</label>
        <input 
          id="file"
          type="file" 
          (change)="onFileSelected($event)"
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        >
        <div *ngIf="fileErrors.length > 0" class="error-messages">
          <div *ngFor="let error of fileErrors">{{ error }}</div>
        </div>
      </div>

      <button 
        type="submit" 
        [disabled]="secureForm.invalid || isSubmitting"
        class="submit-btn"
      >
        {{ isSubmitting ? 'Submitting...' : 'Submit' }}
      </button>
    </form>
  \`
})
export class SecureFormComponent implements OnInit {
  secureForm: FormGroup;
  isSubmitting = false;
  fileErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.secureForm = this.fb.group({
      email: ['', [Validators.required, SecurityValidators.secureEmail]],
      password: ['', [Validators.required, SecurityValidators.strongPassword]],
      comment: ['', [SecurityValidators.noXss, SecurityValidators.noSqlInjection]]
    });
  }

  ngOnInit() {
    // Add rate limiting
    this.secureForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      // Validate on change with debouncing
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.secureForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.fileErrors = [];

    if (file) {
      const validator = SecurityValidators.secureFile(
        ['image/jpeg', 'image/png', 'application/pdf'], 
        5 * 1024 * 1024 // 5MB
      );
      
      const control = new FormControl(file);
      const result = validator(control);
      
      if (result) {
        if (result['invalidFileType']) {
          this.fileErrors.push('Invalid file type. Only JPEG, PNG, and PDF files are allowed.');
        }
        if (result['fileTooLarge']) {
          this.fileErrors.push('File is too large. Maximum size is 5MB.');
        }
        if (result['maliciousFileName']) {
          this.fileErrors.push('File name contains invalid characters.');
        }
      }
    }
  }

  onSubmit() {
    if (this.secureForm.valid && this.fileErrors.length === 0) {
      this.isSubmitting = true;
      
      // Sanitize form data before submission
      const formData = {
        email: this.sanitizer.sanitize(SecurityContext.NONE, this.secureForm.value.email),
        comment: this.sanitizer.sanitize(SecurityContext.HTML, this.secureForm.value.comment)
      };

      // Submit form data
      console.log('Secure form submitted:', formData);
      
      // Reset form after submission
      setTimeout(() => {
        this.isSubmitting = false;
        this.secureForm.reset();
      }, 2000);
    }
  }
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What are the main security vulnerabilities in Angular applications and how do you prevent them?",
      answer:
        "Main vulnerabilities include XSS (prevented by Angular's built-in sanitization), CSRF (use CSRF tokens), injection attacks (input validation), insecure authentication (JWT with proper storage), and insecure HTTP communication (HTTPS, security headers). Angular provides built-in protection for most of these through its security model.",
    },
    {
      question: "How does Angular's built-in XSS protection work?",
      answer:
        "Angular automatically sanitizes values before displaying them in the DOM. It treats all values as untrusted by default and sanitizes them based on context (HTML, style, URL, resource URL). The DomSanitizer service provides methods to sanitize or bypass sanitization when necessary. Angular also uses Content Security Policy (CSP) to prevent script injection.",
    },
    {
      question: "What is the difference between authentication and authorization in Angular?",
      answer:
        "Authentication verifies user identity (login process), while authorization determines what authenticated users can access. In Angular, authentication typically involves JWT tokens and login services, while authorization uses guards (CanActivate, CanLoad), role-based access control, and route protection to control access to components and features.",
    },
    {
      question: "How do you implement secure HTTP communication in Angular?",
      answer:
        "Secure HTTP involves: using HTTPS, implementing HTTP interceptors for adding security headers and auth tokens, handling CSRF tokens, implementing proper error handling for 401/403 responses, using secure token storage, implementing token refresh mechanisms, and adding request/response logging for security monitoring.",
    },
    {
      question: "What are the best practices for storing authentication tokens in Angular?",
      answer:
        "Best practices include: using httpOnly cookies for sensitive tokens (when possible), avoiding localStorage for sensitive data, implementing secure token refresh, using short-lived access tokens, storing tokens in memory for SPA, implementing proper token cleanup on logout, and using secure flag for cookies in production.",
    },
    {
      question: "How do you implement Content Security Policy (CSP) in Angular applications?",
      answer:
        "CSP implementation involves: setting CSP headers on the server, using nonce-based script execution, avoiding inline styles and scripts, configuring trusted sources for resources, implementing CSP reporting, using Angular's built-in sanitization, and testing CSP policies thoroughly to ensure functionality isn't broken.",
    },
    {
      question: "What are Angular Guards and how do they enhance security?",
      answer:
        "Angular Guards are interfaces that control navigation and access: CanActivate (route access), CanActivateChild (child routes), CanLoad (lazy modules), CanDeactivate (leaving routes). They enhance security by implementing authentication checks, role-based authorization, preventing unauthorized access, and protecting sensitive routes.",
    },
    {
      question: "How do you validate and sanitize user input in Angular forms?",
      answer:
        "Input validation involves: using Angular's built-in validators, creating custom validators for security patterns, implementing client and server-side validation, sanitizing input with DomSanitizer, preventing XSS and injection attacks, validating file uploads, and implementing rate limiting for form submissions.",
    },
  ]

  return (
    <PageLayout
      title="Security Best Practices"
      description="Learn essential security practices for building secure Angular applications"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Overview</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 leading-relaxed mb-4">
              Security in Angular applications involves implementing multiple layers of protection against common web
              vulnerabilities. Angular provides built-in security features, but developers must understand and properly
              implement additional security measures to protect applications and user data.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Security Threats</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Cross-Site Scripting (XSS)</li>
                  <li>• Cross-Site Request Forgery (CSRF)</li>
                  <li>• Injection Attacks</li>
                  <li>• Insecure Authentication</li>
                  <li>• Data Exposure</li>
                  <li>• Man-in-the-Middle Attacks</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Angular Security Features</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Built-in XSS Protection</li>
                  <li>• DomSanitizer Service</li>
                  <li>• HTTP Interceptors</li>
                  <li>• Route Guards</li>
                  <li>• Content Security Policy</li>
                  <li>• Trusted Types Support</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Examples</h2>
          <div className="space-y-6">
            {securityExamples.map((example, index) => (
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
