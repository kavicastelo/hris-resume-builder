import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-sign',
  imports: [
    RouterModule
  ],
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.scss',
  standalone: true
})
export class SignComponent implements OnInit {

  title = 'In';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.url === '/sign/in' ? this.title = 'In' : this.title = 'Up';
  }
}
