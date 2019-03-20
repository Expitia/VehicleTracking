import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { BaseComponent } from 'src/app/views/base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent extends BaseComponent implements OnInit {
  @Input() fieldName: string;
  @Input() nestedForm: FormGroup;
  @Input() formSubmitted: boolean;

  distances: Array<Number> = [10, 20];

  /**
   * @private
   * @method constructor
   */
  constructor(
    router: Router,
    formBuilder: FormBuilder
  ) {
    super(router, formBuilder);
  }


  ngOnInit() {
    debugger
    this.nestedForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      type: [null, Validators.required],
      model: [null, Validators.required],
      configurations: this.formBuilder.array([this.addConfigurationsGroup()])
    });
    debugger
  }

  addConfigurationsGroup() {
    return this.createForm(["horometer", "hours", "distance"], {
      horometer: {
        minlength: "",
        maxlength: "",
        required: false,
        messages: {
          label: "",
          placeholder: "Unidades de horometro entre mantenimientos",
          minlength: "",
          maxlength: "",
          required: ""
        }
      },
      hours: {
        minlength: "",
        maxlength: "",
        required: false,
        messages: {
          label: "",
          placeholder: "Horas entre mantenimientos",
          minlength: "",
          maxlength: "",
          required: ""
        }
      },
      distance: {
        minlength: "",
        maxlength: "",
        required: false,
        messages: {
          label: "",
          placeholder: "Distancia recorrida entre mantenimientos",
          minlength: "",
          maxlength: "",
          required: ""
        }
      }
    }).form;
  }

  addConfiguration() {
    this.configurationsArray.push(this.addConfigurationsGroup());
  }
  removeConfiguration(index) {
    this.configurationsArray.removeAt(index);
  }
  get configurationsArray() {
    return <FormArray>this.nestedForm.get('configurations');
  }
}
