import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CrudDemoComponent } from './demos/crud-demo/crud-demo.component';
import { BlogDemoComponent } from './demos/blog-demo/blog-demo.component';
import { ContactDemoComponent } from './demos/contact-demo/contact-demo.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, CrudDemoComponent, BlogDemoComponent, ContactDemoComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
