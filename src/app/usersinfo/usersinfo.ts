import { Component, OnInit, OnDestroy } from '@angular/core';
import { Adminservice } from '../adminservice';
import { Userinfo } from '../Interfaces/userinfo';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usersinfo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usersinfo.html',
  styleUrls: ['./usersinfo.css'],
})
export class Usersinfo implements OnInit, OnDestroy {
  users: Userinfo[] = [];
  private intervalId: any;
  apiMessage = '';
  apiMessageType: 'success' | 'error' = 'success';
  hasDeletedUsers = false;
  loading = false;
  currentpage = 1;
  totalpages = 1;

  constructor(
    private http: Adminservice,
    private routing: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.GetAllUsers();

    this.intervalId = setInterval(() => {
      this.GetAllUsers();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  GetAllUsers(): void {
    this.http.GetAllUsers(this.currentpage).subscribe({
      next: (res) => {
        this.users = res.items;
        this.currentpage = res.pageNumber;
        this.totalpages = res.totalPages;
        this.hasDeletedUsers = this.users.length > 0;
      },
      error: () => {
        this.users = [];
        this.hasDeletedUsers = false;
      }
    });
  }

  nextPage(): void {
    if (this.currentpage < this.totalpages) {
      this.currentpage++;
      this.GetAllUsers();
    }
  }

  previousPage(): void {
    if (this.currentpage > 1) {
      this.currentpage--;
      this.GetAllUsers();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalpages) {
      this.currentpage = page;
      this.GetAllUsers();
    }
  }

  deleteusers(): void {
    this.loading = true;

    this.http.DeleteAllUsers().subscribe({
      next: (res) => {
        this.showApiMessage(res, 'success');

        if (this.currentpage > 1 && this.users.length === 1) {
          this.currentpage--;
        }

        this.GetAllUsers();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private showApiMessage(message: any, type: 'success' | 'error'): void {
    this.apiMessage = message;
    this.apiMessageType = type;

    setTimeout(() => {
      this.apiMessage = '';
    }, 2000);
  }
  copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}
}