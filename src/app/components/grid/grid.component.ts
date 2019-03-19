import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {
  @Input() fieldName: string;
  @Input() nestedForm: FormGroup;
  @Input() formSubmitted: boolean;

  distances: Array<Number> = [10, 20];
  
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.nestedForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      type: [null, Validators.required],
      model: [null, Validators.required],
      configurations: this.formBuilder.array([this.addConfigurationsGroup()])
    });
  }

  addConfigurationsGroup() {
    return this.formBuilder.group({
      horometer: [null, Validators.required],
      hours: [null, Validators.required],
      distance: [null, Validators.required]
    });
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

  get name() {
    return this.nestedForm.get('name');
  }

  get type() {
    return this.nestedForm.get('type');
  }

  get model() {
    return this.nestedForm.get('model');
  }

  submitHandler() {
    if (this.nestedForm.valid) {
      console.log({...this.nestedForm.value});
    }

  }
}
