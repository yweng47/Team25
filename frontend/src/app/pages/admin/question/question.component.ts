import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../services/question.service';
import * as XLSX from 'xlsx';
import { WritingOptions } from 'xlsx';

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
    this.startToDownload(this.sheet2blob(workSheet), 'CourseQuestions.xlsx');
  }

  sheet2blob(sheet): Blob {
    const workbook = {
      SheetNames: ['sheet1'],
      Sheets: {
        sheet1: sheet
      }
    };

    const wopts: WritingOptions = {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    };
    const wbout = XLSX.write(workbook, wopts);
    const blob = new Blob([s2ab(wbout)], {
      type: 'application/octet-stream'
    });
    function s2ab(s: any): ArrayBuffer {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF; }
      return buf;
    }
    return blob;
  }

  startToDownload(url, saveName): void {
    if (typeof url === 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url);
    }
    const aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || '';
    let event;
    if (window.MouseEvent) {
      event = new MouseEvent('click');
    }
    else {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
  }
}

