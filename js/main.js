
/**
 * The load listener ensures that this code will not
 * execute until the document has finished loading and we
 * have access to all of the classes.
 */

window.addEventListener("load", function() {

    "use strict";  

    let keyDownUp = function(event) {

        controller.keyDownUp(event.type, event.keyCode);

    };    
      
    
    /**
     * Function called by the game loop every time rendering should be 
     * performed. 
     */
    let render = function() {
  
        display.fill(game.world.background_color);// Clear background to game's background color.
        
        // Give gameobjects their shape and color        

        for(let sub of game.instance.gameEngine.gameEngine.gameObjects){    
            let object = sub;
                                  
            switch(object.tag){
                case 'Player':                                                           
                    display.drawTriangle(object);     
                    // if(object.invul){
                    //     display.context.globalAlpha = 0.2;
                    //     game.world.fps = 80;
                    // }else{
                    //     display.context.globalAlpha = 1;
                    //     game.world.fps = FPS;
                    // }
                    break;
                case 'Thruster':
                    display.drawTriangle(object);     
                    break;
                case 'Planet': 
                    display.drawCircle(object, true);
                    break;
                case 'Laser': case 'Debris': 
                    display.drawCircle(object, true);
                    break;
                case 'Asteroid': case 'Meteor':                  
                    display.drawPolygon(object);                    
                    break;
                case 'Enemy': case 'Froggy':                   
                    display.drawRectangle(object);                    
                    break;                                
                default:
                    console.log(object.tag + " :has no shape")
            } 
        }

        display.render();  
    };
  
    /**
     * Game logic updates are performed in this function.
     * Player movement, removing objects and clearing of canvas is also done here.
     */
    let update = function() {   
         
        // Player Controls
        if (controller.left.active)  { game.world.player.moveLeft();}
        if (controller.right.active) { game.world.player.moveRight(); }
        if (controller.up.active)    { game.world.player.forward();  }        
        
             
        // Remove gameobjects
        if(game.instance.gameEngine.gameEngine.toBeRemoved.length > 0){
            for(let sub of game.instance.gameEngine.gameEngine.toBeRemoved){   
                let object = sub;                
                
                if(object !== undefined){
                   
                    display.context.clearRect(
                        object.x,
                        object.y,
                        object.width,
                        object.height
                    );

                    game.instance.gameEngine.gameEngine.toBeRemoved.delete(object);
                }
            }
        }

        if(!controller.paused){
            game.update();  
        }
    };
   
    
    /**
     * Resizing of the canvas and render it accordingly
     */
    let resize = function() {

      display.resize(
          document.documentElement.clientWidth - 32, 
          document.documentElement.clientHeight - 32, 
          game.height / game.width
      );
      display.render();

    };
  
    // Initialize Components  
    
    /* The controller handles user input. */
    let controller = new Controller();        
    /* The engine is where the above three sections can interact. */
    let engine = new Engine(1000/FPS, render, update);        
    /* The game will hold our game logic. */
    let game = new Game(engine); 
    /* The display handles window resizing, as well as the on screen canvas. */
    let display = new Display(document.querySelector("canvas"), game);
     

    /* Every pixel must be the same
    size as the world dimensions to properly scale the graphics. */
    display.buffer.canvas.width = game.width;
    display.buffer.canvas.height = game.height; 
  
    window.addEventListener("resize",  resize);
    window.addEventListener("keydown", keyDownUp);
    window.addEventListener("keyup",   keyDownUp); 
    
    resize(); 

    engine.start(); // Start the game       
});
  