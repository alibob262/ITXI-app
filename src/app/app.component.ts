import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ITXI-app';
}
