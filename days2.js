// Tag 7 bis 12: Flüsterwald, Nebelsumpf, Hexenhütte
const WALD={mus:'wald',atmo:'wald_tag',acc:['eule','rabe','wolf'],every:15};

DAYS[7]={end:'Die Laterne leuchtet. Der Wald flüstert trotzdem weiter.',steps:[
 {bg:'ort07',...WALD},
 {s:'SL',t:'Der Flüsterwald. Er heißt so, weil die Bäume flüstern. Nicht, weil ich gerade so leise rede.'},
 {s:'SL',t:'Ich rede normal.'},
 {s:'GR',t:'Die Bäume sagen, wir sollen umkehren.'},
 {s:'SL',t:'Das sagen sie zu jedem. Das ist ihr Ding.'},
 {bg:'f_schild_weg'},
 {s:'SL',t:'Drei Wege, drei Wegweiser. Die Waldgeister haben sie verhext. Zwei von ihnen lügen, nur einer sagt die Wahrheit. Und nur das ehrliche Schild steht vor dem Weg nach Norden.'},
 {game:'schilder',wrong:[{s:'GR',t:'Den Baum kenne ich. Ich hab ihn Gerhard genannt.'},{s:'SL',t:'Zurück an den Anfang. Gerhard grüßt.'}]},
 {bg:'f_schild_m'},{s:'SCHM',t:'Na endlich. Ich bin das ehrliche Schild. Die zwei anderen schwindeln den ganzen Tag. Geradeaus geht es nach Norden.'},
 {bg:'f_schild_r'},{s:'SCHR',t:'Hihi. Erwischt.'},
 {bg:'ort07'},
 {s:'GR',t:'Eins, zwei, drei, vier, fünf, sechs, sieben. Eins …'},
 {s:'SL',t:'Wir haben Zeit. Also, wir haben siebzehn Nächte. Das ist ja Zeit.'},
 {item:'laterne'},{hide:1}
]};

DAYS[8]={end:'Ein Irrlicht leuchtet jetzt im Glas. Es kichert manchmal.',steps:[
 {bg:'ort08_leer',mus:'wald',atmo:'wald_nacht',acc:['eule','wolf'],every:14},
 {s:'SL',t:'Irrlichter. Wunderschön. Und hinterhältig. Wer ihnen folgt, landet im Sumpf. Wer sie ignoriert, landet … auch im Sumpf, aber später.'},
 {s:'GR',t:'Die sind so hell. Darf ich eins behalten?'},
 {s:'SL',t:'Die Irrlichter leuchten in einer Reihenfolge auf. Merk sie dir und tippe sie nach.'},
 {game:'irrlicht'},
 {item:'irrlicht'},
 {hide:1},{sfx:'eule',bg:'ort08'},{wait:1600},
 {s:'SL',t:'Ein Eulenbär. Bleib ganz ruhig. Keine schnellen Bewegungen.'},
 {choice:[
  {t:'Leise vorbeischleichen',go:[{probe:{stat:'dex',ziel:10,name:'Schleichen'},ok:[{s:'SL',t:'Er schaut nur. Lange. Aber nur.'}],fail:[{s:'SL',t:'Er schaut. Sehr nah. Du riechst jetzt nach Eule.'}]}]},
  {t:'Kann ich ihn streicheln?',go:[{s:'SL',t:'Natürlich fragt das jemand. Es fragt immer jemand.'},{sfx:'wuerfel'},{s:'SL',t:'Na gut. Du darfst.'},{s:'SL',t:'Er mag dich. Er mag dich zu sehr. Das ist jetzt deine Feder.'},{item:'eulenfeder'}]},
  {t:'Grumbold vorschicken',go:[{s:'GR',t:'Guten Abend. Entschuldigung. Wir gehen nur vorbei.'},{s:'SL',t:'Der Eulenbär verbeugt sich. Ich wusste nicht, dass die das können.'}]}]},
 {bg:'ort08_leer'},
 {s:'WG',note:1,t:'Drei Optionen für einen Bären. Sie verwöhnen Ihre Gäste.'},
 {s:'SL',t:'Er ist halb Eule. Also eigentlich nur anderthalb Optionen pro Tier.'},
 {s:'WG',t:'Bitte nicht rechnen.'},{hide:1}
]};

DAYS[9]={end:'Heute zum Ausdrucken: Zirpias Gefährtenbogen.',steps:[
 {bg:'ort09',mus:'mine',atmo:'spinnennest',acc:['tropfen'],every:12},
 {hide:1},{fn:async()=>{const p=playSong('zirpia_01',.9,16);for(const [img,ms] of [['f_zi3',3600],['f_zi1',3800],['f_zi4',3400],['f_zi2',3600]]){setBg(A+'img/'+img+'.jpg');await sleep(ms)}}},
 {bg:'f_zi3'},
 {s:'SL',t:'Hörst du das? Irgendwer singt der Spinnenkönigin ein Liebeslied.'},
 {s:'SL',t:'Gewagt.'},
 {bg:'f_zi1'},
 {s:'ZI',t:'Endlich! Publikum! Hallo! Ich bin Zirpia von Wiesengrund, die größte Bardin des Königreichs. Ich hänge hier nur kurz. Künstlerisch.'},
 {bg:'f_zi2'},
 {s:'SPK',t:'Sie singt seit drei Tagen. Ich will sie nicht mal mehr essen. Ich will nur Ruhe.'},
 {s:'SL',t:'Würfelt Initiative!'},
 {fight:'spinne'},
 {bg:'ort09_leer',mus:'wald'},
 {s:'ZI',t:'Das war die beste Rettung, die ich je erlebt habe. Ich werde eine Ballade darüber schreiben. Zwölf Strophen. Ihr habt fünfzig Spinnen besiegt.'},
 {s:'SL',t:'Es waren drei.'},
 {s:'ZI',t:'Fünfzig. Künstlerische Freiheit.'},
 {s:'GR',t:'Sie sitzt auf meiner Schulter. Herbert, schau. Sie sitzt auf meiner Schulter.'},
 {join:'zi'},
 {s:'SL',t:'Ich weiß jetzt schon, dass sie mir die Show stiehlt. Ich bin trotzdem froh, dass sie da ist.'},
 {loot:1},{hide:1}
]};

DAYS[10]={end:'Heute zum Ausdrucken: das Notenblatt Wiegenlied als Itemkarte.',steps:[
 {bg:'ort10',mus:'wald',atmo:'wald_tag',acc:['frosch','eule'],every:16},
 {s:'ZI',t:'Mein erster Auftritt. Vor echtem Publikum. Also, es sind Schnecken, aber echte Schnecken.'},
 {s:'ZI',t:'Ich hab nur ein winziges Problem. Mein Lied ist noch nicht fertig. Der Text hat Lücken.'},
 {s:'SL',t:'Das ist der Moment, in dem eine wahre Heldin hilft. Oder ein Held. Mit Reimen.'},
 {s:'SL',t:'Das stand so in meinen Notizen, ich kann nichts dafür.'},
 {s:'SL',t:'Nimm das Druckblatt Zirpias Liedtext. Fünf Wörter fehlen. Ihre Anfangsbuchstaben ergeben, was das Publikum am Ende rufen soll.'},
 {code:{id:'reim',k:'Zirpias Liedtext',q:'Was ruft das Publikum am Ende?',ph:'Lösungswort',h:['4d2e386e4c1b352b8645333b94558367a13d666cca2804f3a6bbcc25a8898a1c'],
  hints:['Sortiere die fünfzehn Wörter zuerst danach, auf welche Zeile sie sich reimen. Dann bleiben pro Zeile nur drei übrig.','Achte auf kleine Wörter im Text: ein ganzer, duftende rote, verliebt.','Bär, Rosen, angeschaut, vorbei, Ohr. Das Lösungswort ist BRAVO.']}},
 {s:'ZI',t:'Bravo! Das ist es! Das ist das schönste Wort der Welt!'},
 {s:'SL',t:'Jetzt fehlt nur noch der Takt. Tippe im Takt der Trommel mit.'},
 {game:'takt'},
 {sfx:'fanfare'},
 {s:'SL',t:'Stufe drei! Die Fanfare ist kürzer, wie versprochen. Wähle eine neue Fähigkeit.'},
 {levelup:3},
 {film:'z2'},
 {item:'wiegenlied'},{learn:'zi:schlaflied'},{hide:1}
]};

DAYS[11]={end:'Heute zum Ausdrucken: das Rätselblatt Nebelsumpf.',steps:[
 {bg:'ort11',mus:'sumpf',atmo:'nebelsumpf',acc:['frosch','rabe'],every:13},
 {s:'SL',t:'Der Nebelsumpf. Nur ein Pfad trägt. Alle anderen Steine … tragen nicht.'},
 {s:'GR',t:'Ich bin sehr schwer. Ich möchte das nur gesagt haben.'},
 {s:'ZI',t:'Keine Sorge, Großer. Wenn du sinkst, singe ich dir ein Abschiedslied. Es ist schon fertig.'},
 {fn:()=>playSong('zirpia_06',.8)},
 {s:'SL',t:'Nimm das Druckblatt Nebelsumpf. Dann tippe hier den Weg Stein für Stein nach.'},
 {game:'sumpf'},
 {item:'sumpfstiefel'},{loot:1},{hide:1}
]};

DAYS[12]={end:'Halbzeit. Noch zwölf Nächte.',steps:[
 {bg:'ort12',mus:'sumpf',atmo:'trank_blubbert',acc:['frosch','rabe'],every:14},
 {s:'HEX',t:'Kommt rein, kommt rein. Ich beiße nicht. Die Hütte manchmal.'},
 {s:'SL',t:'Hexe Holunda. Sie braut alles. Gegen Geld, gegen Gefallen oder gegen Dinge, die man lieber behalten hätte.'},
 {s:'HEX',t:'Ihr wollt zum Aschenkönig? Dann braucht ihr einen Feuerschutztrank. Ich braue ihn euch. Für einen Tausch.'},
 {if:()=>has('korken'),
  then:[{drop:'korken'},{s:'HEX',t:'Ein Korken! Aus dem schiefen Kessel! Den suche ich seit Jahren!'},{s:'SL',t:'Ich hab gesagt, der kommt wieder. Hab ich das gesagt? Ich hab es gedacht.'},{flag:'korken_tausch'}],
  else:[{s:'ZI',t:'Ich biete ein Lied! Ein Ständchen, nur für Sie!'},{fn:()=>playSong('zirpia_07',.8)},{s:'HEX',t:'Gut. Hauptsache, sie hört wieder auf.'}]},
 {s:'HEX',t:'Das Rezept hab ich nur noch als Reim im Kopf. Hör gut zu.'},
 {game:'trank'},
 {if:'korken_tausch',then:[{item:'feuerschutz',n:2}],else:[{item:'feuerschutz'}]},
 {s:'WG',note:1,t:'Zwischenbewertung, Tag zwölf. Erzählung: lebendig. Witze: zahlreich. Zu zahlreich. Bob: Bitte erklären Sie mir Bob.'},
 {s:'SL',t:'Verstanden. Ab jetzt nur noch ernste Erzählung.'},
 {s:'SL',t:'Der Nebel lichtete sich. Die Hexe nickte weise. Der Trank glühte in der Flasche.'},
 {s:'SL',t:'… und die Hütte hat sich hingesetzt wie ein Huhn. Entschuldigung. Das musste raus. Drei Sätze. Ich hab drei Sätze geschafft.'},
 {s:'WG',t:'Vier wären besser gewesen.'},
 {s:'SL',t:'Halbzeit. Wir sind genau in der Mitte. Wendelgard sagt, die Mitte ist ein Anfang. Nein, das hab ich gesagt.'},{hide:1}
]};

FILMS.z2={shots:[
 {img:'f_z2a',mus:null,atmo:'wald_nacht',s:'SL',t:'Und dann, zum ersten Mal in ihrem Leben, stand Zirpia von Wiesengrund vor echtem Publikum.'},
 {img:'f_z2a',fn:'ballade'},
 {img:'f_z2b',s:'ZI',t:'Sie lieben mich. Sie lieben mich wirklich.'},
 {img:'f_z2c',s:'GR',t:'Das war das Schönste, was ich je gehört habe. Und ich habe schon mal einen Kiesel ins Wasser fallen hören.'},
 {img:'f_tisch',sfx:'plattenkratzer',s:'SL',t:'Ich hab da was im Auge. Ein Würfel. Ich hab einen Würfel im Auge.'},
 {img:'f_z2b',mus:'wald',s:'ZI',t:'Für schwere Zeiten. Ein Wiegenlied. Das wirkt bei jedem. Sogar bei Drachen, vermutlich.'}
]};
