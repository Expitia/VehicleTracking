import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  @Input() fieldName: string;
  @Input() inputForm: FormGroup;
  @Input() validationLengths:any;
  @Input() formSubmitted: boolean;
  @Input() validationMessages: any;
  @Input() fieldNameLabel: string;
  
  constructor() { }

  ngOnInit() { }

}
