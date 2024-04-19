class DrawingApp {
    constructor(canvasSelector, toolSelector, fillColorSelector, sizeSliderSelector, colorSelector, colorPickerSelector, clearCanvasSelector, saveImgSelector) {
        // Initialize the DrawingApp with required elements from the HTML document
        this.canvas = document.querySelector(canvasSelector); // Canvas element for drawing
        this.toolBtns = document.querySelectorAll(toolSelector); // Buttons for selecting drawing tools
        this.fillColor = document.querySelector(fillColorSelector); // Checkbox for fill color option
        this.sizeSlider = document.querySelector(sizeSliderSelector); // Slider for brush size
        this.colorBtns = document.querySelectorAll(colorSelector); // Buttons for selecting colors
        this.colorPicker = document.querySelector(colorPickerSelector); // Color picker for custom color selection
        this.saveImg = document.querySelector(saveImgSelector); // Button for saving the drawing as an image
        this.ctx = this.canvas.getContext("2d"); // 2D rendering context for drawing operations

        // Default values and state variables
        this.prevMouseX = 0; // Previous mouse X-coordinate
        this.prevMouseY = 0; // Previous mouse Y-coordinate
        this.snapshot = null; // Snapshot of canvas state for undo functionality
        this.isDrawing = false; // Flag indicating if drawing action is in progress
        this.selectedTool = "brush"; // Default selected drawing tool
        this.brushWidth = 5; // Default brush size
        this.selectedColor = "#000"; // Default selected color

        // Initialize event listeners and set canvas background
        this.initEventListeners();
        this.setCanvasBackground();
    }

    // Method to initialize event listeners for various UI elements
    initEventListeners() {
        // Adjust canvas size on window load to match its container
        window.addEventListener("load", () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        });

        // Event listener for selecting drawing tools
        this.toolBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Toggle active class for selected tool button
                this.toolBtns.forEach(toolBtn => toolBtn.classList.remove("active"));
                btn.classList.add("active");
                // Set selected tool based on clicked button's ID
                this.selectedTool = btn.id;
            });
        });

        // Event listener for changing brush size via slider
        this.sizeSlider.addEventListener("change", () => this.brushWidth = this.sizeSlider.value);

        // Event listener for selecting colors from predefined options
        this.colorBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Toggle selected class for selected color button
                this.colorBtns.forEach(colorBtn => colorBtn.classList.remove("selected"));
                btn.classList.add("selected");
                // Get selected color from button's background color
                this.selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
            });
        });

        // Event listener for selecting custom color using color picker
        this.colorPicker.addEventListener("change", () => {
            // Update color picker display and selected color
            this.colorPicker.parentElement.style.background = this.colorPicker.value;
            this.colorPicker.parentElement.click(); // Trigger click event to update selected color
        });


        // Event listener for saving the drawing as an image
        this.saveImg.addEventListener("click", () => {
            // Create a link element to trigger download of canvas image
            const link = document.createElement("a");
            link.download = `${Date.now()}.jpg`; // Set filename with timestamp
            link.href = this.canvas.toDataURL(); // Set image data URL as download link
            link.click(); // Trigger click event to initiate download
        });

        // Event listeners for mouse actions on canvas
        this.canvas.addEventListener("mousedown", this.startDraw.bind(this)); // Start drawing on mouse down
        this.canvas.addEventListener("mousemove", this.drawing.bind(this)); // Continue drawing on mouse move
        this.canvas.addEventListener("mouseup", () => this.isDrawing = false); // Stop drawing on mouse up
    }

    // Method to set canvas background color
    setCanvasBackground() {
        // Fill canvas with white background
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Set default drawing color
        this.ctx.fillStyle = this.selectedColor;
    }

    // Method to draw rectangle based on mouse movement
    drawRect(e) {
        if (!this.fillColor.checked) {
            // Draw rectangle outline if fill option is unchecked
            return this.ctx.strokeRect(e.offsetX, e.offsetY, this.prevMouseX - e.offsetX, this.prevMouseY - e.offsetY);
        }
        // Draw filled rectangle if fill option is checked
        this.ctx.fillRect(e.offsetX, e.offsetY, this.prevMouseX - e.offsetX, this.prevMouseY - e.offsetY);
    }

    // Method to draw circle based on mouse movement
    drawCircle(e) {
        this.ctx.beginPath();
        let radius = Math.sqrt(Math.pow((this.prevMouseX - e.offsetX), 2) + Math.pow((this.prevMouseY - e.offsetY), 2));
        this.ctx.arc(this.prevMouseX, this.prevMouseY, radius, 0, 2 * Math.PI);
        this.fillColor.checked ? this.ctx.fill() : this.ctx.stroke();
    }

    // Method to draw triangle based on mouse movement
    drawTriangle(e) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevMouseX, this.prevMouseY);
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.lineTo(this.prevMouseX * 2 - e.offsetX, e.offsetY);
        this.ctx.closePath();
        this.fillColor.checked ? this.ctx.fill() : this.ctx.stroke();
    }

    // Method to initialize drawing on mouse down
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

    // Method to continue drawing on mouse move
    drawing(e) {
        if (!this.isDrawing) return;
        this.ctx.putImageData(this.snapshot, 0, 0);

        // Handle drawing based on selected tool
        if (this.selectedTool === "brush" || this.selectedTool === "eraser") {
            // Draw with brush or eraser tool
            this.ctx.strokeStyle = this.selectedTool === "eraser" ? "#fff" : this.selectedColor;
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.stroke();
        } else if (this.selectedTool === "rectangle") {
            // Draw rectangle
            this.drawRect(e);
        } else if (this.selectedTool === "circle") {
            // Draw circle
            this.drawCircle(e);
        } else {
            // Draw triangle
            this.drawTriangle(e);
        }
    }
}

// Create an instance of DrawingApp with specified selectors
const drawingApp = new DrawingApp("canvas", ".tool", "#fill-color", "#size-slider", ".colors .option", "#color-picker", ".save-img");
