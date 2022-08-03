export class CanvasControl {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.startPoint = document.body.clientWidth / 4;
    this.endPoint = this.startPoint * 2;
    this.centerY = document.body.clientHeight / 2;
    this.barWidht = 5;
    this.barHeight = [];
  }

  update(bufferLength, dataArray) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    let barWidth = 12;
    this.barHeight = [];
    let x = 0;
    let rectCenterY = document.body.clientHeight / 2;
    
    for (let i = 0; i < bufferLength; i++) {
      this.barHeight[i] = dataArray[i];
      this.ctx.fillRect(
        x,
        rectCenterY,
        barWidth,
        0 - this.barHeight[i] / 3
        // this.barHeight[i] / 10 - this.canvas.height / 25
      );
      this.ctx.fillRect(x, rectCenterY, barWidth, this.barHeight[i] / 3);
    //   this.ctx.fillRect(x, rectCenterY, barWidth, this.barHeight[i] + this.rectCenterY );

      x += barWidth + this.canvas.clientWidth / 10;
    }

    
    
  }

  
}
