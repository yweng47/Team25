import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './pages/login/login.component';
import { AppRoutingModule } from './router/router.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './pages/admin/admin.component';
import { InstructorComponent } from './pages/admin/instructor/instructor.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { InviteComponent } from './modals/invite/invite.component';
import { NoticeComponent } from './modals/notice/notice.component';
import { ChairComponent } from './pages/chair/chair.component';
import { InstructorComponent as InstructorAdminComponent } from './pages/instructor/instructor.component';
import { QuillModule } from 'ngx-quill';
import { CourseComponent } from './pages/instructor/course/course.component';
import { EditCourseComponent } from './modals/edit-course/edit-course.component';
import { CourseQuestionsComponent } from './modals/course-questions/course-questions.component';
import { QuestionComponent } from './pages/admin/question/question.component';
import { ApplicationComponent } from './pages/admin/application/application.component';
import { ApplicationComponent as InstructorApplicationComponent } from './pages/instructor/application/application.component';
import { NgxSortableModule } from 'ngx-sortable';
import { EnrolmentAndHourComponent } from './pages/chair/enrolment-and-hour/enrolment-and-hour.component';
import { CourseTaComponent } from './pages/chair/course-ta/course-ta.component';
import { TaHourComponent } from './pages/chair/ta-hour/ta-hour.component';
import { TsCourseComponent } from './modals/ts-course/ts-course.component';
import { PreferenceComponent } from './pages/admin/preference/preference.component';
import { CourseHourComponent } from './pages/instructor/course-hour/course-hour.component';
import { EditTaHoursComponent } from './modals/edit-ta-hours/edit-ta-hours.component';
import { NeedTaCourseComponent } from './pages/admin/need-ta-course/need-ta-course.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    InstructorComponent,
    SignUpComponent,
    InviteComponent,
    NoticeComponent,
    ChairComponent,
    InstructorAdminComponent,
    CourseComponent,
    EditCourseComponent,
    CourseQuestionsComponent,
    QuestionComponent,
    ApplicationComponent,
    InstructorApplicationComponent,
    EnrolmentAndHourComponent,
    CourseTaComponent,
    TaHourComponent,
    TsCourseComponent,
    PreferenceComponent,
    CourseHourComponent,
    EditTaHoursComponent,
    NeedTaCourseComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    QuillModule.forRoot(),
    FormsModule,
    NgxSortableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
