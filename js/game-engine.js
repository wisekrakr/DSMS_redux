const GameEngine = function(){

    /**
     * The Engine that holds objects and updates them.
     */
    this.gameEngine = {

        gameObjects: new Set(),
        toBeRemoved:new Set(),

        // Add an object to a set to further use in the game
        addObject : function(object) {

            this.gameObjects.add(object, object.tagNr);              
        },

        //Removes an object from the set that runs in the game. 
        //This places the object outside of the game.
        removeObject : function(object) {   

            this.gameObjects.delete(object, object.tagNr);
            this.toBeRemoved.add(object, object.tagNr);
        },

        /**
         * Returns the distance between two objects (hypot)
         * 
         * @param  {} object1 Object that uses this function
         * @param  {} object2 Object that this function is used on.
         */
        distanceBetweenObjects : function(object1, object2){
            let attackDistanceX = object1.x - object2.x;
            let attackDistanceY = object1.y - object2.y;

            return Math.hypot(attackDistanceX, attackDistanceY);
        },
        
        /**
         * Returns the distance between two objects coordinates (x,y)
         * 
         * @param  {} x1 position on x axis for Object that uses this function
         * @param  {} y1 position on y axis for Object that uses this function
         * @param  {} x2 position on x axis for Object that this function is used on.
         * @param  {} y2 position on y axis for Object that this function is used on.
         */
        distanceBetweenPoints : function(x1, y1, x2, y2){
            return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
        },
        
        /**
         * Returns the angle between two objects. (atan2)
         * 
         * @param  {} object1 Object that uses this function
         * @param  {} object2 Object that this function is used on.
         */
        angleBetweenObjects : function(object1, object2){
            let attackDistanceX = object1.x - object2.x;
            let attackDistanceY = object1.y - object2.y;

            return Math.atan2(attackDistanceY, attackDistanceX);
        },         

        /**
         * Creates an explosion effect by creating debris objects
         * 
         * @param  {} object Object that uses this function
         * @param  {} game Current running game
         */
        explode : function(object, game, bits){
            
            if(object !== null && object.explodeTime > 0){
                let debrisParts = [];
                for (let i = debrisParts.length; i < bits; i++) {      
                    debrisParts[i] = new Debris(game, 
                        object.x, object.y, 
                        object.width / i+1, object.height / i+1, 
                        object.color
                        );
        
                } 
                object.explodeTime--;
            }
        },  

        /**
         * Returns a collision tick. This is an optional function.
         * 
         * @param  {} object Object that uses this function
         */

        collision : function(object){       
    
            for (let sub of this.gameObjects) {      
    
                if (sub !== object && sub.tag !== "Thruster" && sub.tag !== 'Debris') {   
                    
                    if (this.distanceBetweenObjects(object, sub) < object.height + sub.height ||
                        this.distanceBetweenObjects(object, sub) < object.width + sub.width) {                
                        return true;
                    }else{
                        return false;
                    }    
                }
            }
            
        },
        
        /**
         * Returns an object that this.object collided with
         * 
         * @param  {} object Object that uses this function
         */
        collisionObject : function(object){ 
            let collisionObject;       
               
            for (let sub of this.gameObjects) {      
    
                if (sub !== object && sub.tag !== "Thruster" && sub.tag !== 'Debris') {   
                    
                    if (this.distanceBetweenPoints(object.x, object.y, sub.x, sub.y) < 
                        object.width + sub.width && object.height + sub.height) {   
    
                        collisionObject = sub;
                    }
                }
            }        
            
            return collisionObject;
        },
        
        // Every object needs to run their respective update function.
        update : function(){
            
            for(let object of this.gameObjects){     

                object.update();            
            }
        }
    }   
    
    /**
     * Updates the Game Engine that holds objects and updates them.
     */
    this.update = function() {
     
        this.gameEngine.update();
        
    };
}

GameEngine.prototype = { constructor : GameEngine };