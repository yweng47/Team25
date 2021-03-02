import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { AdminComponent } from '../pages/admin/admin.component';
import { InstructorComponent } from '../pages/admin/instructor/instructor.component';
import { SignUpComponent } from '../pages/sign-up/sign-up.component';
import { ChairComponent } from '../pages/chair/chair.component';
import { InstructorComponent as InstructorAdminComponent } from '../pages/instructor/instructor.component';
import { CourseComponent } from '../pages/instructor/course/course.component';
import { QuestionComponent } from '../pages/admin/question/question.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'instructor',
        pathMatch: 'full'
      },
      {
        path: 'instructor',
        component: InstructorComponent
      },
      {
        path: 'question',
        component: QuestionComponent
      }
    ]
  },
  {
    path: 'chair',
    component: ChairComponent,
  },
  {
    path: 'instructor',
    component: InstructorAdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'course',
        pathMatch: 'full'
      },
      {
        path: 'course',
        component: CourseComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
