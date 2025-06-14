import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-presentation-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./presentation-header.component.html",
  styleUrls: ["./presentation-header.component.scss"],
})
export class PresentationHeaderComponent {
  @Input() title = "";
  @Input() description = "";
}
