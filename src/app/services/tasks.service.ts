import { inject, Injectable, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Task } from '../interfaces/task.interface';
import { Firestore } from '@angular/fire/firestore';
import { query, collection, where, orderBy, addDoc, updateDoc, deleteDoc, onSnapshot, doc } from 'firebase/firestore';   
import { onAuthStateChanged, Unsubscribe as AuthUnsubscribe } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private fs = inject(Firestore);
  private auth = inject(Auth);

  tasks = signal<Task[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  private stop?: () => void;
  private stopAuth?: AuthUnsubscribe;

  startListening() {
    this.stop?.();
    this.stopAuth?.();

    const uid = this.auth.currentUser?.uid;
    if (uid) {
      this.startSnapshot(uid);
      return;
    }

    // Wait for auth state to become available
    this.loading.set(true);
    this.stopAuth = onAuthStateChanged(this.auth as any, (user) => {
      if (user?.uid) {
        this.startSnapshot(user.uid);
      } else {
        this.tasks.set([]);
        this.loading.set(false);
      }
      this.stopAuth?.();
      this.stopAuth = undefined;
    });
  }

  private startSnapshot(uid: string) {
    this.loading.set(true);
    const q = query(
      collection(this.fs, 'tasks'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    );

    this.stop = onSnapshot(q, {
      next: (snap) => {
        const tasks = snap.docs.map(d => ({ id: d.id, ...(d.data() as Task) }));
        console.log('Tasks loaded:', tasks);
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  stopListening() { 
    this.stop?.(); 
    this.stop = undefined;
    this.stopAuth?.();
    this.stopAuth = undefined;
  }

  async add(partial: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'uid' | 'done'>) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error('User must be logged in to add tasks');
    }

    const now = Date.now();
    const taskData = {
      ...partial,
      uid,
      done: false,
      createdAt: now,
      updatedAt: now
    };

    console.log('Adding task:', taskData); // Debug log
    
    const docRef = await addDoc(collection(this.fs, 'tasks'), taskData);
    return docRef.id;
  }

  async update(id: string, patch: Partial<Task>) {
    const ref = doc(this.fs, 'tasks', id);
    await updateDoc(ref, { 
      ...patch, 
      updatedAt: Date.now() 
    });
  }

  async remove(id: string) {
    await deleteDoc(doc(this.fs, 'tasks', id));
  }

  toggleDone(t: Task) {
    if (!t.id) return;
    return this.update(t.id, { done: !t.done });
  }
}