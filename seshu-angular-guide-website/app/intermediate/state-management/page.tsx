import { PageLayout } from "@/components/page-layout"
import { CodeExample } from "@/components/code-example"
import { InterviewQuestions } from "@/components/interview-questions"

export default function StateManagementPage() {
  const stateExamples = [
    {
      title: "Service-Based State Management",
      code: `import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private initialState: AppState = {
    user: null,
    loading: false,
    error: null,
    theme: 'light'
  };

  private stateSubject = new BehaviorSubject<AppState>(this.initialState);
  public state$ = this.stateSubject.asObservable();

  // Selectors
  public user$ = this.state$.pipe(map(state => state.user));
  public loading$ = this.state$.pipe(map(state => state.loading));
  public error$ = this.state$.pipe(map(state => state.error));
  public theme$ = this.state$.pipe(map(state => state.theme));
  public isAuthenticated$ = this.state$.pipe(map(state => !!state.user));

  constructor() {
    // Load initial state from localStorage
    this.loadStateFromStorage();
  }

  // State getters
  get currentState(): AppState {
    return this.stateSubject.value;
  }

  get currentUser(): User | null {
    return this.currentState.user;
  }

  // State mutations
  setUser(user: User | null) {
    this.updateState({ user });
    this.saveStateToStorage();
  }

  setLoading(loading: boolean) {
    this.updateState({ loading });
  }

  setError(error: string | null) {
    this.updateState({ error });
  }

  setTheme(theme: 'light' | 'dark') {
    this.updateState({ theme });
    this.saveStateToStorage();
  }

  clearError() {
    this.updateState({ error: null });
  }

  reset() {
    this.stateSubject.next(this.initialState);
    localStorage.removeItem('appState');
  }

  // Private methods
  private updateState(partial: Partial<AppState>) {
    const currentState = this.currentState;
    const newState = { ...currentState, ...partial };
    this.stateSubject.next(newState);
  }

  private saveStateToStorage() {
    const stateToSave = {
      user: this.currentState.user,
      theme: this.currentState.theme
    };
    localStorage.setItem('appState', JSON.stringify(stateToSave));
  }

  private loadStateFromStorage() {
    try {
      const saved = localStorage.getItem('appState');
      if (saved) {
        const parsedState = JSON.parse(saved);
        this.updateState(parsedState);
      }
    } catch (error) {
      console.error('Error loading state from storage:', error);
    }
  }
}`,
    },
    {
      title: "NgRx Store Setup",
      code: `// state/app.state.ts
export interface AppState {
  auth: AuthState;
  products: ProductState;
  ui: UIState;
}

// state/auth/auth.state.ts
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// state/auth/auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginCredentials }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const loadUser = createAction('[Auth] Load User');

// state/auth/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.logout, () => initialState)
);

// state/auth/auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(response => AuthActions.loginSuccess({
            user: response.user,
            token: response.token
          })),
          catchError(error => of(AuthActions.loginFailure({
            error: error.message
          })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ token }) => {
        localStorage.setItem('token', token);
        this.router.navigate(['/dashboard']);
      })
    ), { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      })
    ), { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}

// state/auth/auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  state => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  state => !!state.user && !!state.token
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  state => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  state => state.error
);`,
    },
    {
      title: "Component Using State Management",
      code: `import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StateService } from './state.service';
import * as AuthActions from './state/auth/auth.actions';
import * as AuthSelectors from './state/auth/auth.selectors';

@Component({
  selector: 'app-dashboard',
  template: \`
    <div class="dashboard">
      <!-- Using service-based state -->
      <div *ngIf="user$ | async as user" class="user-info">
        <h2>Welcome, {{ user.name }}!</h2>
        <p>{{ user.email }}</p>
        <button (click)="toggleTheme()">
          Switch to {{ (theme$ | async) === 'light' ? 'dark' : 'light' }} theme
        </button>
      </div>

      <!-- Using NgRx store -->
      <div *ngIf="storeUser$ | async as user" class="store-user-info">
        <h3>Store User: {{ user.name }}</h3>
        <button (click)="logout()" [disabled]="authLoading$ | async">
          {{ (authLoading$ | async) ? 'Logging out...' : 'Logout' }}
        </button>
      </div>

      <!-- Error handling -->
      <div *ngIf="error$ | async as error" class="error">
        {{ error }}
        <button (click)="clearError()">Clear</button>
      </div>

      <!-- Loading state -->
      <div *ngIf="loading$ | async" class="loading">
        Loading...
      </div>

      <!-- Content based on authentication state -->
      <div *ngIf="isAuthenticated$ | async; else loginPrompt">
        <h3>Dashboard Content</h3>
        <p>This content is only visible to authenticated users.</p>
      </div>

      <ng-template #loginPrompt>
        <div class="login-prompt">
          <p>Please log in to access the dashboard.</p>
          <button (click)="navigateToLogin()">Login</button>
        </div>
      </ng-template>
    </div>
  \`,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Service-based state observables
  user$ = this.stateService.user$;
  theme$ = this.stateService.theme$;
  loading$ = this.stateService.loading$;
  error$ = this.stateService.error$;
  isAuthenticated$ = this.stateService.isAuthenticated$;

  // NgRx store observables
  storeUser$ = this.store.select(AuthSelectors.selectUser);
  authLoading$ = this.store.select(AuthSelectors.selectAuthLoading);
  authError$ = this.store.select(AuthSelectors.selectAuthError);

  constructor(
    private stateService: StateService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to state changes for side effects
    this.theme$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(theme => {
      document.body.className = theme + '-theme';
    });

    // Handle authentication errors
    this.authError$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(error => {
      if (error) {
        console.error('Auth error:', error);
        // Show toast notification
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme() {
    const currentTheme = this.stateService.currentState.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.stateService.setTheme(newTheme);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  clearError() {
    this.stateService.clearError();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

// Alternative: Using OnPush change detection with state
@Component({
  selector: 'app-optimized-dashboard',
  template: \`
    <div class="dashboard" *ngIf="vm$ | async as vm">
      <div *ngIf="vm.user" class="user-info">
        <h2>Welcome, {{ vm.user.name }}!</h2>
        <p>Theme: {{ vm.theme }}</p>
        <p>Loading: {{ vm.loading }}</p>
        <p>Error: {{ vm.error }}</p>
      </div>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedDashboardComponent {
  // Combine multiple observables into a single view model
  vm$ = combineLatest([
    this.stateService.user$,
    this.stateService.theme$,
    this.stateService.loading$,
    this.stateService.error$
  ]).pipe(
    map(([user, theme, loading, error]) => ({
      user,
      theme,
      loading,
      error
    }))
  );

  constructor(private stateService: StateService) {}
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What are the different approaches to state management in Angular?",
      answer:
        "Angular offers several state management approaches: 1) Service-based with BehaviorSubject (simple apps), 2) NgRx (complex apps with predictable state), 3) Akita (alternative to NgRx), 4) NGXS (simpler than NgRx), 5) Component state with @Input/@Output (local state). Choice depends on app complexity and team preferences.",
    },
    {
      question: "When should you use NgRx vs service-based state management?",
      answer:
        "Use NgRx for: complex apps, multiple data sources, time-travel debugging, strict unidirectional data flow, team collaboration. Use services for: simple to medium apps, straightforward state, rapid prototyping, smaller teams. NgRx adds complexity but provides better maintainability for large applications.",
    },
    {
      question: "What are NgRx Effects and why are they important?",
      answer:
        "Effects handle side effects in NgRx like HTTP requests, routing, localStorage operations. They listen to actions, perform async operations, and dispatch new actions. They keep reducers pure, centralize side effects, and enable better testing and debugging of async operations.",
    },
    {
      question: "How do you prevent memory leaks in state management?",
      answer:
        "Use takeUntil pattern with destroy subject, async pipe for automatic unsubscription, OnPush change detection to reduce subscriptions, unsubscribe in ngOnDestroy, avoid nested subscriptions, use operators like switchMap instead of manual subscription management.",
    },
    {
      question: "What are selectors in NgRx and their benefits?",
      answer:
        "Selectors are pure functions that extract specific pieces of state. Benefits: memoization for performance, composability, testability, decoupling components from state structure, reusability across components. They prevent unnecessary re-renders and provide a clean API for accessing state.",
    },
  ]

  return (
    <PageLayout
      title="State Management"
      description="Master state management patterns in Angular from services to NgRx"
      previousPage={{ href: "/intermediate/rxjs", title: "RxJS & Observables" }}
      nextPage={{ href: "/intermediate/pipes", title: "Pipes & Custom Pipes" }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory Overview</h2>
          <div className="prose prose-gray max-w-none">
            <p>
              State management is crucial for maintaining data consistency across your Angular application. As
              applications grow in complexity, managing state becomes increasingly important for maintainability and
              user experience.
            </p>

            <h3>State Management Approaches:</h3>
            <ul>
              <li>
                <strong>Component State:</strong> Local state using properties and @Input/@Output
              </li>
              <li>
                <strong>Service-based:</strong> Shared state using services with BehaviorSubject
              </li>
              <li>
                <strong>NgRx:</strong> Redux pattern with actions, reducers, effects, and selectors
              </li>
              <li>
                <strong>Akita:</strong> Alternative state management with entity stores
              </li>
              <li>
                <strong>NGXS:</strong> Simpler alternative to NgRx with decorators
              </li>
            </ul>

            <h3>NgRx Core Concepts:</h3>
            <ul>
              <li>
                <strong>Store:</strong> Single source of truth for application state
              </li>
              <li>
                <strong>Actions:</strong> Events that describe what happened
              </li>
              <li>
                <strong>Reducers:</strong> Pure functions that handle state transitions
              </li>
              <li>
                <strong>Effects:</strong> Handle side effects like HTTP requests
              </li>
              <li>
                <strong>Selectors:</strong> Functions to select specific state slices
              </li>
            </ul>

            <h3>When to Use Each Approach:</h3>
            <ul>
              <li>
                <strong>Component State:</strong> Simple, isolated component data
              </li>
              <li>
                <strong>Service-based:</strong> Small to medium apps, shared data between components
              </li>
              <li>
                <strong>NgRx:</strong> Large, complex apps with multiple data sources and complex interactions
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
          <div className="space-y-6">
            {stateExamples.map((example, index) => (
              <CodeExample key={index} title={example.title} code={example.code} language="typescript" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <ul className="space-y-2 text-gray-700">
              <li>• Keep state normalized and avoid deeply nested objects</li>
              <li>• Use immutable updates to prevent unexpected mutations</li>
              <li>• Implement proper error handling and loading states</li>
              <li>• Use selectors for computed state and memoization</li>
              <li>• Keep reducers pure and side-effect free</li>
              <li>• Use OnPush change detection with state management</li>
              <li>• Implement proper cleanup to prevent memory leaks</li>
              <li>• Use TypeScript for better type safety</li>
            </ul>
          </div>
        </section>

        <InterviewQuestions questions={interviewQuestions} />
      </div>
    </PageLayout>
  )
}
