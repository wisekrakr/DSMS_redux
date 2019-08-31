/* World constants */

const WIDTH = window.innerWidth; // World and canvas width, have the width of the screen size
const HEIGHT = window.innerHeight; // World and canvas height, have the height of the screen size
const FPS = 30; // 30/1000 (30 frames per second)

/* Game constants */

const EXPLODE_TIME = Math.ceil(0.3 * FPS); //Duration of explosion animation
const WORLD_AS_NUM = 5; //Begin stage: 3 asteroids
const WORLD_EN_NUM = 0; //Begin stage: 1 enemy
const WISE_HIGH_SCORES = "wisekrakr highscores";

/* Player constants */

const PLAYER_WIDTH = 15;
const PLAYER_HEIGHT = 15;
const PLAYER_SPEED = 0.3 * FPS; 
const PLAYER_ROTATE_SPEED = 8 * FPS; // Rotate speed for the player

const INVUL_TIME = 2; //Invulnerable time for the player after death
const BLINK_TIME = 4; //Blinking animation after death
const CENTER_X = window.innerWidth/2; //Start position on the X-axis for the player (center screen)
const CENTER_Y = window.innerHeight/2; //Start position on the Y-axis for the player (center screen)

/* Enemy constants */

const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 15; 
const ENEMY_SPEED = 4 * FPS;
const ENEMY_TURN_SPEED = 6 * FPS; // Speed to turn towards a target
const ENEMY_RANGE = 350; // Radius range for the enemy to attack in

/* Laser constants */

const LASER_WIDTH = 3;
const LASER_HEIGHT = 3;
const LASER_MAX = 10; // Max number of lasers on screen at one time
const LASER_SPEED = 500; // Laser speed in PPS
const FIRE_RATE = 0.06 * FPS;

/* Asteroid constants */

const AS_WIDTH = 60; // Asteroid radius
const AS_HEIGHT = 60; // Asteroid height
const AS_SPEED = 1.7 * FPS;// Asteroid speed
const AS_ROTATE_SPEED = 0.06 * FPS;// Asteroid rotation speed
const VERTICES = 10;// Asteroid number of vertices of polygon
const AS_RIDGE = 0.3;// Number of Ridges on an Asteroid

/* Text constants */

const TEXT_FADE_TIME = 2.5; // Text fade time in seconds
const TEXT_SIZE = 25; // Text font size in pixels
const MESSAGE_TIME = 3; // A message from an object in game will stay alive for 3 seconds.
const RESPAWN_TIME = 5; // 5 seconds after Game Over the game will restart
