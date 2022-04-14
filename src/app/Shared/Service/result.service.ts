import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserScoreModal } from '../modal/user-score.modal';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { QuestionModal } from '../modal/question.modal';


@Injectable({
  providedIn: 'root'
})
export class ResultService {
  topUsers: UserScoreModal[] = [];
  constructor(private http: HttpClient, private fireStore: AngularFirestore, public router: Router) {}

  getTopUsers() {
    return this.fireStore.collection('userData').ref.orderBy('resultData.score', 'desc').limit(10).get();
  }
}
