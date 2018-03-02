import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TestCase } from './model';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

@Component({
  selector:    'app-root',
  templateUrl: 'app.component.html',
  styleUrls:   ['app.component.css']
})
export class AppComponent {

  public tests: TestCase[] = [];

  constructor(private http: HttpClient, private ref: ChangeDetectorRef) {
  }

  public dropped(event: UploadEvent) {

    const files: UploadFile[] = event.files;

    for (const file of files) {
      file.fileEntry.file(info => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const test: TestCase = JSON.parse(e.target.result);
          this.addTest(test);

          this.ref.detectChanges();
        };
        reader.readAsText(info);
      });

    }
  }

  private addTest(test: TestCase) {
    for (let i = 0; i < this.tests.length; i++) {
      if (this.tests[i].uuid === test.uuid) {
        this.tests[i] = test;
        return;
      }
    }
    this.tests.push(test);
  }

  public getDateDetails(test: TestCase) {
    if (test) {
      const date = new Date();
      date.setTime(test.start);
      const duration = test.stop - test.start;
      return this.formatDate(date) + '    (Duration ' + duration + ' ms)';
    }
    return '-';
  }

  private formatDate(date: Date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let sMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
    let strTime = hours + ':' + sMinutes + ' ' + ampm;
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + strTime;
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

}
