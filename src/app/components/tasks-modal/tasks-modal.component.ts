import { CommonModule } from '@angular/common';
import { Component, inject, signal, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatHint } from '@angular/material/form-field';

export interface TaskModalData {
  title: string;
  notes: string;
  priority: 'low' | 'med' | 'high';
  dueAt?: number;
}

@Component({
  selector: 'app-tasks-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule, 
    MatDatepickerModule, 
    MatButtonModule, 
    MatIconModule,
    MatHint
  ],
  templateUrl: './tasks-modal.component.html',
  styleUrl: './tasks-modal.component.css'
})
export default class TaskModalComponent implements OnInit {
  private ref = inject(MatDialogRef<TaskModalComponent>);

  // Input for editing existing tasks
  editingTask = input<any | null>(null);

  title = '';
  notes = '';
  priority: 'low' | 'med' | 'high' = 'low';
  dueDate: Date | null = null;
  saving = signal(false);

  ngOnInit() {
    // If editing an existing task, populate the form
    const task = this.editingTask();
    if (task) {
      this.title = task.title;
      this.notes = task.notes || '';
      this.priority = task.priority || 'low';
      this.dueDate = task.dueAt ? new Date(task.dueAt) : null;
    }
  }

  close() { 
    this.ref.close(null); 
  }

  save() {
    if (!this.title.trim()) return;
    
    this.saving.set(true);
    
    // Convert Date object to timestamp
    const dueAt = this.dueDate ? this.dueDate.getTime() : undefined;
    
    const taskData: TaskModalData = {
      title: this.title.trim(),
      notes: this.notes.trim(),
      priority: this.priority,
      dueAt
    };

    console.log('Saving task data:', taskData); // Debug log
    
    this.ref.close(taskData);
  }
}