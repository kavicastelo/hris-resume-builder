import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeStorageService {

  private storageKey = 'resumeData';

  constructor() {}

  saveData(step: string, data: any): void {
    let resumeData = this.getData();
    resumeData[step] = data;
    localStorage.setItem(this.storageKey, JSON.stringify(resumeData));
  }

  getData(): any {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  clearData(): void {
    localStorage.removeItem(this.storageKey);
  }
}
