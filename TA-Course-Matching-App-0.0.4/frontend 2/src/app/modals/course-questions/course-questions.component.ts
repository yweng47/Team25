import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { QuestionService } from '../../services/question.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-course-questions',
  templateUrl: './course-questions.component.html',
  styleUrls: ['./course-questions.component.css']
})
export class CourseQuestionsComponent implements OnInit {
  question: any = {};
  questions = [];

  constructor(
    public dialogRef: MatDialogRef<CourseQuestionsComponent>,
    private questionService: QuestionService,
    private userService: UserService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
    this.getQuestion();
  }

  getQuestion(): void {
    const userInfo = this.userService.userInfo;
    this.questionService.getQuestions(this.data, userInfo._id).subscribe(response => {
      if (response.code === 200) {
        if (response.data) {
          this.question = response.data;
          if (response.data.questions && response.data.questions.length > 0) {
            response.data.questions.forEach(question => {
              this.questions.push(new FormControl(question, [Validators.required]));
            });
          } else {
            this.questions.push(new FormControl('', [Validators.required]));
          }
        } else {
          this.questions.push(new FormControl('', [Validators.required]));
        }
      }
    });
  }

  removeQuestion(): void {
    this.questions.pop();
  }

  addQuestion(): void {
    this.questions.push(new FormControl('', [Validators.required]));
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    this.questions.forEach(question => {
      question.markAsDirty();
      question.updateValueAndValidity();
    });
    const invalidQuestions = this.questions.filter(question => !question.valid);
    const questions = this.questions.map(question => question.value);
    if (invalidQuestions.length === 0) {
      const userInfo = this.userService.userInfo;
      const question: any = {
        course: this.data,
        user: userInfo._id,
        questions
      };
      if (this.question._id) {
        question._id = this.question._id;
      }
      this.questionService.addOrUpdateQuestion(question).subscribe(response => {
        if (response.code === 200) {
          this.toastr.success('update course question success');
          this.dialogRef.close();
        } else {
          this.toastr.error('update course question error');
        }
      });
    }
  }
}
