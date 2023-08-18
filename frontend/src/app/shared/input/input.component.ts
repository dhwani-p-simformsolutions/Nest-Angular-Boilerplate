import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() control!: FormControl;
  @Input() inputType: string | undefined;
  @Input() label: string | undefined;
  @Input() controlType = 'input';

  showErrors() {
    return (this.control.touched || this.control.dirty) && this.control.errors;
  }
}
