const GameEngine = function(){

    this.gameEngine = {

        gameObjects: new Set(),
        to_be_removed:new Set(),

        // Add an object to a set to further use in the game
        addObject : function(object) {

            this.gameObjects.add(object, object.tagNr);              
        },

        //Removes an object from the set that runs in the game. 
        //This places the object outside of the game.
        removeObject : function(object) {   

            this.gameObjects.delete(object, object.tagNr);
            this.to_be_removed.add(object, object.tagNr);
        },
        
        // Every object needs to run their respective update function.
        update : function(){
            
            for(let object of this.gameObjects){     

                object.update();            
            }
        },

        //Returns the distance between two objects (hypot)
        distanceBetweenObjects : function(object1, object2){
            let attackDistanceX = object1.x - object2.x;
            let attackDistanceY = object1.y - object2.y;

            return Math.hypot(attackDistanceX, attackDistanceY);
        },

        //Returns the distance between two objects coordinates (x,y)
        distanceBetweenPoints : function(x1, y1, x2, y2){
            return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
        },

        //Returns the angle between two objects. (atan2)
        angleBetweenObjects : function(object1, object2){
            let attackDistanceX = object1.x - object2.x;
            let attackDistanceY = object1.y - object2.y;

            return Math.atan2(attackDistanceY, attackDistanceX);
        },

        // Returns a collision tick. This is an optional function.
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

        // Returns an object that this.object collided with
        collisionObject : function(object){ 
            let collisionObject; 

            for (let sub of this.gameObjects) {      

                if (sub !== object && sub.tag !== "Thruster" && sub.tag !== 'Debris') {   
                    
                    if (this.distanceBetweenPoints(object.x, object.y, sub.x, sub.y) < 
                        object.width/1.75 + sub.width/1.75 && object.height/1.75 + sub.height/1.75) {   

                        collisionObject = sub;
                    }
                }
            }
            return collisionObject;
        },

        // Creates an explosion effect by creating debris objects
        explode : function(object, game){
            
            let debrisParts = [];
            for (let i = debrisParts.length; i < 5; i++) {      
                debrisParts[i] = new Debris(game, 
                    object.x, object.y, 
                    object.width / i+1, object.height / i+1, 
                    object.color
                    );
     
            } 
        },        

        size : function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        }
    }

    
    this.loadJSON = function(path) {   

        var request = new XMLHttpRequest();

        request.overrideMimeType("application/json");
        request.open('GET', path); 
        request.responseType = 'json';
        request.send();  

        let messages;

        request.onload = function(){
            messages = request.response;
        }

        return messages;
    };


    this.update = function() {
     
        this.gameEngine.update();
        
    };
}

GameEngine.prototype = { constructor : GameEngine };