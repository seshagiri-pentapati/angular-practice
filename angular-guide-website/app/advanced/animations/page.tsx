import PageLayout from "@/components/page-layout"
import CodeExample from "@/components/code-example"
import InterviewQuestions from "@/components/interview-questions"

export default function AnimationsPage() {
  const animationExamples = [
    {
      title: "Basic Animations Setup",
      code: `// app.module.ts
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule // Required for animations
  ],
  // ...
})
export class AppModule { }

// Basic Animation Component
import { 
  trigger, state, style, transition, animate, 
  keyframes, group, query, stagger 
} from '@angular/animations';

@Component({
  selector: 'app-basic-animations',
  template: \`
    <div class="animation-demo">
      <h2>Basic Animations</h2>
      
      <!-- Fade Animation -->
      <div class="section">
        <button (click)="toggleFade()">Toggle Fade</button>
        <div 
          class="box fade-box" 
          [@fadeInOut]="fadeState"
        >
          Fade Animation
        </div>
      </div>
      
      <!-- Slide Animation -->
      <div class="section">
        <button (click)="toggleSlide()">Toggle Slide</button>
        <div 
          class="box slide-box" 
          [@slideInOut]="slideState"
        >
          Slide Animation
        </div>
      </div>
      
      <!-- Scale Animation -->
      <div class="section">
        <button (click)="toggleScale()">Toggle Scale</button>
        <div 
          class="box scale-box" 
          [@scaleInOut]="scaleState"
        >
          Scale Animation
        </div>
      </div>
      
      <!-- Rotate Animation -->
      <div class="section">
        <button (click)="startRotation()">Rotate</button>
        <div 
          class="box rotate-box" 
          [@rotateAnimation]="rotateState"
        >
          Rotate Animation
        </div>
      </div>
    </div>
  \`,
  animations: [
    // Fade Animation
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('in <=> out', animate('300ms ease-in-out'))
    ]),
    
    // Slide Animation
    trigger('slideInOut', [
      state('in', style({ 
        transform: 'translateX(0)',
        opacity: 1 
      })),
      state('out', style({ 
        transform: 'translateX(-100%)',
        opacity: 0 
      })),
      transition('in <=> out', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
    ]),
    
    // Scale Animation
    trigger('scaleInOut', [
      state('small', style({ 
        transform: 'scale(0.8)',
        opacity: 0.8 
      })),
      state('large', style({ 
        transform: 'scale(1.2)',
        opacity: 1 
      })),
      transition('small <=> large', animate('250ms ease-in-out'))
    ]),
    
    // Rotate Animation
    trigger('rotateAnimation', [
      state('start', style({ transform: 'rotate(0deg)' })),
      state('end', style({ transform: 'rotate(360deg)' })),
      transition('start => end', animate('1000ms ease-in-out')),
      transition('end => start', animate('0ms'))
    ])
  ]
})
export class BasicAnimationsComponent {
  fadeState = 'in';
  slideState = 'in';
  scaleState = 'small';
  rotateState = 'start';

  toggleFade() {
    this.fadeState = this.fadeState === 'in' ? 'out' : 'in';
  }

  toggleSlide() {
    this.slideState = this.slideState === 'in' ? 'out' : 'in';
  }

  toggleScale() {
    this.scaleState = this.scaleState === 'small' ? 'large' : 'small';
  }

  startRotation() {
    this.rotateState = this.rotateState === 'start' ? 'end' : 'start';
  }
}`,
    },
    {
      title: "Advanced Animation Techniques",
      code: `// Advanced Animations Component
@Component({
  selector: 'app-advanced-animations',
  template: \`
    <div class="advanced-animations">
      <h2>Advanced Animations</h2>
      
      <!-- List Animations -->
      <div class="section">
        <h3>List Animations</h3>
        <button (click)="addItem()">Add Item</button>
        <button (click)="removeItem()">Remove Item</button>
        <button (click)="shuffleItems()">Shuffle</button>
        
        <ul class="animated-list" [@listAnimation]="items.length">
          <li 
            *ngFor="let item of items; trackBy: trackByFn" 
            [@itemAnimation]
            class="list-item"
          >
            {{ item.name }}
            <button (click)="removeSpecificItem(item.id)">×</button>
          </li>
        </ul>
      </div>
      
      <!-- Stagger Animations -->
      <div class="section">
        <h3>Stagger Animations</h3>
        <button (click)="toggleCards()">Toggle Cards</button>
        
        <div class="cards-container" [@staggerAnimation]="showCards">
          <div 
            *ngFor="let card of cards" 
            class="card"
          >
            Card {{ card }}
          </div>
        </div>
      </div>
      
      <!-- Keyframe Animations -->
      <div class="section">
        <h3>Keyframe Animations</h3>
        <button (click)="startBounce()">Bounce</button>
        <button (click)="startPulse()">Pulse</button>
        
        <div 
          class="keyframe-box"
          [@bounceAnimation]="bounceState"
          [@pulseAnimation]="pulseState"
        >
          Keyframe Animation
        </div>
      </div>
      
      <!-- Route Animations -->
      <div class="section">
        <h3>Page Transitions</h3>
        <button (click)="changePage('page1')">Page 1</button>
        <button (click)="changePage('page2')">Page 2</button>
        <button (click)="changePage('page3')">Page 3</button>
        
        <div class="page-container" [@pageTransition]="currentPage">
          <div [ngSwitch]="currentPage">
            <div *ngSwitchCase="'page1'" class="page">Page 1 Content</div>
            <div *ngSwitchCase="'page2'" class="page">Page 2 Content</div>
            <div *ngSwitchCase="'page3'" class="page">Page 3 Content</div>
          </div>
        </div>
      </div>
    </div>
  \`,
  animations: [
    // List Animation
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger(100, [
            animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          stagger(50, [
            animate('200ms ease-out', style({ opacity: 0, transform: 'translateX(100px)' }))
          ])
        ], { optional: true })
      ])
    ]),
    
    // Item Animation
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8) translateY(-20px)' }),
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        )
      ]),
      transition(':leave', [
        animate('200ms ease-in', 
          style({ opacity: 0, transform: 'scale(0.8) translateX(100px)' })
        )
      ])
    ]),
    
    // Stagger Animation
    trigger('staggerAnimation', [
      transition('false => true', [
        query('.card', [
          style({ opacity: 0, transform: 'translateY(50px) scale(0.8)' }),
          stagger(150, [
            animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'translateY(0) scale(1)' })
            )
          ])
        ])
      ]),
      transition('true => false', [
        query('.card', [
          stagger(50, [
            animate('200ms ease-in', 
              style({ opacity: 0, transform: 'translateY(-50px) scale(0.8)' })
            )
          ])
        ])
      ])
    ]),
    
    // Bounce Animation with Keyframes
    trigger('bounceAnimation', [
      transition('idle => bounce', [
        animate('1000ms', keyframes([
          style({ transform: 'translateY(0)', offset: 0 }),
          style({ transform: 'translateY(-30px)', offset: 0.3 }),
          style({ transform: 'translateY(0)', offset: 0.5 }),
          style({ transform: 'translateY(-15px)', offset: 0.7 }),
          style({ transform: 'translateY(0)', offset: 1 })
        ]))
      ])
    ]),
    
    // Pulse Animation
    trigger('pulseAnimation', [
      transition('idle => pulse', [
        animate('1500ms', keyframes([
          style({ transform: 'scale(1)', opacity: 1, offset: 0 }),
          style({ transform: 'scale(1.1)', opacity: 0.8, offset: 0.25 }),
          style({ transform: 'scale(1)', opacity: 1, offset: 0.5 }),
          style({ transform: 'scale(1.1)', opacity: 0.8, offset: 0.75 }),
          style({ transform: 'scale(1)', opacity: 1, offset: 1 })
        ]))
      ])
    ]),
    
    // Page Transition
    trigger('pageTransition', [
      transition('* => *', [
        group([
          query(':enter', [
            style({ opacity: 0, transform: 'translateX(100%)' }),
            animate('400ms ease-in-out', 
              style({ opacity: 1, transform: 'translateX(0)' })
            )
          ], { optional: true }),
          query(':leave', [
            animate('400ms ease-in-out', 
              style({ opacity: 0, transform: 'translateX(-100%)' })
            )
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AdvancedAnimationsComponent {
  items: { id: number; name: string }[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];
  
  cards = [1, 2, 3, 4, 5, 6];
  showCards = false;
  
  bounceState = 'idle';
  pulseState = 'idle';
  
  currentPage = 'page1';
  
  private itemCounter = 4;

  trackByFn(index: number, item: any) {
    return item.id;
  }

  addItem() {
    this.items.push({
      id: this.itemCounter++,
      name: \`Item \${this.itemCounter - 1}\`
    });
  }

  removeItem() {
    if (this.items.length > 0) {
      this.items.pop();
    }
  }

  removeSpecificItem(id: number) {
    this.items = this.items.filter(item => item.id !== id);
  }

  shuffleItems() {
    this.items = [...this.items].sort(() => Math.random() - 0.5);
  }

  toggleCards() {
    this.showCards = !this.showCards;
  }

  startBounce() {
    this.bounceState = 'idle';
    setTimeout(() => {
      this.bounceState = 'bounce';
    }, 10);
  }

  startPulse() {
    this.pulseState = 'idle';
    setTimeout(() => {
      this.pulseState = 'pulse';
    }, 10);
  }

  changePage(page: string) {
    this.currentPage = page;
  }
}`,
    },
    {
      title: "Animation Callbacks and Dynamic Animations",
      code: `// Animation Callbacks Component
@Component({
  selector: 'app-animation-callbacks',
  template: \`
    <div class="animation-callbacks">
      <h2>Animation Callbacks & Dynamic Animations</h2>
      
      <!-- Animation with Callbacks -->
      <div class="section">
        <h3>Animation Callbacks</h3>
        <button (click)="triggerAnimation()">Trigger Animation</button>
        
        <div 
          class="callback-box"
          [@slideAnimation]="animationState"
          (@slideAnimation.start)="onAnimationStart($event)"
          (@slideAnimation.done)="onAnimationDone($event)"
        >
          Animation with Callbacks
        </div>
        
        <div class="animation-log">
          <h4>Animation Log:</h4>
          <div *ngFor="let log of animationLogs" class="log-entry">
            {{ log }}
          </div>
        </div>
      </div>
      
      <!-- Dynamic Animations -->
      <div class="section">
        <h3>Dynamic Animations</h3>
        <div class="controls">
          <label>
            Duration: 
            <input type="range" min="100" max="2000" [(ngModel)]="duration">
            {{ duration }}ms
          </label>
          <label>
            Easing: 
            <select [(ngModel)]="easing">
              <option value="ease">ease</option>
              <option value="ease-in">ease-in</option>
              <option value="ease-out">ease-out</option>
              <option value="ease-in-out">ease-in-out</option>
              <option value="linear">linear</option>
            </select>
          </label>
          <label>
            Distance: 
            <input type="range" min="50" max="300" [(ngModel)]="distance">
            {{ distance }}px
          </label>
        </div>
        
        <button (click)="triggerDynamicAnimation()">Animate</button>
        
        <div 
          class="dynamic-box"
          [@dynamicAnimation]="dynamicState"
        >
          Dynamic Animation
        </div>
      </div>
      
      <!-- Conditional Animations -->
      <div class="section">
        <h3>Conditional Animations</h3>
        <label>
          <input type="checkbox" [(ngModel)]="enableAnimations">
          Enable Animations
        </label>
        
        <button (click)="toggleConditional()">Toggle</button>
        
        <div 
          class="conditional-box"
          [@conditionalAnimation]="conditionalState"
          [@.disabled]="!enableAnimations"
        >
          Conditional Animation
        </div>
      </div>
    </div>
  \`,
  animations: [
    // Slide Animation with Callbacks
    trigger('slideAnimation', [
      state('start', style({ transform: 'translateX(0)' })),
      state('end', style({ transform: 'translateX(200px)' })),
      transition('start <=> end', animate('500ms ease-in-out'))
    ]),
    
    // Dynamic Animation
    trigger('dynamicAnimation', [
      state('start', style({ transform: 'translateY(0)' })),
      state('end', style({ transform: 'translateY({{ distance }}px)' }), {
        params: { distance: 100 }
      }),
      transition('start <=> end', 
        animate('{{ duration }}ms {{ easing }}'), {
          params: { duration: 500, easing: 'ease-in-out' }
        }
      )
    ]),
    
    // Conditional Animation
    trigger('conditionalAnimation', [
      state('hidden', style({ 
        opacity: 0, 
        transform: 'scale(0.8)' 
      })),
      state('visible', style({ 
        opacity: 1, 
        transform: 'scale(1)' 
      })),
      transition('hidden <=> visible', animate('300ms ease-in-out'))
    ])
  ]
})
export class AnimationCallbacksComponent {
  animationState = 'start';
  dynamicState = 'start';
  conditionalState = 'visible';
  enableAnimations = true;
  
  duration = 500;
  easing = 'ease-in-out';
  distance = 100;
  
  animationLogs: string[] = [];

  triggerAnimation() {
    this.animationState = this.animationState === 'start' ? 'end' : 'start';
  }

  triggerDynamicAnimation() {
    // Update animation parameters
    this.updateDynamicAnimation();
    this.dynamicState = this.dynamicState === 'start' ? 'end' : 'start';
  }

  toggleConditional() {
    this.conditionalState = this.conditionalState === 'visible' ? 'hidden' : 'visible';
  }

  onAnimationStart(event: AnimationEvent) {
    const log = \`Animation started: \${event.triggerName} from \${event.fromState} to \${event.toState}\`;
    this.animationLogs.push(log);
    console.log('Animation Start:', event);
  }

  onAnimationDone(event: AnimationEvent) {
    const log = \`Animation completed: \${event.triggerName} - \${event.fromState} to \${event.toState}\`;
    this.animationLogs.push(log);
    console.log('Animation Done:', event);
  }

  private updateDynamicAnimation() {
    // Force animation re-evaluation with new parameters
    const currentState = this.dynamicState;
    this.dynamicState = '';
    setTimeout(() => {
      this.dynamicState = currentState;
    }, 0);
  }
}`,
    },
    {
      title: "Route Animations",
      code: `// Route Animation Configuration
// app-routing.module.ts
const routes: Routes = [
  { 
    path: 'home', 
    component: HomeComponent,
    data: { animation: 'HomePage' }
  },
  { 
    path: 'about', 
    component: AboutComponent,
    data: { animation: 'AboutPage' }
  },
  { 
    path: 'contact', 
    component: ContactComponent,
    data: { animation: 'ContactPage' }
  }
];

// Route Animation Definitions
export const slideInAnimation = trigger('routeAnimations', [
  transition('HomePage <=> AboutPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
    query(':enter', [
      style({ left: '-100%' })
    ]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('300ms ease-out', style({ left: '100%' }))
      ]),
      query(':enter', [
        animate('300ms ease-out', style({ left: '0%' }))
      ])
    ]),
    query(':enter', animateChild()),
  ]),
  transition('* <=> ContactPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'scale(0.8)' })
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [
        animate('200ms', style({ opacity: 0, transform: 'scale(1.1)' }))
      ], { optional: true }),
      query(':enter', [
        animate('300ms', style({ opacity: 1, transform: 'scale(1)' }))
      ], { optional: true })
    ]),
    query(':enter', animateChild(), { optional: true }),
  ])
]);

// App Component with Route Animations
@Component({
  selector: 'app-root',
  template: \`
    <div class="app-container">
      <nav>
        <a routerLink="/home" routerLinkActive="active">Home</a>
        <a routerLink="/about" routerLinkActive="active">About</a>
        <a routerLink="/contact" routerLinkActive="active">Contact</a>
      </nav>
      
      <main [@routeAnimations]="prepareRoute(outlet)">
        <router-outlet #outlet="outlet"></router-outlet>
      </main>
    </div>
  \`,
  animations: [slideInAnimation]
})
export class AppComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}`,
    },
  ]

  const interviewQuestions = [
    {
      question: "What are Angular Animations and how do they work?",
      answer:
        "Angular Animations are a powerful system built on top of the Web Animations API that allows you to create smooth, performant animations in Angular applications. They work by defining animation triggers, states, and transitions using the @angular/animations package. The animation system integrates with Angular's change detection to automatically trigger animations when component state changes.",
    },
    {
      question: "Explain the difference between trigger, state, and transition in Angular animations.",
      answer:
        "- **Trigger**: Defines an animation and attaches it to an element via [@triggerName]. It contains states and transitions.\n- **State**: Defines a specific style configuration that an element can be in (e.g., 'open', 'closed').\n- **Transition**: Defines how to animate between states, specifying the timing and easing functions.",
    },
    {
      question: "How do you implement stagger animations in Angular?",
      answer:
        "Stagger animations are implemented using the `stagger()` function within query selectors. You use `query()` to select multiple elements and `stagger()` to delay each animation by a specified time interval. This creates a cascading effect where elements animate one after another.",
    },
    {
      question: "What are animation callbacks and when would you use them?",
      answer:
        "Animation callbacks are events that fire when animations start (@triggerName.start) or complete (@triggerName.done). They're useful for coordinating complex animations, updating component state after animations complete, logging animation events, or triggering subsequent animations in a sequence.",
    },
    {
      question: "How do you create dynamic animations with parameterized values?",
      answer:
        "Dynamic animations use the `params` option in state and transition definitions. You can pass parameters when triggering animations, allowing runtime customization of duration, easing, distances, colors, etc. Parameters are accessed using double curly braces in the animation definition.",
    },
    {
      question: "Explain how to implement route animations in Angular.",
      answer:
        "Route animations involve: 1) Adding animation data to route configurations, 2) Creating transition animations that handle :enter and :leave pseudo-selectors, 3) Using query() and group() to coordinate entering and leaving route components, 4) Implementing prepareRoute() method to extract animation data from the router outlet.",
    },
    {
      question: "What are the performance considerations for Angular animations?",
      answer:
        "Key performance considerations include: using transform and opacity properties (GPU-accelerated), avoiding animating layout properties like width/height, using OnPush change detection strategy, implementing trackBy functions for list animations, and using the @.disabled binding to conditionally disable animations on low-end devices.",
    },
    {
      question: "How do you test Angular animations?",
      answer:
        "Angular animations can be tested by: 1) Using NoopAnimationsModule in test configurations to disable animations, 2) Testing animation triggers and state changes, 3) Using fakeAsync and tick() to control animation timing in tests, 4) Testing animation callbacks and their side effects, 5) Using BrowserAnimationsModule for integration tests that require actual animations.",
    },
  ]

  return (
    <PageLayout
      title="Angular Animations"
      description="Master Angular's powerful animation system for creating smooth, engaging user interfaces"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Overview</h2>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-300 leading-relaxed mb-4">
              Angular Animations provide a powerful, declarative way to create smooth, performant animations in your
              applications. Built on the Web Animations API, Angular's animation system integrates seamlessly with the
              framework's change detection and component lifecycle.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Key Features</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Declarative animation syntax</li>
                  <li>• State-based animations</li>
                  <li>• Transition animations</li>
                  <li>• Keyframe animations</li>
                  <li>• Stagger animations</li>
                  <li>• Route animations</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-600">
                <h3 className="font-semibold text-pink-400 mb-2">Animation Building Blocks</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>
                    • <code>trigger()</code> - Animation definition
                  </li>
                  <li>
                    • <code>state()</code> - Style states
                  </li>
                  <li>
                    • <code>transition()</code> - State changes
                  </li>
                  <li>
                    • <code>animate()</code> - Timing functions
                  </li>
                  <li>
                    • <code>keyframes()</code> - Complex animations
                  </li>
                  <li>
                    • <code>query()</code> - Element selection
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Examples</h2>
          <div className="space-y-6">
            {animationExamples.map((example, index) => (
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
