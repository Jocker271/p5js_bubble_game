var bubbles; //array, das alle ereugten Bubbles enthält
var game; //array aller level
var gamemode; //0:Startmenü, 1:laufendes Spiel, 2:Endbildschirm
var highscore = null; //kürzeste Durchspielzeit (geht bei pageReload verloren)
var info; //boolean als trigger für Infoanzeige
var interval;	//Intevall für Zeitbestimmung
var level; //id des aktiven levels
var slider; //Slider zum einstellen der Musiklautstärke
var song; //die abgespielte mp3 Datei
var time_count; //Spieldauer
var total_score; //Anzahl der geklickten Bubbles
var txt; //Inhalt der eingelesenen txt Datei (enthält Leveldesign)
var volume = 0.4; //speichert Musiklautstärke global (Anfangswert 0.4)

function preload() {
	// lädt externe Daten noch vor dem setup, damit sie direkt verwendet werden können
	song = loadSound('data/music.mp3'); //wird aus irgendeinem Grund manchmal nicht rechtzeitig/richtig geladen -> F5 hilft
	txt = loadStrings('data/level.txt');
}

function setup() {
	// wird beim Start einmalig ausgeführt und setzt Variablen auf den Ausgangszustand
	createCanvas(window.innerWidth, window.innerHeight); //Canvas über gesamten angezeigten Bereich
	background(100, 150, 150);
	bubbles = [];
	game = getLevels();
	gamemode = 0;
	info = false;
	level = 0;
	slider = createSlider(0, 1, volume, 0.01); //erzeugt Slider für die Musiklautstärke
	slider.position(20, 20);
	time_count = 0;
	total_score = 0;
}

function draw() {
	// wird kontinuierlich aufgerufen (gameloop)
	background(100, 150, 150);
	textAlign(CENTER, CENTER);
	switch(gamemode) {
		// Unterschiedliche Anzeige auf Canvas je nach gamemode
		case 0: //Startbildschirm
			startScreen();
			break;
		case 1: //laufendes Spiel
			runLevel();
			break;
		case 2: //endbildschirm
			endScreen();
			break;
	}
	controllMusic();
}

function startScreen() {
	//Anfangsbildschirm (Startmenü)
	textSize(64);
	fill(128 + sin(frameCount*0.1) * 128); //blinkender Effekt
	text("Drücke Enter um zu Starten!", width/2, height * 0.4);
	textSize(25);
	fill(000);
	if (info) { //zeigt Info an, wenn "info" true ist
		textSize(25);
		text("Ziel des Spiels ist es, so schnell wie möglich",width/2,height*0.6);
		text("alle Kreise durch Anklicken einzufärben",  width/2, height * 0.65);
		text("und so alle "+ txt.length +" Level abzuschließen.",width/2,height*0.7);
		if (highscore) { //wenn es bereits einen highscore gibt
			fill(150, 20, 20);
			text("Schaffst du es deinen Highscore zu schlagen?",width/2,height*0.78);
		}
		fill(000);
		text("[ESC] startet das Spiel neu.",  width/2, height * 0.9);
	}
	else {
		text("[ i ] für mehr Informationen",  width/2, height * 0.6)
	}
}

function runLevel() {
	// wird bei aktivem Spiel kontinuierlich aufgerufen
	let score = 0;
	for (var i = 0; i < bubbles.length; i++) { //für jede Bubble
		bubbles[i].quake( //ruft die Funktion quake() mit folgenden Variablen auf
			game[level-1][2], //left
			game[level-1][3], //right
			game[level-1][4], //top
			game[level-1][5]); //down
		bubbles[i].bounce( //ruft die Funktioin bounce() mit folgenden Variablen auf
			game[level-1][6], //xspeed
			game[level-1][7]); //yspeed
		bubbles[i].resize( //ruft die Funktion rezise() mit folgenden Variablen auf
			game[level-1][8], //min
			game[level-1][9], //max
			game[level-1][10]); //power
		bubbles[i].display(); //zeigt Bubbles auf Canvas an
		score = score + bubbles[i].getCoin() //Anzahl der in diesem Level geklickten (gefärbten) Bubbles
	}
	if (score === game[level-1][0]) { //wenn so viele Bubbles angeklickt, wie erzeugt wurden
		// level geschaffte
		total_score += score; //erhöht die Gesamtanzahl der gefärbten Bubbles
		nextLevel(); //ruft das nächste Level auf
	}
}

function endScreen() {
	//Endbildschirm (Scoreanzeige)
	clearInterval(interval); //stoppt den timer;
	textSize(50);
	text("Fertig",  width/2, height * 0.3);
	textSize(30);
	text("Du hast "+time_count/10 +" Sekunden gebraucht,",width/2,height*0.5);
	text("um " + total_score + " Kreise zu treffen.", width/2, height * 0.6);
	if (highscore && time_count > highscore) {
		// schlechter als der Highscore, deswegen wird er angezeigt
		text("Highscore: "+parseInt(highscore)/10+" Sekunden",width/2,height*0.75);
	}
	else {
		highscore = time_count; //überschreibt den alten Highscore mit dem Neuen
		textSize(50);
		fill(232, 115, 20);
		text("Neuer Highscore!!!", width/2, height * 0.75);
	}
	textSize(20);
	fill(128 + sin(frameCount*0.1) * 128);  //blinkender Effekt
	text("drücke [ESC] um erneut zu spielen", width/2, height * 0.9);
}

function controllMusic() {
	// Musikkontrolle
	volume = slider.value(); //speichert Musiklautstärke global ab
	song.setVolume(volume); //stellt Musiklautstärke entsprechend des Sliders
	fill(006);
	textSize(15);
	textAlign(LEFT, CENTER);
	noStroke();
	text('Musik', slider.x * 2 + slider.width, 35); //Label für den Slider
	if (!song.isPlaying()) { //startet Musik neu, wenn der Song zuende ist
		song.play();
	}
}

function getLevels() {
	// extrahiert Inhalt der eingelesenen txt Datei und wandelt ihn in verwendbare Arrays um
	var levels = [];
	for (var i = 0; i < txt.length; i++) { //geht jede Zeile der txt Datei durch
		var line = txt[i].split(','); //splitet Zeileninhalt nach jedem Komma
		for (var letter in line) { //für jedes Element in der Zeile
			line[letter] = parseInt(line[letter]); //Element wird vom String zum Integer umgewandelt, damit später als Zahl interpretierbar
		}
		levels[i] = line; //fügt Zeile zum Array "levels" hinzu
	}
	return levels; //gibt Array aller Level zurück
}

function timeIt() {
	//kontinuierlich weiterzählender Counter
	time_count++;
}

function nextLevel() {
	//initialisiert das nächste Level (baut es quasi auf)
	bubbles = []; //löscht alle alten Bubbles
	level += 1; //erhöht das level um 1
	if (level > game.length) { //wenn es kein weiteres Level gibt
		gamemode = 2; //Spielmodus auf 2 gesetzt
		console.log("ENDE");
	}
	else {
		//erzeugt so viele Bubbles, wie in dem Array "game" beim Eintrag mit der ID des aktuellen Levels an 1. ([0].) Stelle steht
		for (var i = 0; i < game[level-1][0]; i++) {
			var x = random(width); //zufälliger Wert für die X-Koordiante
			var y = random(height); //zufälliger Wert für die Y-Koordiante
			bubbles.push(new Bubble(x, y, game[level-1][1])); //erzeugt neue Bubble und speichert sie ins Array "bubbles"
		}
		console.log("Level: " + level);
		//TODO: Animation einfügen
	}
}

function startTimer() {
	//initialisiert den Interval, damit die Spielzeit gezählt werden kann
	interval = setInterval(timeIt, 100) //dank 100 zählt der time_counter in Millisekunden
}

function mousePressed() {
	//ruft für jede Bubble die Funktion clicked() auf, sobald die Maus gedrückt wird
	for (var i = 0; i < bubbles.length; i++) {
    bubbles[i].clicked();
  }
}

function keyPressed() {
	// überprüft gedrückte Tasten
	if (event.key === 'Escape') { //wenn [ESC] gedrückt wird
		console.log("Neustart");
		slider.remove();
		clearInterval(interval); //stoppt den timer;
		setup(); //führt setup() neu aus, damit Spiel zurückgesetzt wird
	}
	if (gamemode === 0 && event.key === 'Enter') { //wenn [ENTER] gedrückt wird, während Spielmodus auf 0 steht
		gamemode = 1; //setzt Spielmodus auf 1 (für laufendes Spiel)
		startTimer(); //startet den Timer, damit Spieldauer berechnet werden kann
		nextLevel(); //lädt das nächste Level (in diesem Fall das 1.)
  }
	if (gamemode === 0 && event.key === 'i') { //wenn [i] gedrückt wird, während Spielmodus auf 0 steht
		info = !info; //toggled "info"
	}
}
