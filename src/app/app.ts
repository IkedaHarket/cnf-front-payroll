import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '@components/index';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, NavbarComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
