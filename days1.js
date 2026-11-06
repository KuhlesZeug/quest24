// Tag 1 bis 6: Morgentau und Graufels Mine
const DAYS={};
const DORF={mus:'dorf',atmo:'dorf_winter',acc:['wind_boe','hund_fern','glocke_fern'],every:16};

DAYS[1]={end:'Heute zum Ausdrucken: dein Heldenbogen, Teil 1 der Landkarte und der Würfelbogen.',steps:[
 {bg:'ort01',...DORF},
 {s:'SL',t:'Willkommen zur Sitzung Null. Hier entsteht deine Figur. Das ist der wichtigste Moment des ganzen Abenteuers.'},
 {s:'SL',t:'Also, einer der wichtigsten. Der Drache ist auch wichtig. Fangen wir an.'},
 {fn:async()=>{if(!st.hero){hideBox();await buildHero();show('#s-scene');music(A+'mus/dorf.mp3',.45);atmo(A+'atmo/dorf_winter.mp3',.6)}}},
 {bg:'ort01'},
 {s:'ALT',t:'{NAME}. Du bist die Einzige, die sich gemeldet hat. Also, die Einzige, die nicht schnell genug weggelaufen ist.',tm:'{NAME}. Du bist der Einzige, der sich gemeldet hat. Also, der Einzige, der nicht schnell genug weggelaufen ist.'},
 {s:'ALT',t:'Der Drache haust im Aschenland, hinter den Eisgipfeln. Bring uns die Lichternacht zurück.'},
 {s:'SL',t:'Und damit beginnt die Reise. Mit einem Auftrag, einer Karte und …'},
 {s:'ALT',t:'… und einem Butterbrot.'},
 {s:'SL',t:'… und einem Butterbrot. Steht nicht in meinen Notizen, aber gut.'},
 {item:'butterbrot'},{gold:10},{hide:1}
]};

DAYS[2]={end:'Der Kompass zeigt nach Norden. Fast immer.',steps:[
 {bg:'ort02',mus:'taverne',atmo:'taverne',acc:['krug','lachen','holz_knarzt'],every:12},
 {s:'SL',t:'Jedes große Abenteuer beginnt in einer Taverne. Das ist Gesetz. Ich habe nachgesehen.'},
 {bg:'f_tav_ecke'},
 {s:'SL',t:'Siehst du die Gestalt in der Ecke? Geheimnisvoll. Gefährlich. Würfle auf Wahrnehmung.'},
 {probe:{stat:'wis',ziel:10,name:'Wahrnehmung'},
  ok:[{s:'SL',t:'Du erkennst, dass es nur ein Mann ist, der seine Mütze nicht abnehmen will, weil er schlecht frisiert ist.'}],
  fail:[{s:'SL',t:'Du starrst ihn so lange an, bis er sich beschwert. Gleiches Ergebnis.'}]},
 {bg:'f_tav_kap'},
 {s:'KAP',t:'Was guckst du so? Meine Frau hat mir gestern die Haare geschnitten. Sie war dabei sehr wütend.'},
 {s:'SL',t:'Ich hatte ehrlich gesagt mehr erwartet.'},
 {bg:'f_tav_theke'},
 {s:'WIRT',t:'Du willst nach Norden? Dann brauchst du einen Kompass. Ich hab einen. Er ist in einem dieser drei Krüge.'},
 {s:'WIRT',t:'Auf jedem Krug steht ein Satz. Nur ein einziger Satz stimmt.'},
 {code:{id:'krug',k:'Das Rätsel des Wirts',q:'Krug A: Der Kompass ist in diesem Krug.<br>Krug B: Der Kompass ist nicht in diesem Krug.<br>Krug C: Der Kompass ist nicht in Krug A.<br><br>Nur ein Satz stimmt. Wo ist der Kompass?',opts:['Krug A','Krug B','Krug C'],a:1,
  hints:['Probiere es aus: Nimm an, der Kompass liegt in A. Wie viele Sätze stimmen dann?','Krug A und Krug C widersprechen sich direkt. Einer von beiden ist also immer wahr.','Weil A oder C immer wahr ist, muss Krug B gelogen haben. Der Kompass ist also in Krug B.'],
  wrongSteps:[{s:'SL',t:'Leer. Bis auf einen Korken. Den darfst du behalten.'},{if:()=>!has('korken'),then:[{item:'korken'}]}]},
  ok:[{sfx:'gegenstand'},{s:'WIRT',t:'Krug B. Na also. Der Kompass gehört dir.'}]},
 {item:'kompass'},
 {bg:'f_tav_ofen'},
 {s:'WG',note:1,t:'Der Witz mit der Kapuze. Mittelmäßig.'},
 {s:'SL',t:'Mittelmäßig ist gut. Mittelmäßig ist die Mitte. Die Mitte ist ein Anfang.'},{hide:1}
]};

DAYS[3]={end:'Heute zum Ausdrucken: die Beutetabelle und der erste Bogen Itemkarten.',steps:[
 {bg:'f_tav_theke',mus:'taverne',atmo:'taverne',acc:['krug','lachen'],every:14},
 {s:'WIRT',t:'Ach, und da du schon mal hier bist … im Keller sind Ratten.'},
 {s:'SL',t:'Ratten im Keller. Die erste Quest. Die älteste Quest der Welt. Ich hab Gänsehaut.'},
 {bg:'ort03',atmo:'hoehle',acc:['tropfen','ratte_quiek'],every:9,sfx:'tuer_knarzt'},
 {s:'SL',t:'Würfelt Initiative! … Würfle Initiative.'},
 {fight:'ratten'},
 {bg:'ort03',mus:'dorf'},
 {s:'SL',t:'Gewonnen! Und jetzt kommt mein Lieblingsteil. Die Beutetabelle.'},
 {s:'SL',t:'Ich habe sie selbst geschrieben. Nummer siebenundvierzig ist mein Lieblingseintrag. Mehr sage ich nicht.'},
 {loot:1},{item:'heiltrank'},{xp:10},{hide:1}
]};

DAYS[4]={end:'Heute zum Ausdrucken: Grumbolds Gefährtenbogen.',steps:[
 {bg:'ort04',mus:'mine',atmo:'hoehle',acc:['tropfen','stein_rieseln'],every:10},
 {s:'GR',t:'Eins. Zwei. Drei. Vier. Fünf. Sechs. Sieben.'},
 {wait:1200},
 {s:'GR',t:'Eins. Zwei …'},
 {s:'SL',t:'Jemand zählt. Und kommt nicht über die Sieben. Das ist entweder sehr unheimlich oder sehr traurig.'},
 {s:'SL',t:'Vier alte Messingspiegel hängen an den Wänden. Dreh sie so, dass das Licht deiner Laterne bis in die hintere Kammer fällt.'},
 {game:'spiegel'},
 {sfx:'licht_an'},
 {s:'GR',t:'Oh. Oh! Licht. Danke. Ich … ich mag das Dunkle nicht so. Das ist peinlich für einen Golem aus einer Mine, ich weiß.'},
 {s:'GR',t:'Ich bin Grumbold. Das hier ist Herbert. Herbert ist ein Kiesel.'},
 {s:'SL',t:'Ich mag ihn. Ich darf das nicht sagen. Ich bin neutral.'},
 {s:'SL',t:'Ich mag ihn sehr.'},
 {s:'GR',t:'Darf ich mitkommen? Ich bin groß. Ich kann Dinge tragen. Und ich kann bis sieben zählen.'},
 {join:'gr'},{hide:1}
]};

DAYS[5]={end:'Heute zum Ausdrucken: die Runenschablone. Du brauchst sie morgen.',steps:[
 {bg:'ort05',mus:'mine',atmo:'hoehle',acc:['tropfen','stein_rieseln','laterne_zischt'],every:9},
 {s:'GR',t:'Wenn die Lampen ausgehen, dürfen wir dann einfach umkehren? Kleine Frage.'},
 {s:'SL',t:'Eine Schatztruhe. Mitten im Gang. Völlig unbewacht. Würfle auf Wahrnehmung.'},
 {probe:{stat:'wis',ziel:12,name:'Wahrnehmung'},
  ok:[{s:'SL',t:'Du siehst die Zähne im Spalt. Die Truhe ist ein Monster. Eine Schnappkiste!'},
   {choice:[{t:'Vorsichtig um die Truhe herumgehen',go:[{s:'SL',t:'Ihr schleicht vorbei. Die Truhe schmollt.'}]},
    {t:'Ihr den Korken zum Kauen geben',need:()=>has('korken'),go:[{drop:'korken'},{sfx:'kauen'},{s:'SL',t:'Sie kaut. Sie schnurrt. Sie folgt euch. Ich glaube, ihr habt jetzt ein Haustier. Für einen Tag.'},{flag:'kiste'}]}]}],
  fail:[{sfx:'biss'},{s:'SL',t:'Die Truhe beißt dich. Ich hab dich gewarnt. Also, ich hab gesagt, würfle. Das ist eine Warnung in Spielleitersprache.'}]},
 {s:'SL',t:'Und da flattert schon etwas aus dem Dunkel. Aschenmotten. Sie fressen Licht.'},
 {fight:'motten'},
 {bg:'ort05'},
 {sfx:'fanfare'},
 {s:'SL',t:'Stufe zwei! Wähle eine neue Fähigkeit.'},
 {levelup:2},
 {s:'WG',note:1,t:'Die Fanfare war zu lang.'},
 {s:'SL',t:'Ich kürze sie. Für Stufe drei. Versprochen.'},
 {loot:1},{hide:1}
]};

DAYS[6]={end:'Grumbolds Glut leuchtet heller als je zuvor.',steps:[
 {bg:'ort06',mus:'mine',atmo:'hoehle',acc:['tropfen','glut_knistern'],every:11},
 {s:'GR',t:'Hier … hier bin ich gemacht worden. Ich erinnere mich an die Wärme.'},
 {s:'SL',t:'Die Runen an der Wand verraten, wie man das Feuer wieder weckt. Leider sind es viele Runen. Sehr viele.'},
 {s:'SL',t:'Leg die Runenschablone von gestern auf das Druckblatt Runenwand.'},
 {code:{id:'runen',k:'Die Runenwand',q:'Welches Wort ergeben die Runen unter der Schablone?',ph:'Wort eingeben',h:['cf462ff3ce8c1b827bf28c86e4b4d57cfa42646edd114fc9e776b04bbe61b94b'],
  hints:['Die Schablone von gestern gehört auf die Runenwand. Achte auf das kleine Glutsteinzeichen in der Ecke.','Lies die Löcher wie ein Buch: Zeile für Zeile, von links nach rechts. Übersetze mit dem Runenalphabet.','Die Runen ergeben HERZFEUER.']}},
 {sfx:'feuer_entfacht'},
 {s:'GR',t:'Oh. Das ist … warm.'},
 {s:'SL',t:'Manchmal reicht ein bisschen Licht, damit jemand merkt, dass er selbst leuchtet.'},
 {s:'SL',t:'Das war gut, oder? Das war gut. Meisterin Wendelgard, das war gut.'},
 {item:'glutstein'},{learn:'gr:glutfaust'},{xp:10},
 {film:'z1'},
 {bg:'ort06'},
 {s:'WG',note:1,t:'Das mit dem Auge. Gut.'},
 {s:'SL',t:'Sie hat gut gesagt. Sie hat gut gesagt!'},{hide:1}
]};

FILMS.z1={shots:[
 {img:'f_z1a',mus:'bedrohlich',atmo:'wald_nacht',s:'SL',t:'In derselben Nacht kam er zurück.'},
 {img:'f_z1b',pan:1,s:'SL',t:'Er brüllte nicht. Er zerstörte nichts. Er nahm nur die Lichter. Eines nach dem anderen.'},
 {img:'f_z1c',s:'SL',t:'Und keines davon wärmte ihn.'},
 {img:'f_z1d',d:2200},
 {img:'f_tisch',mus:null,sfx:'plattenkratzer',s:'SL',t:'Das war übrigens euer Dorf. Nur damit ihr Bescheid wisst.'},
 {s:'SL',t:'Kein Druck.'}
]};
