// const $app = document.getElementById('app');

// class Starship{
//     constructor(){
//         this.color = 'black'
//         window.addEventListener('keydown', function(){
//             $app.innerHTML += `<h1>${this.color}</h1>`;
//         });
//     }
// }

// const s = new Starship();

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200; // 1er Cambio más anchura del juego.
    canvas.height = 500; //2do Cambio más altura del juego.

    class InputHandler{
        constructor(game) {
            this.game = game; // Igualación de la varibale game a la del constructor para identificar la clase
            window.addEventListener('keydown', e=>{ //Evento para detectar el pushDown de las teclas y verificar su accion 
                if((    (e.key === 'ArrowUp') || ///////////////////////////////////////////
                        (e.key === 'ArrowDown')
                ) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
                }else if(e.key === ' '){                       //Condicional para verificación de acción de teclas de felcha arriba y flecha abajo
                    this.game.player.shootTop();               //Verificación de tecla de espacio para disparar
                }else if(e.key === 'd'){
                    this.game.debug = !this.game.debug;
                }                               //////////////////////////////////////////////
            });
            window.addEventListener('keyup', e=>{  //Evento para detectar el pushDown de las teclas y verificar su acción.
                if(this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            });

        }
    }
    //Clase de los proyectiles
    class Projecttitle{
        //Definición de variables
        constructor(game, x, y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 9; // 3er Cambio se aumento la velocidad.
            this.markedForDeletion = false;
        }
        update(){ // Función update para verificar la velocidad de desplazamiento del proyectil
            this.x += this.speed; 
            if(this.x > this.game.width * 0.8){
                this.markedForDeletion = true;
            }
        }

        draw(context){ // Función draw para declarar estilo al proyectil y pasar los parametros necesarios
            context.fillStyle = 'yellow';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    //Clase de player o jugador
    class Player{
        //Definición de variables
        constructor(game){
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
            this.speedY = 0;
            this.maxSpeed = 1;
            this.Projectiles = [];
            this.image = document.getElementById('player');
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerUpLimit = 10000;
        }
        update(deltaTime){ //Función update del player
            this.y += this.speedY; 
            if(this.game.keys.includes('ArrowUp')){  //Concidición para verificar acción de tecla de flecha arriba
                this.speedY = -this.maxSpeed; // Después de la acción se manda los parametros de velocidad de desplaxamiento por el eje y.
            }else if(this.game.keys.includes('ArrowDown')){  //Condición para verificar acción de tecla de flecha abajo
                this.speedY = this.maxSpeed; // Después de la acción se manda los parametros de velocidad de desplaxamiento por el eje y
            }else{
                this.speedY = 0; //Regresar varible a su estado definitivo
            }
            this.y += this.speedY; 
            this.Projectiles.forEach(projecttitle=>{ //ForEach para recorrer los proyectiles creados desde nuestra función de update de los proyectiles
                projecttitle.update();
            });
            // Filtración de proyectiles para desplazamiento en el frame x
            this.Projectiles = this.Projectiles.filter(projecttitle=>!projecttitle.markedForDeletion);
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }else{
                this.frameX = 0;
            }
            //Condición para verificación del powerUp y saber el estatus del jugador
            if(this.powerUp){
                if(this.powerUpTimer > this.powerUpLimit){
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                    this.frameY = 0;
                }else{
                    this.powerUpTimer += deltaTime;
                    this.frameY = 1;
                    this.game.ammo += 0.1;
                }
            }
        }

        draw(context){
            //Función draw para pasar parametros necesarios para debugear las imagenes que se utilizaran para la clase juagdor
            if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image,
                                this.frameX*this.width,
                                this.frameY*this.height,
                                this.width, this.height,
                                this.x, this.y,
                                this.width, this.height);
            this.Projectiles.forEach(projecttitle=>{
                projecttitle.draw(context);
            });
        }
        //Función shootTop
        shootTop(){
            //Condicional para verificar y reducir el parametro de las municiones y traspaso de variables de la clase proyectil
            if(this.game.ammo > 0) {
            this.Projectiles.push(new Projecttitle(this.game, this.x+80, this.y+30));
            this.game.ammo--;
        }
    }
    enterPowerUp(){
        this.powerUpTimer = 0;
        this.powerUp = true;
        this.game.ammo = this.game.maxAmmo;
    }
}
    //Clase de enemigo
    class Enemy{
        //Definición de variables
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random()*-1.5-0.5;
            this.markedForDeletion = false;
            this.lives = 7; // 4to Cambio, aumentamos las vidas del enemy.
            this.score = this.lives;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
        }
        //Función update para enemigo
        update(){
            this.x += this.speedX;//Parametros para verificación de velocidad de desplazamiento del enemigo
            if(this.x + this.width < 0){
                this.markedForDeletion = true;
            }
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }else{
                this.frameX = 0;
            }
        }
        draw(context){
             //Función draw para pasar parametros necesarios para debugear las imagenes que se utilizarán para la clase del enemigo
            if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image,
                                this.frameX*this.width,
                                this.frameY*this.height,
                                this.width, this.height,
                                this.x, this.y,
                                this.width, this.height,
                                )
            context.font = '20px Helvetica';
            context.fillText(this.lives, this.x, this.y);
        }
    }

    //Clase Angler
    class Angler1 extends Enemy{
        constructor(game){
            super(game)
            this.width = 228;
            this.height = 169;
            this.y = Math.random()*(this.game.height*0.9-this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random()*3);
            this.lives = 6; // 5to Cambio se aumentaron las vidas del primer Angker.
        }
    }
    //Clase Angler2
    class Angler2 extends Enemy{
        constructor(game){
            super(game)
            this.width = 213;
            this.height = 165;
            this.y = Math.random()*(this.game.height*0.9-this.height);
            this.image = document.getElementById('angler2');
            this.frameY = Math.floor(Math.random()*2);
            this.lives = 5;  // 6to Cambio se agregaron las vidas del segundo Angler.
        }
    }
    // Clase de LuckyFish
    class LuckyFish extends Enemy{
        constructor(game){
            super(game)
            this.width = 99;
            this.height = 95;
            this.y = Math.random()*(this.game.height*0.9-this.height);
            this.image = document.getElementById('lucky');
            this.frameY = Math.floor(Math.random()*2);
            this.lives = 3;
            this.score = 15;
            this.type = 'lucky';
        }
    }
    //Clase de Layer
    class Layer{
        constructor(game, image, speedModifer){
            this.game = game;
            this.image = image;
            this.speedModifer = speedModifer;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }
        //Función de update
        update(){
            //Condición para mandar parametros de desplazamiento al del layer
            if(this.x <= -this.width)this.x = 0;
            this.x -= this.game.speed*this.speedModifer;
        }
        //Función draw para mandar contexto de las imagenes a utilizar en el layer
        draw(context){
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x+this.width, this.y);
        }
    }
    //Clase backgorund
    class Background{
        //Definición de variables
        constructor(game){
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');

            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.4);
            this.layer3 = new Layer(this.game, this.image3, 1.2);
            this.layer4 = new Layer(this.game, this.image4, 1.7);

                
            this.layer = [this.layer1, this.layer2, this.layer3];
            // , this.layer4
        }
        //Función update con ciclo forEach para dezplayar el arreglor con los layer's
        update(){
            this.layer.forEach(layer=>layer.update());
        }
        //Función draw para pasar contexto del mismo array de los layer
        draw(context){
            this.layer.forEach(layer=>layer.draw(context));
        }
    }
    //Clase UI
    class UI{
        constructor(game){
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Helvetica';
            this.color = 'white';
        }
        //Función draw para la UI
        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px '+this.fontFamily;
            context.fillText('score: '+this.game.score, 20, 40); //Parametros para verificación del score del jugador
            for(let i=0; i<this.game.ammo; i++){ //for para recorrer la varibale de ammo referenciada a las municiones
                context.fillRect(20 + 5*i, 50, 3, 20);
            }
            
            const formattedTime = (this.game.gameTime*0.001).toFixed(1); //Constante para delimitar el funcionamiento y el formato del contador o gameTime
            context.fillText('Timer: ' + formattedTime, 20, 100);
            console.log(this.game.score)

            //Condicional para mostrar los mensajes según sea el caso de la varible gameOver
            if(this.game.gameOver){
                context.textAlign = 'center';
                let message1;
                let message2;
                if(this.game.score > this.game.WinningScore){
                    message1 = 'You Win!';
                    message2 = 'Weel Done!';
                }else{
                    message1 = 'You Lose';
                    message2 = 'Try again!';
                }
                //Mandar el contexto para especificación de posicionamiento y diseño
                context.font = '50px '+this.fontFamily;
                context.fillText(message1,
                                this.game.width*0.5,
                                this.game.height*0.5-20);
                context.font = '25px '+this.fontFamily;
                context.fillText(message2,
                                this.game.width*0.5,
                                this.game.height*0.5+20);
            }
            context.restore();
    }
}
    //Clase Game
    class Game{
        //Definición de variables
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.Background = new Background(this);
            this.keys = [];
            this.ammo = 20; // 
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.maxAmmo = 25; // 7mo Cambio, disminución del máximo de municiones.
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.gameOver = false;
            this.score = 0;
            this.WinningScore = 50; // 8vo Cambio se aumento para que el jugador pueda tener mas puntos en el score y por ende más tiempo para estar jugando.
            this.gameTime = 0;
            this.timeLimit = 40000; // 9no Cambio se aumento el tiempo limite.
            this.speed = 4; // 10mo Cambio se aumento la velocidad de desplazamiento de los layers.
            this.debug = false;
        }
        //Función Update
        update(deltaTime){
            if(!this.gameOver) this.gameTime += deltaTime; //Condición para verificar según el estado de la varibale gameOver
            if(this.gameTime > this.timeLimit) this.gameOver = true;//Modificación de gameOver según sea el caso delimitado por la varibale de tiempo y el timepo limite
            this.Background.update();
            this.Background.layer4.update();
            this.player.update(deltaTime);
            if(this.ammoTimer > this.ammoInterval){ //Condición para verificar el intervalo las municiones
                console.log(this.ammo)
                if(this.ammo < this.maxAmmo) { //Si las municiones son menores a las maximas establecidas se suma de uno en uno
                this.ammo++;
                this.ammoTimer = 0;
                }
            }else{
                this.ammoTimer += deltaTime;
            }
            this.enemies.forEach(enemy=>{ //ForEach para recorrer los enemigos desde la función establecida del update. 
                enemy.update();
                if(this.checkCollistion(this.player, enemy)){ //Verificación de condición para establecer el punto de colisión entre el jugador y enemigo
                    enemy.markedForDeletion = true;
                    if(enemy.type='lucky') this.player.enterPowerUp();
                    else this.score--;
                }
                this.player.Projectiles.forEach(projecttitle=>{ //Verificación para establecer el punto de colisión entre el los proyectiles y el enmigo
                    if(this.checkCollistion(projecttitle, enemy)){
                        enemy.lives--;
                        projecttitle.markedForDeletion = true;
                        if(enemy.lives <= 0){
                            enemy.markedForDeletion = true;
                            if(!this.gameOver) this.score += enemy.score;
                            if(this.score > this.WinningScore) {
                                this.gameOver = true;
                            }
                        }
                    }
                });
            });
            //Filtración de los enmigos
            this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion);
            if(this.enemyTimer > this.enemyInterval && !this.gameOver){ //Condición para verificar los enemigos y añadir de uno en uno en base al tiempo establecido y recorrer los enemigos
                this.addEnemy();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltaTime;
            }
        }
        //Función de draw para pasar contexto a todas las clases de nuestro código
        draw(context){
            this.Background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
            });
            this.Background.layer4.draw(context);
        }
        //Función para añadir enemigos de manera random customizando la probabilidad de los Angler para los enemigos
        addEnemy(){
            const randomize = Math.random();
            if(randomize < 0.3)this.enemies.push(new Angler1(this));
            else if(randomize < 0.6) this.enemies.push(new Angler2(this));
            else this.enemies.push(new LuckyFish(this));
        }
        checkCollistion(rect1, rect2){
            return(     rect1.x < rect2.x + rect2.width
                        && rect1.x + rect1.width > rect2.x
                        && rect1.y < rect2.y + rect2.height
                        && rect1.height + rect1.y > rect2.y
            );
        }
    }

    const game = new Game(canvas.width, canvas.height); //Constante game para mandar un nuevo canvas y sus parámetros de ancho y alto
    let lastTime = 0;
    //Función de animate.
    function animate(timeStamp){
        const deltaTime = timeStamp-lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});