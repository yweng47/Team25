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
import { ApplicationComponent } from '../pages/admin/application/application.component';
import { ApplicationComponent as InstructorApplicationComponent } from '../pages/instructor/application/application.component';
import { EnrolmentAndHourComponent } from '../pages/chair/enrolment-and-hour/enrolment-and-hour.component';
import { CourseTaComponent } from '../pages/chair/course-ta/course-ta.component';
import { TaHourComponent } from '../pages/chair/ta-hour/ta-hour.component';
import { PreferenceComponent } from '../pages/admin/preference/preference.component';
import { CourseHourComponent } from '../pages/instructor/course-hour/course-hour.component';
import { NeedTaCourseComponent } from '../pages/admin/need-ta-course/need-ta-course.component';
import { InstructorCourseTaComponent } from '../pages/instructor/instructor-course-ta/instructor-course-ta.component';
import { InstructorTaHourComponent } from '../pages/instructor/instructor-ta-hour/instructor-ta-hour.component';

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
      },
      {
        path: 'application',
        component: ApplicationComponent
      },
      {
        path: 'preference',
        component: PreferenceComponent
      },
      {
        path: 'taCourse',
        component: NeedTaCourseComponent
      }
    ]
  },
  {
    path: 'chair',
    component: ChairComponent,
    children: [
      {
        path: '',
        redirectTo: 'enrolmentHour',
        pathMatch: 'full'
      },
      {
        path: 'enrolmentHour',
        component: EnrolmentAndHourComponent
      },
      {
        path: 'courseTA',
        component: CourseTaComponent
      },
      {
        path: 'taHour/:courseId',
        component: TaHourComponent
      },
    ]
  },
  {
    path: 'instructor',
    component: InstructorAdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'application',
        pathMatch: 'full'
      },
      {
        path: 'application',
        component: InstructorApplicationComponent
      },
      {
        path: 'course',
        component: CourseComponent
      },
      {
        path: 'course-hour',
        component: CourseHourComponent
      },
      {
        path: 'courseTA',
        component: InstructorCourseTaComponent
      },
      {
        path: 'taHour/:courseId',
        component: InstructorTaHourComponent
      },
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
