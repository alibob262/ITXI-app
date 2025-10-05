import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import TasksListComponent from './components/tasks-list/tasks-list.component';

export const routes: Routes = [

    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'tasks', component: TasksListComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },


];
