import { FormGroup, FormControl } from "@angular/forms";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-selectfield",
  templateUrl: "./selectfield.component.html",
  styleUrls: ["./selectfield.component.css"]
})
export class SelectfieldComponent implements OnInit {
  @Input() fieldName: string;
  @Input() showHelp: boolean;
  @Input() inputForm: FormGroup;
  @Input() options: Array<any>;
  @Input() formSubmitted: boolean;
  @Input() validationMessages: any;
  @Input() disabled: boolean = false;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {}

  onClickOption(event: any) {}

  onBlurMethod(event: any) {}
}
