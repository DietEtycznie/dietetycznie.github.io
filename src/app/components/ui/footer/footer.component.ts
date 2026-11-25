import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BrandLogoComponent } from "../brand-logo/brand-logo.component";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [RouterLink, BrandLogoComponent],
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
  @Input() withMargin = false;
}
