/**
 * A Planet to protect from meteors. Will scroll in screen from the sides.
 * 
 * @param  {} game Holds the game world. Creates a new instance of the Game Engine
 * @param  {} x position on x-axis
 * @param  {} y position on y-axis
 */
  
const Planet = function(game) {

    this.tag        = "Planet";
    this.tag_nr      = Math.random();
    this.color      = "#000000";
    this.width      = AS_WIDTH*2;    
    this.height     = AS_HEIGHT*2;  
    this.init_width = AS_WIDTH*2;
    this.init_height= AS_HEIGHT*2;   
    this.x          = 0;
    this.y          = HEIGHT/2; 
    this.angle      = 0;
    this.speed      = 100/ FPS;
    this.velocity_x = 100 / FPS;
    this.velocity_y = 0;   
    this.health     = 800;   
    this.game       = game;  

    this.game.gameEngine.addObject(this);
    this.color = this.game.colorPicker([
        "#a2eeec", "#b8c7ff", "#f9b5c6", "#f9e796", "#fdd8c4"
    ]);
};

Planet.prototype = {

    constructor : Planet,  
    collided_with:null,  
    send_message:false,
    explode_time:EXPLODE_TIME*2,
    my_messages:[
        fail=[
            "ow this hurts",
            "why? Flubelie! WHY?!?!",
            "awww too bad"
        ],
        win=[
            "our world thanks you",
            "hail to our champion",
            "you're so sexy!"
        ]    
    ],
    blink_time : Math.ceil(BLINK_TIME * FPS), // Time the planet blinks when invulnerable  
    hit: false,
    

    /**
    * If the Planet collides this will return true and also sets a collision object
    */
    collide: function () {       
        if(this.game.gameEngine.collisionObject(this) instanceof Meteor){   
              
            this.collided_with = this.game.gameEngine.collisionObject(this);

            return true;
      }    
      return false;      
    },

    /**
    * If the planet gets hit it will blink for a couple of seconds (blink_time)
    */
    blinking: function(){             
            
        if(this.hit){
            this.blink_time--;   
            
            this.color = this.game.colorPicker([
                "#a2eeec", "#b8c7ff", "#f9b5c6", "#f9e796", "#fdd8c4"
            ]);
            
            if(this.blink_time === 0){
               
                this.blink_time = Math.ceil(BLINK_TIME * FPS);

                this.hit = false;
            }  
        }
    },  
   
    /**
    * Updates movement and collision
    */
    update: function() {

        if(this.health <= 0){          
            this.game.gameEngine.explode(this, this.game, 5);  
            this.game.world.let_it_rain = false;
        }else{  

            let distance = this.game.gameEngine.distanceBetweenPoints(
                this.x, this.y, this.game.world.width/2, this.game.world.height/2
            );

            if(distance > 10){
                this.x += this.velocity_x;                   
            }      
            
            if(this.collide()){        
                        
                if(!this.send_message){
                    this.game.world.messenger(this.my_messages[0][Math.floor(Math.random() * this.my_messages[0].length)] + " -80", this);
                }        
                
                // Substract from live
                this.game.gameEngine.subtractFromLive(this);   

                this.hit = true;                               
            }

            // Blink to show being hit      
            this.blinking();           
        }     
    }  
};      