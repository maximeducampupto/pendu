function throwAlert(message, couleur) {
    let p = document.createElement('p');
    p.classList.add('alert');
    p.textContent = message;
    p.style.backgroundColor = couleur;

    document.getElementById('wrapper').appendChild(p);
}

function removePreviousAlerts() {
    let alerts = document.getElementsByClassName('alert');

    for (let i = 0; i < alerts.length; i++) {
        alerts[i].remove();
    }
}


let difficultyButtons = document.getElementsByClassName('difficuly_button');



const canvas = {

    sheet : document.getElementById('canvas_pendu'),

    coords: [
        ['100', '350', '300', '350'],
        ['150', '350', '150', '70'],
        ['150', '70', '300', '70'],
        ['300', '70', '300', '150'],
        [],
        ['300', '190', '300', '250'],
        ['300', '190', '330', '220'],
        ['300', '190', '270', '220'],
        ['300', '250', '330', '280'],
        ['300', '250', '270', '280']
    ],


    drawPart: function(which)
    {

        let context = this.sheet.getContext('2d');
        context.lineWidth = 5;
        context.strokeStyle = 'darkturquoise';

        if (which == 4)
        {
            context.beginPath();
            context.arc(300, 170, 20, 0, 2 * Math.PI);
            context.stroke();
        } else {
            context.moveTo(this.coords[which][0], this.coords[which][1]);
            context.lineTo(this.coords[which][2], this.coords[which][3]);
            context.stroke();
        }
    }

}



const game = {

    mots: ["fromage", "chien", "chat", "camembert", "brie", "moto", "conduire", "manger", "boire", "dormir",
    "coder", "aimer", "perdre", "raisonner", "logique", "somnoler", "difficile"],
    randomWord : "",
    startButton : document.getElementById('start_button'),
    sendButton : document.getElementById('send_button'),
    wordContainer : document.getElementById('word_container'),
    tentatives : 15,
    winCondition : 0,
    difficultyLevel : 1,
    partsToDraw : -1,
    playerArray : [],

    getRandomWord: function()
    {
      let random = Math.floor(Math.random() * this.mots.length);
      return this.mots[random];
    },

    init: function()
    {
         this.randomWord = this.getRandomWord();
    },

    fillWordContainer: function()
    {
        for (let i = 0; i < this.randomWord.length; i++)
        {
            let span = document.createElement('span');
            span.innerHTML = "_";
            span.id = i;
            this.wordContainer.appendChild(span);
        }
    },

    displayLetter: function(letter, index)
    {
        var spans = document.getElementById('word_container').children;

        for (let i = 0; i < spans.length; i++)
        {
            if (i == index)
            {
                spans[i].innerHTML = letter;
            }
        }
    },

    compareLetters: function(word, letter)
    {

        if (word.indexOf(letter) == -1)
        {
            throwAlert('Le mot ne contient pas la lettre ' + letter, "rgba(255, 0, 0, 0.56)");
            game.tentatives--;

            this.partsToDraw++;

            if (this.partsToDraw <= 10) {
                canvas.drawPart(this.partsToDraw);
            }


        } else {
            for (var i = 0; i < word.length; i++)
            {
                if (word[i] == letter)
                {
                    for (var k = 0; k < game.playerArray.length; k++)
                    {
                        if (game.playerArray[i] == letter)
                        {
                           return;
                        }
                    }


                    this.playerArray.push(letter);
                    console.log(game.playerArray);
                    this.displayLetter(letter, i);
                    this.clearInput();
                    this.winCondition++;

                    if (this.winCondition == this.randomWord.length)
                    {
                        throwAlert("Bravo! Le mot était " + this.randomWord + ". Un nouveau mot a été généré.", "rgba(0, 255, 0, 0.49)");
                        document.getElementById('tentatives').innerHTML = "Tentatives restantes: " + game.tentatives;
                        this.clearInput();
                        game.restart();
                    }

                }
            }
        }

        document.getElementById('tentatives').innerHTML = "Tentatives restantes: " + game.tentatives;

    },

    clearInput: function()
    {
      document.getElementById('user_input').value = "";
    },

    restart: function()
    {

       canvas.sheet.remove();

       var sheet = document.createElement('canvas');
       sheet.width = "400";
       sheet.height = "400";
       sheet.id = "canvas_pendu";

       document.getElementById('wrapper').appendChild(sheet);

       canvas.sheet = sheet;


        this.wordContainer.innerHTML = "";
        this.partsToDraw = -1;


        this.randomWord = this.getRandomWord();
        this.fillWordContainer();

        this.winCondition = 0;

        switch(this.difficultyLevel) {
            case 0:
                this.tentatives = 20;
                break;
            case 1:
                this.tentatives = 15;
                break;
            case 2:
                this.tentatives = 10;
                break;
            default:
                this.tentatives = 15;
        }
    },

    startGame: function()
    {
        this.randomWord = "moto";
        this.fillWordContainer();

        this.sendButton.addEventListener('click', function(e) {
            console.log(game.playerArray);
            removePreviousAlerts();
            game.userInput = document.getElementById('user_input').value;


               if (!isNaN(game.userInput)) {
                   throwAlert("Veuillez entrer une lettre","rgba(255, 0, 0, 0.56)");
                   game.clearInput();
               } else {
                   if (game.userInput.length  == 1)
                   {
                       if (game.tentatives > 0) {
                           game.compareLetters(game.randomWord, game.userInput);
                       } else {
                           throwAlert('Nombre de tentatives épuisé! Un nouveau mot a été généré.',"rgba(255, 0, 0, 0.56)");
                           game.clearInput();
                           game.restart();
                       }
                   } else {
                       throwAlert("Veuillez n'entrer qu'une seule lettre à la fois","rgba(255, 0, 0, 0.56)");
                       game.clearInput();
                   }
               }

            document.getElementById('tentatives').innerHTML = "Tentatives restantes: " + game.tentatives;
        });
    }
};

game.init();



for (var i = 0; i < difficultyButtons.length; i++)
{
    difficultyButtons[i].addEventListener('click', function(e) {
        switch(e.target.innerHTML) {
            case "Facile":
                game.tentatives = 20;
                game.difficultyLevel = 0;
                break;
            case "Moyen":
                game.tentatives = 15;
                game.difficultyLevel = 1;
                break;
            case "Difficile" :
                game.tentatives = 10;
                game.difficultyLevel = 2;

                break;
            default:
                game.tentatives = 15;
                game.difficultyLevel = 1;

        }
    });
}


game.startButton.addEventListener('click', function() {
    for (var i = 0; i < difficultyButtons.length; i++) {
        difficultyButtons[i].style.display = "none";
    }

    document.getElementById('tentatives').innerHTML = "Tentatives restantes: " + game.tentatives;

   game.startButton.style.display = "none";
   document.getElementById('wrapper').style.display = "flex";

   game.startGame();
});


/*
if (!isNaN(game.userInput)) {
               throwAlert("Veuillez entrer une lettre","rgba(255, 0, 0, 0.56)");
               game.clearInput();
           } else {
               if (game.userInput.length  == 1)
               {
                   if (game.tentatives > 0) {
                       game.compareLetters(game.randomWord, game.userInput);
                   } else {
                       throwAlert('Nombre de tentatives épuisé! Un nouveau mot a été généré.',"rgba(255, 0, 0, 0.56)");
                       game.clearInput();
                       game.restart();
                   }
               } else {
                   throwAlert("Veuillez n'entrer qu'une seule lettre à la fois","rgba(255, 0, 0, 0.56)");
                   game.clearInput();
               }
           }
 */