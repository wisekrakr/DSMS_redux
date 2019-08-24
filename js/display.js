/* David Damian 15/08/2019 */

/* This Display class contains the screen resize event handler and also handles
drawing colors to the buffer and then to the display. */

const Display = function(canvas, game) {

  const debug = true;

  this.game = game;
  this.buffer  = document.createElement("canvas").getContext("2d");
  this.context = canvas.getContext("2d");

  // Drawing objects with four sides
  this.drawRectangle = function(object) {

    this.buffer.fillStyle = object.color;
    this.buffer.fillRect(object.x, object.y, object.width, object.height);
    this.buffer.fillRect(object.x + object.width/6, object.y + object.height, object.width/1.5, object.height/3);
    this.buffer.fillRect(object.x + object.width/2.5, object.y - object.height/3, object.width/5, object.height/2);
  };

  // Drawing objects with three sides
  this.drawTriangle = function(object){
    this.buffer.strokeStyle = object.color;
    this.buffer.lineWidth = object.width /10;

    this.buffer.beginPath();
    //Ship's front
    this.buffer.moveTo(
      object.x + (4/3 * object.width) * Math.cos(object.angle),
      object.y - (4/3 * object.height) * Math.sin(object.angle),
    );
    //Ship's rear left
    this.buffer.lineTo(
      object.x - object.width * (2/3 * Math.cos(object.angle) + Math.sin(object.angle)),
      object.y + object.height * (2/3 * Math.sin(object.angle) - Math.cos(object.angle)),
    );
     //Ship's rear right
    this.buffer.lineTo(
      object.x - object.width * (2/3 * Math.cos(object.angle) - Math.sin(object.angle)),
      object.y + object.height * (2/3 * Math.sin(object.angle) + Math.cos(object.angle)),
    );
    this.buffer.closePath();
    this.buffer.stroke();  

  }

  // TODO: Create with two polygons to simulate a 3-d object

  // Drawing objects with multiple vertices
  this.drawPolygon = function(object) {
    this.buffer.strokeStyle = object.color;
    this.buffer.lineWidth = object.width /10;

    let vertices = object.vertices;
    let offset = object.offset;

    this.buffer.beginPath();
 
    this.buffer.moveTo(
      object.x + object.width * offset[0] * Math.cos(object.angle),
      object.y + object.height * offset[0]  * Math.sin(object.angle)
    );
    // Draw the polygon
    for(let i = vertices; i > 0; i--){
      this.buffer.lineTo(
        object.x + object.width * offset[i] * Math.cos(object.angle + i * Math.PI * 2 / vertices),
        object.y + object.height * offset[i] * Math.sin(object.angle + i * Math.PI * 2 / vertices)
      );
    }
    this.buffer.closePath();
    this.buffer.stroke();  

  };

  this.drawCircle = function(object){
    this.buffer.fillStyle = this.game.colorPicker([
      '#d62020',
      '#ffe700'
    ]);
    this.buffer.beginPath();
    this.buffer.arc(object.x, object.y, object.height, 0, Math.PI * 2, false); 
    this.buffer.fill();
  }

  this.debugBounds = function(object){
    if(debug){
      this.buffer.strokeStyle = "#3efffa";
      this.buffer.beginPath();

      if(object.tag === "Enemy"){
        this.buffer.arc(object.x + object.width/2, object.y + object.height/2, object.height, 0, Math.PI * 2, false);
      }else{        
        this.buffer.arc(object.x, object.y, object.height * 2, 0, Math.PI * 2, false);        
      }
      this.buffer.stroke();
    }
  };

  this.fill = function(color) {

    this.buffer.fillStyle = color;
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

  };

  this.rotation = function(angle){
    // // Clear the canvas
    // this.context.clearRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
      
    // Move registration point to the center of the canvas
    this.context.translate(this.buffer.canvas.width/2, this.buffer.canvas.height/2);

    // Rotate in degrees
    this.context.rotate(angle);
      
    // Move registration point back to the top left corner of canvas
    this.context.translate(-this.buffer.canvas.width/2, -this.buffer.canvas.height/2);
  }

  this.render = function() { 
       
    this.context.drawImage(
      this.buffer.canvas, 
      0, 0, 
      this.buffer.canvas.width, this.buffer.canvas.height, 
      0, 0, 
      this.context.canvas.width, this.context.canvas.height
    ); 

    
  };

  this.resize = function(width, height, height_width_ratio) {

    if (height / width > height_width_ratio) {
      this.context.canvas.height = width * height_width_ratio;
      this.context.canvas.width = width;
    } else {
      this.context.canvas.height = height;
      this.context.canvas.width = height / height_width_ratio;
    }

    this.context.imageSmoothingEnabled = false;

  };

};

Display.prototype = {

  constructor : Display

};
  