// Tag 13 bis 18: Moorsee, Banditenschlucht, Goldhafen, Lagerfeuer, Eisbrücke
WHO.BOB2={n:'Bob der Zweite',p:'p_bob'};

DAYS[13]={end:'Heute zum Ausdrucken: Teil 2 der Landkarte.',steps:[
 {bg:'ort13',mus:'sumpf',atmo:'nebelsumpf',acc:['frosch','rabe'],every:12},
 {s:'KROK',t:'Halt. Dies ist meine Furt. Wer hinüber will, zahlt. Oder kämpft. Oder zahlt und kämpft, das hatten wir auch schon.'},
 {s:'SL',t:'Der Krokodilkönig. Er hat sich selbst gekrönt. Niemand hat ihm widersprochen. Aus naheliegenden Gründen.'},
 {s:'ZI',t:'Deine Krone ist schief.'},
 {s:'KROK',t:'Sie ist nicht schief. Sie sitzt … königlich.'},
 {s:'SL',t:'Würfelt Initiative!'},
 {fight:'krok'},
 {bg:'ort13_leer',mus:'sumpf'},
 {s:'KROK',t:'Ihr dürft sagen, dass ich tapfer war.'},
 {gold:30},{loot:1},
 {film:'z3'},{hide:1}
]};
FILMS.z3={shots:[
 {img:'f_z3a',mus:'rueckblende',atmo:null,s:'SL',t:'Vor sechzig Jahren war es in Eldmark in der Lichternacht nie dunkel.'},
 {img:'f_z3a',s:'SL',t:'Jedes Jahr flog Vharkon auf den Gipfel der Winde. Er holte tief Luft …'},
 {img:'f_z3b',sfx:'feuerball',s:'SL',t:'… und entzündete den Lichternachtstern.'},
 {img:'f_z3c',pan:1,s:'SL',t:'Und dann saßen sie da, der Drache und sein Freund, und schauten zu, wie das ganze Land leuchtete.'},
 {img:'f_tisch',mus:null,d:1200},
 {s:'SL',t:'Hm.',gap:1600}
]};

DAYS[14]={end:'Heute zum Ausdrucken: Oma Huldas Gefährtenbogen.',steps:[
 {bg:'ort14',mus:'hafen',atmo:'lagerfeuer',acc:['pferd','wolf'],every:16},
 {s:'SL',t:'Eine arme alte Frau, gefangen von Banditen! Wir müssen …'},
 {s:'SL',t:'Moment. Warum weinen die Banditen?'},
 {s:'KNO',t:'Bitte. Bitte nehmt sie mit. Wir haben sie entführt, um Lösegeld zu kriegen. Dann hat sie Karten vorgeschlagen.'},
 {s:'HU',t:'Kindchen, ihr wolltet doch spielen.'},
 {s:'KNO',t:'Sie hat unser ganzes Gold. Unsere Stiefel. Und Gerds Zähne. Die waren nicht mal echt.'},
 {s:'HU',t:'Ich lass euch nur gehen, wenn ihr mir eine Revanche anbietet. Ich bin ja kein Unmensch.'},
 {s:'SL',t:'Die Rettung ist also eine Verhandlung. Mit den Banditen. Für die Banditen.'},
 {s:'SL',t:'Knorz will wenigstens einmal gewinnen. Du spielst für die Banditen. Tipp in fünf Runden, ob die nächste Karte höher oder tiefer ist. Aber nicht zu oft richtig.'},
 {game:'karten'},
 {if:()=>st.flags.karten===5,then:[{s:'KNO',t:'Wieder verloren. Ich will nach Hause.',e:'sad'},{s:'HU',t:'Kindchen, ein bisschen Taktgefühl.',e:'sly'}]},
 {if:()=>st.flags.karten<=3,then:[{s:'HU',t:'Du hast das Talent deiner Großmutter. Also meins nicht.',e:'sly'}]},
 {if:()=>st.flags.karten===4,then:[{s:'KNO',t:'Gewonnen! Ich hab gewonnen! Sie darf gehen.',e:'laugh'}]},
 {sfx:'truhe'},
 {s:'HU',t:'Na, dann komm ich mal mit. Ihr seht alle viel zu dünn aus. Und der Große hier braucht dringend einen Schal.'},
 {s:'GR',t:'Ich habe noch nie einen Schal gehabt.'},
 {s:'HU',t:'Bis heute Abend hast du einen. Rot. Steht dir.'},
 {s:'ZI',t:'Und ich? Bekomme ich auch etwas?'},
 {s:'HU',t:'Du bekommst einen Fingerhut. Als Hut. Der passt dir.'},
 {s:'ZI',t:'Ein Krönchen!'},
 {s:'SL',t:'Und so wächst die Gruppe. Ein Golem, eine Grille und eine Oma. Ich hab das nicht so geplant. Es ist besser, als ich es geplant hatte.'},
 {join:'hu'},
 {s:'SL',t:'Gesinnung: chaotisch gut. Mit Betonung auf chaotisch.'},
 {fn:()=>playSong('zirpia_08',.9)},
 {s:'HU',t:'Hübsch. Ein bisschen schnell.'},
 {gold:40},{item:'stricknadel'},{hide:1}
]};

DAYS[15]={end:'Heute zum Ausdrucken: die Ladenliste von Goldhafen.',steps:[
 {bg:'ort15',mus:'hafen',atmo:'markt_goldhafen',acc:['moewe','glocke'],every:12},
 {s:'SL',t:'Goldhafen. Die reichste Stadt des Königreichs. Und Oma Huldas alte Heimat.'},
 {s:'HU',t:'Der da schuldet mir was. Die da auch. Und der. Der eigentlich nicht, aber er weiß es nicht.'},
 {s:'BOB',t:'Hallo, ich bin Bob.'},
 {s:'BOB2',t:'Hallo, ich bin auch Bob. Sein Bruder.'},
 {s:'SL',t:'Bob! Und noch ein Bob! Meisterin Wendelgard, Sie wollten Bob erklärt bekommen. Das hier ist die Erklärung.'},
 {s:'WG',note:1,t:'Das erklärt gar nichts.'},
 {s:'HU',t:'Vier Händler, Kindchen. Genau einer betrügt, und der lügt immer. Die anderen drei sagen immer die Wahrheit.'},
 {code:{id:'betrug',k:'Wer betrügt?',q:'Bob: Berta betrügt nicht.<br>Bob der Zweite: Ferdinand betrügt.<br>Berta: Einer der beiden Bobs betrügt.<br>Ferdinand: Bob der Zweite lügt.<br><br>Wer ist der Betrüger?',opts:['Bob','Bob der Zweite','Berta','Ferdinand'],a:1,
  hints:['Nimm nacheinander an, jeder der vier wäre der Betrüger, und prüfe, ob dann alle Sätze zusammenpassen.','Bob der Zweite und Ferdinand widersprechen sich direkt. Einer von beiden muss der Betrüger sein.','Wäre Ferdinand der Betrüger, müsste Berta lügen. Berta ist aber ehrlich. Bob der Zweite betrügt.'],
  wrongSteps:[{s:'SL',t:'Er ist ehrlich. Und jetzt traurig. Er schenkt euch trotzdem einen Apfel. Gut gemacht.'}]},
  ok:[{s:'BOB2',t:'Erwischt. Ich wollte euch einen Heiltrank aus Apfelsaft verkaufen.'},{s:'BOB',t:'Ich schäme mich für dich, Bob.'},{s:'BOB2',t:'Ich mich auch, Bob.'}]},
 {s:'SL',t:'Der Laden ist offen. Kauf ein, was du brauchst.'},
 {game:'laden'},
 {if:()=>!has('stange'),then:[{s:'BOB',t:'Nimm die Stange mit, sie steht mir im Weg.'},{item:'stange'}]},
 {s:'SL',t:'Eine drei Meter Stange. Wer kauft so was? Wofür? Ich frage für einen Freund.'},
 {fn:()=>playSong('zirpia_09',.85)},
 {s:'SL',t:'Stufe vier! Ohne Fanfare. Nur ich. Tadaaa.'},
 {levelup:4},
 {s:'WG',note:1,t:'Besser als die Fanfare.'},{hide:1}
]};

DAYS[16]={end:'Hulda hat ein altes Zeitungsblatt eingesteckt. Ganz schnell.',steps:[
 {bg:'ort16',mus:'hafen',atmo:'hafen',acc:['moewe','holz_knarzt'],every:14},
 {s:'HU',t:'Hier hab ich früher gewohnt. Unter der dritten Diele vom Fenster liegt mein altes Werkzeug. Und ein paar Fallen. Von mir. Für Leute wie mich.'},
 {s:'SL',t:'Bevor jemand irgendwohin tritt: Suchst du nach Fallen?'},
 {choice:[{t:'Ja, nach Fallen suchen',go:[{probe:{stat:'wis',ziel:11,name:'Fallen suchen',bonus:()=>st.hero.skills.includes('finger')?4:0},
   ok:[{s:'HU',t:'Gutes Auge. Den hab ich vor sechzig Jahren gespannt.'}],
   fail:[{sfx:'tuer_knarzt'},{s:'SL',t:'Eine Klappe öffnet sich, und du stehst knietief in Wollknäueln. Ich habe gefragt. Ich frage immer. Das ist mein Job.'}]}]},
  {t:'Nein, einfach losgehen',go:[{sfx:'tuer_knarzt'},{s:'SL',t:'Eine Klappe öffnet sich, und du stehst knietief in Wollknäueln. Ich habe gefragt. Ich frage immer. Das ist mein Job.'}]}]},
 {s:'HU',t:'Drei Kisten. Ganz sanft, Kindchen, wie beim Plätzchenbacken.'},
 {game:'schloss'},
 {item:'stahlnetz'},{learn:'hu:stahlfalle'},
 {film:'z4'},{hide:1}
]};
FILMS.z4={shots:[
 {img:'f_z4a',mus:'gauner',s:'SL',t:'Goldhafen, vor sechzig Jahren! Die Schatzkammer des Bürgermeisters! Sieben Wachen! Drei Schlösser! Und sie: Hulda Fingerfix, zwanzig Jahre alt, schneller als ihr eigener Schatten!'},
 {img:'f_z4b',s:'SL',t:'Oh, das Seil ist zu kurz! Das ist ein Problem! Das ist … Sie lässt sich einfach fallen! Sie landet! Eine Zehn von zehn!'},
 {img:'f_z4c',s:'SL',t:'Glück! Pures Glück! Das ist kein Können mehr, das ist Frechheit!'},
 {img:'f_z4d',s:'SL',t:'Sie nimmt nur eine Münze! Und hinterlässt ein Plätzchen! Warum? Wir werden es nie erfahren!'},
 {img:'ort17',mus:null,atmo:'lagerfeuer',s:'HU',t:'Weil man immer etwas zurücklässt, Kindchen. Das gehört sich so.'},
 {s:'HU',t:'Fast immer.',gap:1200},
 {img:'f_tisch',sfx:'plattenkratzer',s:'SL',t:'Das fast immer hab ich mir notiert. Das ist wichtig. Ich weiß nur noch nicht, warum.'}
]};

DAYS[17]={end:'Alle tragen jetzt einen roten Schal. Auch Herbert.',steps:[
 {bg:'ort17',mus:'eis',atmo:'lagerfeuer',acc:['wolf','eule'],every:16},
 {s:'SL',t:'Lange Rast. Alle Lebenspunkte und Fähigkeiten werden aufgefüllt. Und ich mache Tee. Also nicht wirklich, aber ich mache mir wirklich Tee. Hier am Tisch.'},
 {s:'ZI',t:'Es ist so k k kalt.'},
 {s:'HU',t:'Großer, komm mal her.'},
 {s:'GR',t:'Ihr … ihr wärmt euch an mir.'},
 {s:'HU',t:'Natürlich, Kindchen. Du bist das wärmste Ding im ganzen Gebirge.'},
 {s:'GR',t:'Ich dachte immer, meine Glut ist zu schwach für irgendwas.'},
 {s:'SL',t:'Am Lagerfeuer kannst du jedem eine Frage stellen. Für jedes Gespräch bekommst du einen Vertrauensmarker.'},
 {choice:[{t:'Grumbold: Woher hast du Herbert?',go:[{s:'GR',t:'Er lag in der Mine. Ganz allein. Ich dachte, er braucht jemanden. Dann hab ich gemerkt, dass ich jemanden brauche.'}]},
  {t:'Grumbold: Wovor hast du außer Dunkelheit noch Angst?',go:[{s:'GR',t:'Dass ich zu schwer bin. Für Brücken. Und für Freunde.'},{s:'HU',t:'Kindchen. Unsinn.'}]}]},
 {fn:()=>{st.insp=(st.insp||0);st.flags.trust=(st.flags.trust||0)+1;save()}},
 {choice:[{t:'Zirpia: Warum hast du vorher nur für Pilze gespielt?',go:[{s:'ZI',t:'Pilze buhen nicht. Pilze gehen nicht früher. Pilze sind das sicherste Publikum der Welt.'}]},
  {t:'Zirpia: Was ist dein größter Traum?',go:[{s:'ZI',t:'Einmal einem Drachen ein Lied singen, das ihm gefällt.'},{flag:'traum'}]}]},
 {fn:()=>{st.flags.trust=(st.flags.trust||0)+1;save()}},
 {choice:[{t:'Hulda: Warum hast du aufgehört zu stehlen?',go:[{s:'HU',t:'Weil man irgendwann merkt, dass man das Wichtigste nicht in der Schürze tragen kann.'}]},
  {t:'Hulda: Was stand auf dem Zeitungsblatt?',go:[{s:'HU',t:'Altes Zeug, Kindchen. Iss ein Plätzchen.'},{flag:'zeitung'}]}]},
 {fn:()=>{st.flags.trust=Math.min(3,(st.flags.trust||0)+1);save();toast('Drei Vertrauensmarker für den Drachenkampf')}},
 {fn:()=>playSong('zirpia_10',.85)},
 {s:'SL',t:'Und in dieser Nacht lernte Grumbold, dass Wärme nicht davon abhängt, wie hell man leuchtet. Sondern davon, wer neben einem sitzt.'},
 {s:'SL',t:'Das war schön. Ich sag nichts mehr.'},
 {s:'SL',t:'Das war sehr schön.'},
 {learn:'gr:waermherz'},{item:'schal'},
 {sfx:'rohrpost'},
 {s:'SL',t:'Sie hat mir einen Keks geschickt. Was bedeutet das? Ist das gut? Das ist gut, oder?'},{hide:1}
]};

DAYS[18]={end:'Heute zum Ausdrucken: das Rätselblatt Eisbrücke mit den Figuren zum Ausschneiden.',steps:[
 {bg:'ort18',mus:'eis',atmo:'eisbruecke',acc:['eis_knackt'],every:9},
 {s:'SL',t:'Die Eisbrücke. Sie trägt. Aber nicht alles. Und nicht jeden. Und nicht im Dunkeln.'},
 {s:'HU',t:'Die Brücke trägt höchstens hundert Stein. Wer ohne Licht geht, fällt.'},
 {s:'GR',t:'Wir haben doch noch das Irrlicht im Glas.'},
 {s:'HU',t:'Irrlichter über Abgründen sind verboten. Sie locken Wanderer hinunter.'},
 {s:'SL',t:'Das Irrlicht bleibt also im Glas. Es ist schon beleidigt. Man sieht es.'},
 {s:'SL',t:'Und jetzt das Wichtigste: Die Gruppe darf sich auf keinen Fall aufteilen. Teilt niemals die Gruppe.'},
 {s:'SL',t:'Außer hier. Hier müsst ihr. Tut mir leid.'},
 {code:{id:'bruecke',k:'Die Eisbrücke',q:'Wie oft muss die Laterne mindestens über die Brücke getragen werden, bis alle vier drüben sind?<br><small>Die Regeln und Figuren stehen auf deinem Druckblatt.</small>',ph:'Zahl',h:['4445dfc1947ace4ae6d3233a48f8d5271c099bc44e6bfeb38a087acc40f72359','9a098e82ab550682a1fc998410e715c0bb7c1773cdccea7541ba4bd434d222a3'],
  hints:['Grumbold ist so schwer, dass er nur mit einer einzigen Figur zusammen gehen kann. Mit wem?','Grumbold und Zirpia gehen in der Mitte hinüber, nicht am Anfang und nicht am Ende.','Zwei hin, einer zurück, Grumbold mit Zirpia hin, Zirpia zurück, die letzten zwei hin. Die Antwort ist 5.'],
  wrongSteps:[{sfx:'eis_knackt'},{s:'ZI',t:'Das war eine Note. Ein tiefes C. Und jetzt ein noch tieferes.'},{s:'SL',t:'Zurück! Alle zurück! Wir zählen nochmal.'}]}},
 {sfx:'schritte'},
 {s:'GR',t:'Zu weit weg.'},
 {s:'HU',t:'Viel zu weit.'},
 {s:'SL',t:'Und jetzt … holst du die drei Meter Stange heraus.'},
 {sfx:'gegenstand'},
 {s:'SL',t:'Die Stange. Die drei Meter Stange. Ich hab mein ganzes Leben auf diesen Moment gewartet.'},
 {s:'WG',note:1,t:'Ich gebe zu: Das war gut aufgebaut.'},
 {item:'eishaken'},{hide:1}
]};
