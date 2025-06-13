import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatCheckbox } from "@angular/material/checkbox";
import { TitleCasePipe } from "@angular/common";

@Component({
  selector: "app-checkbox-group",
  templateUrl: "./checkbox-group.component.html",
  styleUrls: ["./checkbox-group.component.scss"],
  standalone: true,
  imports: [MatCheckbox, TitleCasePipe],
})
export class CheckboxGroupComponent {
  @Input() options: string[] = [];
  @Input() selected: string[] = [];
  @Output() selectedChange = new EventEmitter<string[]>();

  onCheckboxChange(option: string, checked: boolean) {
    let newSelected = [...this.selected];
    if (checked) {
      if (!newSelected.includes(option)) {
        newSelected.push(option);
      }
    } else {
      newSelected = newSelected.filter((item) => item !== option);
    }
    this.selectedChange.emit(newSelected);
  }
}
