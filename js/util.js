/* World constants */

const WIDTH = window.innerWidth; 
const HEIGHT = window.innerHeight;
const FPS = 30;

/* Game constants */

const EXPLODE_TIME = Math.ceil(0.3 * FPS); //Duration of explosion animation
const WORLD_AS_NUM = 12; //Begin stage: 3 asteroids
const WORLD_EN_NUM = 1; //Begin stage: 1 enemy
const WISE_HIGH_SCORES = "wisekrakr highscores";

/* Player constants */

const PLAYER_WIDTH = WIDTH /100;
const PLAYER_HEIGHT = HEIGHT /100;
const PLAYER_SPEED = 0.3 * FPS;
const PLAYER_TURN_SPEED = 8 * FPS;

const INVUL_TIME = 2; //Invulnerable time for the player after death
const BLINK_TIME = 4; //Blinking animation after death
const CENTER_X = window.innerWidth/2; //Start position on the X-axis for the player
const CENTER_Y = window.innerHeight/2; //Start position on the Y-axis for the player 

/* Enemy constants */

const ENEMY_WIDTH = WIDTH /40;
const ENEMY_HEIGHT = HEIGHT/60; 
const ENEMY_SPEED = 4 * FPS;
const ENEMY_TURN_SPEED = 6 * FPS;
const ENEMY_RANGE = 350;

/* Laser constants */

const LASER_WIDTH = WIDTH / 225;
const LASER_HEIGHT = HEIGHT / 225;
const LASER_MAX = 10; // Max number of lasers on screen at one time
const LASER_SPEED = 500; // Laser speed in PPS
const FIRE_RATE = 0.06 * FPS; //Duration of explosion animation

/* Asteroid constants */

const AS_WIDTH = WIDTH/25; // Asteroid radius
const AS_HEIGHT = HEIGHT/25; // Asteroid height
const AS_SPEED = 1.7 * FPS;// Asteroid speed
const AS_ROTATE_SPEED = 0.06 * FPS;;// Asteroid speed
const VERTICES = 10;// Asteroid number of vertices of polygon
const AS_RIDGE = 0.3;// Number of Ridges on an Asteroid

/* Text constants */

const TEXT_FADE_TIME = 2.5; // Text fade time in seconds
const TEXT_SIZE = 25; // Text font size in pixels
const MESSAGE_TIME = 3;
const RESPAWN_TIME = 5;
