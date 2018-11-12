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

var difficultyButtons = document.getElementsByClassName('difficuly_button');

var game = {

    mots: ["fromage", "chien", "chat", "camembert", "brie", "moto", "conduire", "manger", "boire", "dormir",
    "coder", "aimer", "perdre", "raisonner", "logique", "somnoler", "difficile"],
    randomWord : "",
    startButton : document.getElementById('start_button'),
    sendButton : document.getElementById('send_button'),
    wordContainer : document.getElementById('word_container'),
    tentatives : 15,
    winCondition : 0,
    difficultyLevel : 0,

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
            span.innerHTML = this.randomWord[i];
            span.id = i;
            this.wordContainer.appendChild(span);
        }
    },

    displayLetter: function(letter, i)
    {
        var spans = document.getElementById('word_container').children;
        spans[i].style.visibility = "visible";
    },

    compareLetters: function(word, letter)
    {

        if (word.indexOf(letter) == -1)
        {
            throwAlert('Le mot ne contient pas la lettre ' + letter, "rgba(255, 0, 0, 0.56)");
            game.tentatives--;
        } else {
            for (var i = 0; i < word.length; i++)
            {
                if (word[i] == letter)
                {
                    this.displayLetter(letter, i);
                    this.winCondition++;

                    if (this.winCondition == this.randomWord.length)
                    {
                        throwAlert("Bravo! Le mot était " + this.randomWord + ". Un nouveau mot a été généré.", "rgba(0, 255, 0, 0.49)");
                        game.restart();
                    }

                }
            }
        }

        document.getElementById('tentatives').innerHTML = "Tentatives restantes: " + game.tentatives;

    },

    restart: function()
    {
        this.wordContainer.innerHTML = "";

        this.randomWord = this.getRandomWord();
        this.fillWordContainer();

        this.tentatives = 10;
        this.winCondition = 0;
    },

    startGame: function()
    {
        this.fillWordContainer();

        this.sendButton.addEventListener('click', function(e) {
            removePreviousAlerts();
            game.userInput = document.getElementById('user_input').value;

           if (!isNaN(game.userInput)) {
               throwAlert("Veuillez entrer une lettre","rgba(255, 0, 0, 0.56)");
               game.tentatives--;
           } else {
               if (game.userInput.length  == 1)
               {
                   if (game.tentatives > 0) {
                       game.compareLetters(game.randomWord, game.userInput);
                   } else {
                       throwAlert('Nombre de tentatives épuisé! Un nouveau mot a été généré.',"rgba(255, 0, 0, 0.56)");
                       game.restart();
                   }
               } else {
                   throwAlert("Veuillez n'entrer qu'une seule lettre à la fois","rgba(255, 0, 0, 0.56)");
               }
           }
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
                break;
            case "Moyen":
                game.tentatives = 15;
                break;
            case "Difficile" :
                game.tentatives = 10;
                break;
            default:
                game.tentatives = 15;
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
    - BONUS : Dessiner grâce à Canvas ou en html/css le pendu et modifier dynamiquement le dessin pour représenter le nombre de tentatives restantes.
 */
