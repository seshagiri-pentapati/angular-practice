import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CrudDemoComponent } from './demos/crud-demo/crud-demo.component';
import { BlogDemoComponent } from './demos/blog-demo/blog-demo.component';
import { ContactDemoComponent } from './demos/contact-demo/contact-demo.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'crud', component: CrudDemoComponent },
  { path: 'blog', component: BlogDemoComponent },
  { path: 'contact', component: ContactDemoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
