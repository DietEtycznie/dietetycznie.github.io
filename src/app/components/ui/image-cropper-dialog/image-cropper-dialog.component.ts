import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

export interface CroppedImageResult {
  dataUrl: string;
  borderRadiusPercent: number;
  width: number;
  height: number;
}

@Component({
  selector: "app-image-cropper-dialog",
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: "./image-cropper-dialog.component.html",
  styleUrls: ["./image-cropper-dialog.component.scss"],
})
export class ImageCropperDialogComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() initialImageUrl = "";
  @Input() recipeTitle = "";

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CroppedImageResult>();

  @ViewChild("fileInput") fileInput?: ElementRef<HTMLInputElement>;

  readonly stageSize = 300;
  readonly sizePresets: { label: string; size: number }[] = [
    { label: "600 px", size: 600 },
    { label: "800 px · HD", size: 800 },
    { label: "1024 px · Ultra", size: 1024 },
  ];

  sourceDataUrl = "";
  naturalWidth = 0;
  naturalHeight = 0;
  baseScale = 1;

  zoom = 1;
  offsetX = 0;
  offsetY = 0;
  rotation = 0;
  borderRadius = 50; // 0 (sharp square) to 50 (perfect circle)
  outputSize = 800;
  webpQuality = 0.92;

  isDragging = false;
  isFileDragOver = false;
  errorMessage = "";
  private dragStartX = 0;
  private dragStartY = 0;
  private dragStartOffsetX = 0;
  private dragStartOffsetY = 0;
  private loadedImg: HTMLImageElement | null = null;

  readonly radiusPresets: { label: string; value: number }[] = [
    { label: "Koło", value: 50 },
    { label: "Zaokrąglony", value: 24 },
    { label: "Lekki", value: 10 },
    { label: "Kwadrat", value: 0 },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isOpen"]?.currentValue === true) {
      this.errorMessage = "";
      if (this.initialImageUrl) {
        this.loadImageFromUrl(this.initialImageUrl);
      } else {
        this.clearImage();
      }
    }
    if (changes["isOpen"]?.currentValue === false) {
      this.isDragging = false;
    }
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  @HostListener("window:pointermove", ["$event"])
  onWindowPointerMove(event: PointerEvent): void {
    if (!this.isDragging || !this.loadedImg) return;
    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;
    this.offsetX = this.dragStartOffsetX + dx;
    this.offsetY = this.dragStartOffsetY + dy;
    this.clampOffsets();
  }

  @HostListener("window:pointerup")
  onWindowPointerUp(): void {
    this.isDragging = false;
  }

  triggerFilePicker(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.readImageFile(file);
    }
    input.value = "";
  }

  onFileDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isFileDragOver = true;
  }

  onFileDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isFileDragOver = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isFileDragOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      this.readImageFile(file);
    } else if (file) {
      this.errorMessage = "Wybierz plik graficzny (PNG, JPG, WebP).";
    }
  }

  private readImageFile(file: File): void {
    if (!file.type.startsWith("image/")) {
      this.errorMessage = "Obsługiwane są tylko obrazy (PNG, JPG, WebP).";
      return;
    }
    this.errorMessage = "";
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        this.loadImageFromUrl(reader.result);
      }
    };
    reader.onerror = () => {
      this.errorMessage = "Nie udało się odczytać pliku.";
    };
    reader.readAsDataURL(file);
  }

  loadImageFromUrl(url: string): void {
    this.errorMessage = "";
    const img = new Image();
    if (url.startsWith("http://") || url.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => {
      this.loadedImg = img;
      this.sourceDataUrl = url;
      this.naturalWidth = img.naturalWidth || img.width;
      this.naturalHeight = img.naturalHeight || img.height;

      // Cover the stage square by default so user can pan & zoom cleanly
      const minDim = Math.min(this.naturalWidth, this.naturalHeight) || 1;
      this.baseScale = this.stageSize / minDim;
      this.zoom = 1;
      this.offsetX = 0;
      this.offsetY = 0;
      this.rotation = 0;
    };
    img.onerror = () => {
      this.errorMessage =
        "Nie udało się wczytać zdjęcia (sprawdź CORS lub wgraj plik z dysku).";
    };
    img.src = url;
  }

  onStagePointerDown(event: PointerEvent): void {
    if (!this.loadedImg) return;
    event.preventDefault();
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.dragStartOffsetX = this.offsetX;
    this.dragStartOffsetY = this.offsetY;
  }

  onStageWheel(event: WheelEvent): void {
    if (!this.loadedImg) return;
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.08 : -0.08;
    this.setZoom(this.zoom + delta);
  }

  setZoom(val: number): void {
    this.zoom = Math.min(3, Math.max(0.6, Number(val.toFixed(2))));
    this.clampOffsets();
  }

  rotateBy(deg: number): void {
    this.rotation = (this.rotation + deg + 360) % 360;
    this.clampOffsets();
  }

  setRadiusPreset(val: number): void {
    this.borderRadius = val;
  }

  resetTransform(): void {
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.rotation = 0;
  }

  clearImage(): void {
    this.sourceDataUrl = "";
    this.loadedImg = null;
    this.resetTransform();
  }

  private clampOffsets(): void {
    if (!this.loadedImg) return;
    const isRotated = this.rotation % 180 !== 0;
    const w = (isRotated ? this.naturalHeight : this.naturalWidth) * this.baseScale * this.zoom;
    const h = (isRotated ? this.naturalWidth : this.naturalHeight) * this.baseScale * this.zoom;
    const maxX = Math.max(this.stageSize * 0.4, (w - this.stageSize) / 2 + 40);
    const maxY = Math.max(this.stageSize * 0.4, (h - this.stageSize) / 2 + 40);
    this.offsetX = Math.max(-maxX, Math.min(maxX, this.offsetX));
    this.offsetY = Math.max(-maxY, Math.min(maxY, this.offsetY));
  }

  get previewTransform(): string {
    const scale = this.baseScale * this.zoom;
    return `translate(-50%, -50%) translate(${this.offsetX}px, ${this.offsetY}px) rotate(${this.rotation}deg) scale(${scale})`;
  }

  get previewCardTransform(): string {
    // Mini recipe card preview is 150px wide (half of 300px stage)
    const ratio = 150 / this.stageSize;
    const scale = this.baseScale * this.zoom * ratio;
    return `translate(-50%, -50%) translate(${this.offsetX * ratio}px, ${this.offsetY * ratio}px) rotate(${this.rotation}deg) scale(${scale})`;
  }

  get radiusLabel(): string {
    if (this.borderRadius >= 50) return "50% · kółko";
    if (this.borderRadius === 0) return "0% · kwadrat";
    return `${this.borderRadius}%`;
  }

  private renderToCanvas(mimeType: "image/webp" | "image/png" = "image/webp"): string | null {
    if (!this.loadedImg) return null;

    const size = this.outputSize;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const radiusPx = (this.borderRadius / 100) * size;

    ctx.clearRect(0, 0, size, size);
    ctx.save();

    // Clip to rounded rectangle or circle with transparent outer corners
    this.traceRoundedRect(ctx, 0, 0, size, size, radiusPx);
    ctx.clip();

    const ratio = size / this.stageSize;
    const drawScale = this.baseScale * this.zoom * ratio;

    ctx.translate(size / 2 + this.offsetX * ratio, size / 2 + this.offsetY * ratio);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.scale(drawScale, drawScale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      this.loadedImg,
      -this.naturalWidth / 2,
      -this.naturalHeight / 2,
      this.naturalWidth,
      this.naturalHeight,
    );
    ctx.restore();

    try {
      const encoded =
        mimeType === "image/webp"
          ? canvas.toDataURL("image/webp", this.webpQuality)
          : canvas.toDataURL("image/png");
      // Fallback to PNG if browser doesn't support WebP encoding
      if (mimeType === "image/webp" && !encoded.startsWith("data:image/webp")) {
        return canvas.toDataURL("image/png");
      }
      return encoded;
    } catch {
      this.errorMessage =
        "Przeglądarka zablokowała eksport zewnętrznego zdjęcia (CORS). Zapisz obraz na dysku i wgraj go tutaj.";
      return null;
    }
  }

  private traceRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    if (radius >= Math.min(w, h) / 2 - 0.5) {
      ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
      ctx.closePath();
      return;
    }
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  downloadPng(): void {
    const dataUrl = this.renderToCanvas("image/png");
    if (!dataUrl) return;
    const slug = (this.recipeTitle || "przepis")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${slug || "przepis"}.png`;
    a.click();
  }

  applyCrop(): void {
    const dataUrl = this.renderToCanvas("image/webp");
    if (!dataUrl) return;
    this.saved.emit({
      dataUrl,
      borderRadiusPercent: this.borderRadius,
      width: this.outputSize,
      height: this.outputSize,
    });
  }

  close(): void {
    this.closed.emit();
  }
}
