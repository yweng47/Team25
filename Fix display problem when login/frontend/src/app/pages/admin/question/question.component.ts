import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../services/question.service';
import * as XLSX from 'xlsx';
import { sheet2blob, startToDownload } from '../../../utils/utils';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  questions = [];
  displayedColumns: string[] = ['course', 'user_name', 'user_email', 'question_num', 'create_time'];

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.getQuestions();
  }

  getQuestions(): void {
    this.questionService.getQuestions().subscribe(response => {
      if (response.code === 200) {
        this.questions = response.data;
      }
    });
  }

  download(): void {
    const questionData = this.questions.map(question => {
      const courseCode = question.courses[0].subject + question.courses[0].catalog;
      const userName = question.users[0].name;
      const userEmail = question.users[0].email;
      const questions = question.questions;
      return [ courseCode, userName, userEmail, ...questions ];
    });
    const wsData = [
      [ 'Course Code', 'Applicant Name', 'Applicant email', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10' ],
      ...questionData
    ];
    const workSheet = XLSX.utils.aoa_to_sheet(wsData);
    startToDownload(sheet2blob(workSheet), 'CourseQuestions.xlsx');
  }
}

