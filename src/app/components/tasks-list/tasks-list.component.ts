import { Component, computed, signal, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../../interfaces/task.interface';
import TaskModalComponent from '../tasks-modal/tasks-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule, 
    MatDatepickerModule, 
    MatButtonModule, 
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTooltipModule,
    DatePipe,
    TitleCasePipe
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css'
})
export default class TasksListComponent implements OnInit, OnDestroy {
  private dialog = inject(MatDialog);
  svc = inject(TasksService);

  q = signal('');
  show = signal<'all'|'open'|'done'>('all');
  sortBy = signal<'created'|'due'|'priority'>('created');

  ngOnInit() { 
    this.svc.startListening(); 
  }
  
  ngOnDestroy() { 
    this.svc.stopListening(); 
  }

  filtered = computed(() => {
    const query = this.q().trim().toLowerCase();
    let list = this.svc.tasks();

    

    if (query) {
      list = list.filter(t =>
        t.title.toLowerCase().includes(query) ||
        (t.notes || '').toLowerCase().includes(query)
      );
    }

    if (this.show() !== 'all') {
      list = list.filter(t => this.show() === 'done' ? t.done : !t.done);
    }

    switch (this.sortBy()) {
      case 'due':
        list = [...list].sort((a,b) => (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity));
        break;
      case 'priority': {
        const rank: Record<string, number> = { high: 0, med: 1, low: 2 };
        list = [...list].sort((a,b) => (rank[a.priority || 'low'] - rank[b.priority || 'low']));
        break;
      }
      default:
        list = [...list].sort((a,b) => b.createdAt - a.createdAt);
    }
    
    console.log('Filtered result:', list.length, 'tasks');
    return list;
  });

  getPriorityIcon(priority: string = 'low'): string {
    const icons = {
      high: 'flag',
      med: 'outlined_flag',
      low: 'tour'
    };
    return icons[priority as keyof typeof icons] || 'tour';
  }

  isOverdue(dueAt: number): boolean {
    return dueAt < Date.now();
  }

  async openCreate() {
    if (this.q()) {
      this.q.set('');
      return;
    }
    
    const ref = this.dialog.open(TaskModalComponent, { 
      width: 'min(560px, 96vw)',
      maxWidth: '96vw',
      panelClass: 'task-modal'
    });
    
    const result = await ref.afterClosed().toPromise();
    if (result) {
      try {
        console.log('Creating task with data:', result);
        await this.svc.add(result);
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  }

  toggle(t: Task) { 
    console.log('Toggling task:', t.id, 'from', t.done, 'to', !t.done);
    this.svc.toggleDone(t); 
  }

  remove(t: Task) { 
    if (t.id) {
      console.log('Removing task:', t.id);
      this.svc.remove(t.id); 
    }
  }
}