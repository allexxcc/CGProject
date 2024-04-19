class DrawingApp {
    constructor(canvasSelector, toolSelector, fillColorSelector, sizeSliderSelector, colorSelector, colorPickerSelector, saveImgSelector) {
        
        this.canvas = document.querySelector(canvasSelector); 
        this.toolBtns = document.querySelectorAll(toolSelector); 
        this.fillColor = document.querySelector(fillColorSelector); 
        this.sizeSlider = document.querySelector(sizeSliderSelector); 
        this.colorBtns = document.querySelectorAll(colorSelector); 
        this.colorPicker = document.querySelector(colorPickerSelector); 
        this.saveImg = document.querySelector(saveImgSelector); 
        this.ctx = this.canvas.getContext("2d"); 

        
        this.prevMouseX = 0; 
        this.prevMouseY = 0; 
        this.snapshot = null; 
        this.isDrawing = false; 
        this.selectedTool = "brush"; 
        this.brushWidth = 5; 
        this.selectedColor = "#000"; 

        
        this.initEventListeners();
        this.setCanvasBackground();
    }

    
    initEventListeners() {
        
        window.addEventListener("load", () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        });

        
        this.toolBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                
                this.toolBtns.forEach(toolBtn => toolBtn.classList.remove("active"));
                btn.classList.add("active");
                
                this.selectedTool = btn.id;
            });
        });

        
        this.sizeSlider.addEventListener("change", () => this.brushWidth = this.sizeSlider.value);

        
        this.colorBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                
                this.colorBtns.forEach(colorBtn => colorBtn.classList.remove("selected"));
                btn.classList.add("selected");
                
                this.selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
            });
        });

        
        this.colorPicker.addEventListener("change", () => {
            
            this.colorPicker.parentElement.style.background = this.colorPicker.value;
            this.colorPicker.parentElement.click(); 
        });

        
        this.saveImg.addEventListener("click", () => {
            
            const link = document.createElement("a");
            link.download = `${Date.now()}.jpg`; 
            link.href = this.canvas.toDataURL(); 
            link.click(); 
        });

        
        this.canvas.addEventListener("mousedown", this.startDraw.bind(this)); 
        this.canvas.addEventListener("mousemove", this.drawing.bind(this)); 
        this.canvas.addEventListener("mouseup", () => this.isDrawing = false); 
    }

    
    setCanvasBackground() {
        
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = this.selectedColor;
    }

    
    drawRect(e) {
        if (!this.fillColor.checked) {
            
            return this.ctx.strokeRect(e.offsetX, e.offsetY, this.prevMouseX - e.offsetX, this.prevMouseY - e.offsetY);
        }
        
        this.ctx.fillRect(e.offsetX, e.offsetY, this.prevMouseX - e.offsetX, this.prevMouseY - e.offsetY);
    }

    
    drawCircle(e) {
        this.ctx.beginPath();
        let radius = Math.sqrt(Math.pow((this.prevMouseX - e.offsetX), 2) + Math.pow((this.prevMouseY - e.offsetY), 2));
        this.ctx.arc(this.prevMouseX, this.prevMouseY, radius, 0, 2 * Math.PI);
        this.fillColor.checked ? this.ctx.fill() : this.ctx.stroke();
    }

    
    drawTriangle(e) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevMouseX, this.prevMouseY);
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.lineTo(this.prevMouseX * 2 - e.offsetX, e.offsetY);
        this.ctx.closePath();
        this.fillColor.checked ? this.ctx.fill() : this.ctx.stroke();
    }

    
    startDraw(e) {
        this.isDrawing = true;
        this.prevMouseX = e.offsetX;
        this.prevMouseY = e.offsetY;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.brushWidth;
        this.ctx.strokeStyle = this.selectedColor;
        this.ctx.fillStyle = this.selectedColor;
        this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    
    drawing(e) {
        if (!this.isDrawing) return;
        this.ctx.putImageData(this.snapshot, 0, 0);

        
        if (this.selectedTool === "brush" || this.selectedTool === "eraser") {
            
            this.ctx.strokeStyle = this.selectedTool === "eraser" ? "#fff" : this.selectedColor;
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.stroke();
        } else if (this.selectedTool === "rectangle") {
            
            this.drawRect(e);
        } else if (this.selectedTool === "circle") {
            
            this.drawCircle(e);
        } else {
            
            this.drawTriangle(e);
        }
    }
}


const drawingApp = new DrawingApp("canvas", ".tool", "#fill-color", "#size-slider", ".colors .option", "#color-picker", ".save-img");
