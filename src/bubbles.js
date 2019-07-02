function Bubble(x, y, size) {
  this.x = x; //Bubble-Ursprungskoordinate(X)
  this.y = y; //Bubble-Ursprungskoordinate(Y)
  this.size = size; //Bubblegröße
  this.col = color(255, 100); //Initialfarbe
  this.xdirection = 1; //physikalisch korektes abprallen
  this.ydirection = 1; //physikalisch korektes abprallen
  this.growth = 1; //Wachstumsrichtung
  this.coin = 0; //0:bubble ist ungeklickt, 1:bubble wurde geklickt

  this.display = function() {
    // zeigt Bubble an (durch draw-loop entsteht Animationseffekt)
    stroke(255);
    fill(this.col);
    ellipse(this.x, this.y, this.size, this.size); //zeigt Bubble an bestimmtem Punkt
  }

  this.clicked = function() {
    //Ändert Farbe der geklickten Bubble
    var d = dist(mouseX, mouseY, this.x, this.y); //Strecker 2er Punkte
    if (d < this.size / 2) { //Wenn Strecke < Bubbleradius (Mausklick innerhalb Bubblefläche)
      this.col = color(244, 134, 66); //färbt Bubble orange
      this.coin = 1; //bubble wurde geklickt
    }
  }

  this.resize = function(min, max, power) {
    //Größenveränderungs-Effekt (Wie Atmung)
    this.size = this.size + (power * this.growth); //bubble wächst/schrumpft je nach this.growth
    if (this.size > max || this.size < min) { //wenn bubble zu groß/klein
      this.growth *= -1; //Wachstumsänderung (*-1)
    }
  }

  this.bounce = function(xspeed, yspeed) {
    // Wand-Bounce-Effekt
    this.x = this.x + (xspeed * this.xdirection); //Geschwindigkeit der Bewwegung in X-Richtung (horizontal)
    this.y = this.y + (yspeed * this.ydirection); //Geschwindigkeit der Bewwegung in Y-Richtung (vertikal)
    if (this.x > width - this.size/2 || this.x < this.size/2) { //wenn Bubble berührt Wand
      this.xdirection *= -1; //Richtungswechsel
    }
    if (this.y > height - this.size/2 || this.y < this.size/2) { //wenn Bubble berührt Wand
      this.ydirection *= -1; //Richtungswechsel
    }
  }

  this.quake = function(left, right, top, down) {
    // Erdbeeben-Effekt
    this.x = this.x + random(-left, right); //zufälliger X-Wert zwischen left und right
    this.y = this.y + random(-top, down); //zufälliger Y-Wert zwischen top und down
    //Die nächsten Zeilen bewirken einen Effekt wie bei Pacman (der Code spricht für sich)
    //links raus, rechts rein bzw. oben raus, unten rein -> die Bubble kann nicht entkommen
    if (this.x > width) {
      this.x = this.x - width;
    }
    if (this.x <= 0) {
      this.x = this.x + width;
    }
    if (this.y > height) {
      this.y = this.y - height;
    }
    if (this.y <= 0) {
      this.y = this.y + height;
    }
  }

  this.getCoin = function() {
    //gibt an, ob Bubble schon geklickgwurde (als int, nicht boolean)(0,1)
    return this.coin;
  }
}
//Wenn eine Bubble gleicheitig rezise(), quake() und bounce()aktiv hat, weiß man nie,
//ob sie als nächstes von der Wand abprallt, oder den Pacman-Effekt macht
