import { Component, OnInit } from '@angular/core';
import { QuizService } from '../Shared/Service/quiz.service';
import { ResultService } from '../Shared/Service/result.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  // resultAnswers:Array<any>[] = [];

  userDetails: any;
  isSubmitted = false;
  score: any;
  isLoading = false;
  // displayedColumns: string [] = ['email', 'User Name', 'Score'];

  constructor(public quizService: QuizService, public resultService: ResultService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.quizService.correctAnsCount = 0;
    this.getProfileDetails();
    this.getAnswers();
  }

  getProfileDetails() {
    this.userDetails = JSON.parse(localStorage.getItem('userData'));
    this.getTopUsersData();
  }

  getAnswers() {
    if (this.quizService.questionData) {
      this.quizService.questionData.filter(question => {
        if (question.answer === question.participantAnswer) {
          this.quizService.correctAnsCount++;
        }
      });
    }
  }

  openSnackbar(message) {
    this._snackBar.open(message, 'close', {
      duration: 3000
    });
  }

  filteredResult() {
    if (this.quizService.questionData.length) {
      const userId = this.userDetails.id;
      const questionData = this.quizService.questionData;
      const timeTaken = this.quizService.displayTimeElapsed();
      const score = this.quizService.correctAnsCount * 10;
      if (userId && questionData.length && timeTaken && score >= 0) {
        const finalData = {
          time: timeTaken,
          questionData,
          score
        };
        return { userId, finalData };
      } else {
        return null;
      }
    }
  }

  submit() {
    this.isSubmitted = true;
    const filteredData = this.filteredResult();
    if (!filteredData) {
      this.isSubmitted = false;
      return null;
    }
    this.quizService.sendResult(filteredData.userId, filteredData.finalData)
      .then(() => {
        this.openSnackbar('You results are submitted!!');
        this.getTopUsersData();
        this.isSubmitted = false;
      })
      .catch(err => {
        this.openSnackbar(err.message);
        this.isSubmitted = false;
      });
  }

  retry() {
    this.router.navigate(['/quiz']);
  }

  getTopUsersData() {
    this.isLoading = true;
    this.resultService.getTopUsers()
      .then(topUsers => {
        return topUsers.docs.map(doc => ({
          email: doc.data().email,
          username: doc.data().username,
          score: doc.data().resultData.score
        }));
    })
      .then(topUsers => {
        this.resultService.topUsers = topUsers;
        this.isLoading = false;
      }).catch(console.error);
  }

}

