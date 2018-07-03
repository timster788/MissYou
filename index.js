window.onload = function() {
    Heart.init(); 
  }
  
  
  // Different languages words .. make it yours :)
  var Languages = {
    all: function() {
      return this.french.concat(this.english, this.spanish);
    },
    french: ['Belle','Amour','Tu es ma lumière','Magnifique','Yeux séduisants','joueur','Sexy','Voix adorable','intelligente','Mignonne','tu es mon âme soeur ','Ma unique véritable chérie','Mon bonheur','','','',''],
       english: ['Beautiful', 'Love', 'You are my Light', 'Magnificent', 'Alluring Eyes', 'Gamer', 'Sexy', 'Adorable Voice', 'Intelligent', 'Cute', 'Soul Mate', 'My one true love', 'My Happines', ''],
      spanish: ['', '', '', '', '', '', '', '', '', '', '', '', '', '']
  }
  
  var Heart = {
    configures: {
      language: Languages.all(), // The default language 
      ltr: true, // Left-to-right languages: to inverse the order of the animated letters based on the different 4-Quarter of the circle
      isPlaying: true, // To play - pause the flying words 
      colors: ['#231eb8', '#2466ff', '#1fbce1', '#00e11a', '#ff4293', '#6c046c', '#f04c81', '#ff8a00', , '#ff0000'], // words' colors palette
      timer: 500, // (milliseconds) Every so often a word will fly
      power: 200, // The power of the flying words (Phyiscal power!)
      transitionTime: 10 // (seconds)
    },
  
    init: function() { 
  
      var self = this;
      this.generateWordsTree();
      
      // Initilize languages inputs ..
      var languagesInputs = document.getElementsByClassName('language-input');
      for (var i = 0; i < languagesInputs.length; i++) {
        languagesInputs[i].onclick = function() {
            self.changeLanguageTo(this.value);
          };
       };
  
      // Timer to fly the words .. 
      setInterval(function () {
        if (self.configures.isPlaying) {
            self.flyAway();
          };
        }, self.configures.timer);
  
      // Timer to reset the style of the flied words (to be reusable again!) ..
      setInterval(function () {
        var fliedWords = document.querySelectorAll("[data-is-flying='YES']");
          for (var i = 0; i < fliedWords.length; i++) {
            if (getComputedStyle(fliedWords[i]).opacity == 0) {
              self.resetStyle(fliedWords[i]);  
            };  
          };
        }, (self.configures.transitionTime*1000));
    },
    
    pause: function () {
      this.configures.isPlaying = false;
    },
  
    play: function() {
      this.configures.isPlaying = true;
    },
  
    changeLanguageTo: function(chosenLanguage) {
      this.pause();
      // Remove all words' elements for the current language
      var allWords = document.getElementsByClassName('word');
      for (var i = allWords.length - 1; i >= 0; i--) {
        allWords[i].remove();
      };
  
      // Change the language ..
      if (chosenLanguage == 'all') {
        this.configures.language = Languages.all();
        this.configures.ltr = true;
      } else if(chosenLanguage == 'french') {
        this.configures.language = Languages.french;
        this.configures.ltr = true;
      } else if (chosenLanguage == 'english') {
        this.configures.language = Languages.english;
        this.configures.ltr = true;
      } else if (chosenLanguage == 'spanish') {
        this.configures.language = Languages.spanish;
        this.configures.ltr = true;
      }
  
      this.generateWordsTree(); // Generate the new words tree 
      this.play();
    },
  
    generateWordsTree: function() {
      for (var i = 0; i < this.configures.language.length; i++) {
        this.generateWordWithIndex(i);
      };
    },
  
    generateWordWithIndex: function(index) {
      var self = this; // Make a reference for 'this'
      var singleWord = this.configures.language[index]; // get a word from the Languages array
      var wordElement = document.createElement('ul'); // create single word elemnt 
      wordElement.className += ' word'; // set its class to 'word'
      wordElement.dataset.isFlying = 'NO'; // set its data-is-flying to NO, since it's not flying yet!
      
      randomColor = this.configures.colors[Math.floor(Math.random() * (this.configures.colors.length + 1))]; // get a random color
      
      // Iterating through each letter (li) of the word, and appending it to the word's tree (ul) 
      for (var i = 0; i <= singleWord.length-1; i++) {
        var item = document.createElement('li'); // create li element
        item.className += ' letter__item'; // set its class to letter__item
        item.appendChild(document.createTextNode(singleWord[i])); // set its content to be the selected word
        item.style['color'] = randomColor; // set its color
        wordElement.appendChild(item); // append the created (li) to the word elemen (ul)
      };
  
      // add the word element (ul) to the words' tree
      document.getElementsByClassName('wordsTree')[0].appendChild(wordElement);
      return wordElement; 
    },
  
    resetStyle: function(e) {
      // To reset element's style and position 
      e.style.transition = 'all 0s ease-out' 
      e.style["opacity"] = "1";
      e.dataset.isFlying = 'NO';
      prefixTranslate(e, "translate(" + 0 +"px, " + 0 + "px) rotate(" + 0 +"deg)"); // Set the translate back to 0
  
      // Reset each letter's style and position ..
      for (var i = 0; i < e.children.length; i++) {
        e.children[i].style.transition = 'all 0s ease-out';
        prefixTranslate(e.children[i], "translate(" + 0 +"px, " + 0 + "px) rotate(" + 0 +"deg)");
      };
    },
  
  
    getElementToFly: function() {
      // Get random element to fly
      var staticElements = document.querySelectorAll("[data-is-flying='NO']"); // all the statics elements 
      var random = Math.floor(Math.random() * (staticElements.length)); // random index
      return staticElements[random];
    },
  
    flyAway: function() {
      var e = this.getElementToFly(); // get a random element ..
      
      // if the Heart is paused, return
      if (!this.configures.isPlaying) { 
          return;
      };
  
      // if there was no element to fly, generate a new element ..
      if (e == null) {
        var randomIndex = Math.floor(Math.random() * (this.configures.language.length));
        this.generateWordWithIndex(randomIndex); // 
        return;
      };
  
  
      // This was the first logic I used to randommly fly the words in different directions, 
      // which was not as perfect as I imagined ..
      //
      // var randomSign01 = Math.random() < 0.5 ? -1 : 1;
      // var randomSign02 = Math.random() < 0.5 ? -1 : 1;
      // var randomSign03 = Math.random() < 0.5 ? -1 : 1;
      // var randomX = (Math.floor(Math.random() * ((200-150)+1) + 150)) * randomSign01; // random X between 150 and 200
      // var randomY = (Math.floor(Math.random() * ((200-150)+1) + 150)) * randomSign02; // random Y between 150 and 200
      // var degree = (Math.floor(Math.random() * ((60 - 0)+1) + 0 )) * randomSign03; // random degress between 0 and 60
  
      // So, I thought of another way, which was ...
      // .. To generate random (x,y) point with random direction (0 - 360) I used Vectors notation (radius / magnitude, direction) 
      // instead of normal notation (x, y)
      // Check out: Polar Coordinate and Rectangular Coordinate
  
      var vectorMagnitude = this.configures.power; // Fixed radius which, in our case, determine the *power* of the flying words. (Try to make it 1000 and see)
      var randomRadian = -Math.random() * ((Math.PI*2)); // Generate a random degree (0 to 360) (The minus to make counterclockwise)
      var x = Math.floor(vectorMagnitude * Math.cos(randomRadian)); // Get the x point based on the fxied radius and the random degree ( x = r * cosθ)
      var y = Math.floor(vectorMagnitude * Math.sin(randomRadian)); // Get the y point based on the fixed radius and the random degree ( y = r * sinθ)
  
      this.makeTranslateAnimation(e, x, y, Math.floor(randomRadian * (180/Math.PI)) /* From RADIANS to DEGREES*/);
    },
  
  
    makeTranslateAnimation: function(e, x, y, degree) {
      e.dataset.isFlying = 'YES'; // when a word flies, set its data-is-flying to YES
      e.style.transition = 'all ' + this.configures.transitionTime + 's ease-out'; // set the transition style ..
  
      // Animate the word container (ul) ..
      prefixTranslate(e, "translate(" + x +"px, " + y + "px) rotate(" + degree / 10 +"deg)");
      e.style["opacity"] = "0";
  
      // Animation each letter (li) ..
      var inverseIterator = e.children.length; // This iterator goes in a decending manner (5 4 3 2 1 0)
      var translateIterator;
  
      for (var i = 0; i < e.children.length; i++) {
        var randomMinus = Math.random() < 0.5 ? -1 : 1;
        e.children[i].style.transition = 'all ' + this.configures.transitionTime + 's ease-out';
  
        // IF LTR and 2-3 Quarter -> Inverse the translateIterator OTHERWISE leave it as normal
        // IF RTL and 1-4 Quarter -> Inverse the translateIterator OTHERWISE leave it as normal
        if ((-degree > 90 && -degree < 270) && this.configures.ltr) {
           translateIterator = inverseIterator; // Inverse the translate iterator
        } else if (((-degree > 0 && -degree <= 90) || (-degree > 280 && -degree < 360 )) && !this.configures.ltr) {
           translateIterator = inverseIterator; // Inverse the translate iterator
        } else {
            translateIterator = i; 
        }
  
        prefixTranslate(e.children[i], "translate(" + (x * (translateIterator+1) * 0.2)   +"px, " + (y * (translateIterator+1) * 0.2) + "px) rotate(" + randomMinus*30+"deg) scale(" + (translateIterator+1)*0.3 + ")");
        inverseIterator--;  
      };
    }
  }
  
  
  function prefixTranslate(element, value) {
    element.style["-webkit-transform"] = value;
    element.style["-moz-transform"] = value;
    element.style["-ms-transform"] = value;
    element.style["-o-transform"] = value;
    element.style["transform"] = value;
  } 