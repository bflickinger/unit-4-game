
function resetGame () {
    window.game = {
        inCombat : false,
        atkChar : "",
        defChar : "",
        isOver : false,
        numAttacks : 1,
        numWins: 0,
        jediArray: [
            {
                jediName : "Anakin",
                jediPic : "assets/images/anakinR.png",
                jediHP : 110,
                atkPower : 12,
                defPower : 20,
                isDefeated: false,
                location: "gallery",
            },
            {
                jediName : "Yoda",
                jediPic : "assets/images/yodaR.png",
                jediHP : 100,
                atkPower : 15,
                defPower : 22,
                isDefeated : false,
                location: "gallery",
            },
            {
                jediName : "Kylo",
                jediPic : "assets/images/kyloR.png",
                jediHP : 130,
                atkPower : 10,
                defPower : 18,
                isDefeated : false,
                location: "gallery",
            },
            {
                jediName : "Vader",
                jediPic : "assets/images/vaderR.png",
                jediHP : 140,
                atkPower : 15,
                defPower : 25,
                isDefeated : false,
                location: "gallery",
            }
        ],
        drawChars : function () {
            $("#jediAreWaiting").empty();
            $("#atkCharacter").empty();
            $("#defCharacter").empty();
            $.each(game.jediArray, function(key, char) {
                switch (char.location){
                    case "gallery":
                        var charDiv = game.createChar(key, char);
                        $("#jediAreWaiting").append(charDiv);
                        break;
                    case "attack":
                        var charDiv = game.createChar(key, char);
                        $("#atkCharacter").html(charDiv);
                        break;
                    case "defend":
                        var charDiv = game.createChar(key, char);
                        $("#defCharacter").html(charDiv);
                        break;
                }
            });
        },
        createChar : function (key, char) {
            if (char.isDefeated === true){
                var charDiv = $("<div class='character dead' data='" + key + "'>");
            }
            else {
                var charDiv = $("<div class='character' data='" + key + "'>");
            }
            var charName = $("<div class='charName'>").text(char.jediName);
            var charImage = $("<img alt='image' class='charPic'>").attr('src', char.jediPic);
            var charHealth = $("<div class='charHP'>").text(char.jediHP);
            charDiv.append(charName).append(charImage).append(charHealth);
            return charDiv;
        },
        moveChar : function (data) {
            if (!game.inCombat && !game.jediArray[data].isDefeated){
                if (game.atkChar != "" && game.defChar === "" && game.jediArray[data].location != "attack"){
                    game.jediArray[data].location = "defend";
                    game.defChar = data;
                    game.drawChars();
                    $(".updates").html("<h2>It's " + game.jediArray[game.atkChar].jediName + " vs " + game.jediArray[game.defChar].jediName + "</h2>");
                    $(".instructions").html("<h4>Good Luck!!</h4>");
                }
                if (game.atkChar === "" && game.defChar === ""){
                    game.jediArray[data].location = "attack";
                    game.atkChar = data;
                    $(".instructions").html("<h4>Now Pick an opponent!</h4>");
                    game.drawChars();
                }
            }
        },
        combat : function () {
            var damageDone = game.jediArray[game.atkChar].atkPower * game.numAttacks;
            var damageTaken = game.jediArray[this.defChar].defPower;
            game.jediArray[this.atkChar].jediHP -= damageTaken; 
            game.jediArray[this.defChar].jediHP -= damageDone;
            if (game.jediArray[this.atkChar].jediHP <=0){
                $(".updates").html("<h3>" + game.jediArray[game.atkChar].jediName + " has been defeated! Click button to restart</h3>");
                game.isOver = true;
                $(".atkButton").text("Restart");
                return;
            }
            if (game.jediArray[this.defChar].jediHP <=0){
                game.numWins++
                if (game.numWins === 3){
                    $(".updates").html("<h3>You have won the game!!!  Click the button to play again.</h3>");
                    $(".atkButton").text("Restart");
                    game.isOver = true;
                    return;
                }
                $(".updates").html("<h3>" + game.jediArray[this.defChar].jediName + " has been defeated! Select another opponent...</h3>");
                game.jediArray[this.defChar].location = "gallery";
                game.jediArray[this.defChar].isDefeated = true;
                game.jediArray[this.defChar].jediHP = 0;
                game.defChar = "";
                game.inCombat = false;
                game.drawChars();
                return;
            }
            $(".updates").html("<h3>" + game.jediArray[game.atkChar].jediName + " hits " + game.jediArray[game.defChar].jediName + " for " + damageDone + ", but is countered for " + damageTaken +"</h3>");
            game.numAttacks++
            game.drawChars();
        }
    };
}

$(document).ready(function() {
    resetGame();
    game.drawChars();
    $(document).on("click",".character", function(){
        game.moveChar($(this).attr('data'));
    });
    $(document).on("click",".atkButton", function(){
        if (game.isOver === true) {
            location.reload();
        }
        var audio = new Audio("./assets/audio/lightsaber.mp3");
        audio.play();
        game.inCombat = true;
        game.combat();
    });
});


