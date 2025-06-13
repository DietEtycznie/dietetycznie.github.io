import { Component, Input } from "@angular/core";
import { TitleCasePipe, NgFor } from "@angular/common";

@Component({
  selector: "app-pills",
  templateUrl: "./pills.component.html",
  styleUrls: ["./pills.component.scss"],
  standalone: true,
  imports: [TitleCasePipe, NgFor],
})
export class PillsComponent {
  @Input() list: string[] = [];
  @Input() prefix: string = "";
  @Input() active: boolean = false;
  @Input() small: boolean = false;
}
