import { FormGroup, FormControl } from "@angular/forms";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-textfield",
  templateUrl: "./textfield.component.html",
  styleUrls: ["./textfield.component.css"]
})
export class TextfieldComponent implements OnInit {
  @Input() fieldName: string;
  @Input() showHelp: boolean;
  @Input() inputType: string;
  @Input() inputForm: FormGroup;
  @Input() formSubmitted: boolean;
  @Input() validationLengths: any;
  @Input() fieldNameLabel: string;
  @Input() validationMessages: any;
  @Input() readOnly: boolean = false;
  @Input() disabled: boolean = false;

  constructor() {}

  ngOnInit() {}

  onKeyPress(event: any) {}

  onBlurMethod(event: any) {}
}
