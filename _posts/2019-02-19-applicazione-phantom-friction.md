---
layout: post
title: L'applicazione Phantom Friction
tags: [haptic feedback, pure data]
---

{% include tesi-disclaimer.html %}


Scopo del lavoro
----------------

Per poter integrare la simulazione aptica di una tessitura con la
simulazione sonora si è reso necessario scrivere un'applicazione che
implementi tutti i concetti visti finora.

{% include image-cap.html url="images/phantomfriction.jpg" description="Interfaccia grafica dell'applicazione Phantom Friction" %}

Dato che nei nostri scopi non rientra la realizzazione di particolari
tessiture grafiche o nessun altro tipo di algoritmo di computer
graphics, l'interfaccia (mostrata in figura) risulta molto semplice; tuttavia è
chiara, user--friendly ed efficace (come vedremo) per un'interazione da
parte dell'utente di tipo bimodale. Il nostro obiettivo infatti è
permettere all'utente di *sentire* uno o più oggetti virtuali
utilizzando i sensi del tatto e dell'udito; non vogliamo assolutamente
fornire suggerimenti di tipo grafico, perché, come molti studi di
Lederman e Klatzky {% cite art:lederman1 %} hanno dimostrato, ciò falserebbe la
percezione aptica e uditiva. Secondo tali ricerche il senso della vista
quasi sempre prevale sugli altri sensi quando è utilizzato per
riconoscere oggetti. In particolare sembra che la vista prevalga
soprattutto quando è richiesto di riconoscere le proprietà macroscopiche
di un oggetto, come la sua forma o le tessiture che caratterizzano la
sua superficie; il tatto invece viene usato quasi quanto la vista nel
riconoscimento della ruvidità.

L'applicazione Phantom Friction è stata realizzata in C/C++, su sistema
operativo Microsoft Windows. Le librerie utilizzate sono tutte
multipiattaforma, quindi con poche modifiche al codice è possibile
effettuare il porting su altri sistemi operativi, come Linux. Allo
stesso modo le patch per Pure Data possono essere riutilizzate in Linux.

Tale applicazione implementa solamente la simulazione grafica e aptica,
non la simulazione audio. Per quanto riguarda quest'ultima si sono
sfruttate le patch in Pure Data già descritte: una loro nuova
implementazione in un linguaggio di programmazione quale il C++ sarebbe
stata problematica, in quanto sarebbe stato necessario riscrivere non
solo gli algoritmi, ma anche tutte le funzioni già implementate come
primitive in PD. D'altro canto non è stato possibile implementare le
parti grafica e aptica in PD. Come si è detto, esistono librerie come
GEM che permettono di unire la simulazione grafica a quella audio con
l'utilizzo di semplici moduli che realizzano oggetti tridimensionali in
OpenGL, ma non è possibile l'integrazione con le funzioni aptiche. Si
potrebbe anche pensare di realizzare un oggetto per PD, appoggiandosi
eventualmente alla libreria flext, che integri le funzioni aptiche e
grafiche, ma ciò introdurrebbe un overhead troppo elevato, tanto da
rendere la simulazione troppo pesante in termini di risorse di calcolo
anche per computer potenti. Si vede quindi che la soluzione di
realizzare da un lato la simulazione grafica/aptica in C/C++ e
dall'altro la simulazione audio in PD risulta la scelta migliore.

Implementazione grafica
-----------------------

La simulazione grafica è stata realizzata in OpenGL utilizzando le
librerie incluse nel toolkit OpenHaptics . Dal momento che queste
librerie sono state precompilate per essere usate con l'ambiente di
programmazione *Visual Studio .NET* di Microsoft, è necessario
ricompilarle se devono essere usate con un altro ambiente. Nel nostro
caso l'applicazione è stata sviluppata in *Visual Studio 2005*: perciò è
stato necessario effettuare il download del pacchetto `glui_v2_2.zip`
(<http://glui.sourceforge.net/>); una volta scompattato il file, sarà
presente una directory `msvc` contenente i file dei progetti da aprire
con Visual Studio e ricompilare.

### Rappresentazione della scena

Tramite un parallelepipedo è stata rappresentata la superficie sulla
quale un cursore a forma di piccolo cono (controllato tramite il
Phantom  Omni) può muoversi; questa superficie è piana, di un solo
colore, priva di texture e non viene mai variata, in accordo con la
condizione secondo la quale non devono essere dati suggerimenti visivi
sul tipo di superficie. Il parallelepipedo viene creato come lista
composta da un solo oggetto:

```
DraggableObject dro;
dro.displayList = glGenLists(1);
dro.transform = hduMatrix::createTranslation(surfx,surfy,surfz);
glNewList(dro.displayList, GL_COMPILE);
drawSurface(1000.0f, 800.0f, 20.0f, texturized);
glEndList();
draggableObjects.push_back(dro);
```

dove il metodo `drawSurface` costruisce il parallelepipedo
specificandone i vertici, accettando come argomenti le dimensioni del
parallelepipedo lungo gli assi $$x$$, $$z$$ e $$y$$ e un valore booleano che
indica se all'oggetto deve essere applicata la texture grafica associata
(tale valore è sempre impostato a falso nell'attuale implementazione).
Il comando
```
glCallList(obj.displayList);
```
effettua il rendering a video della superficie. E' possibile aggiungere
alla lista altri oggetti, nel caso ad esempio si volessero rappresentare
più superfici o aggiungere poligoni in modo da rendere più complessa la
forma della superficie; le modifiche alle proprietà aptiche e grafiche
effettuate sulla lista verranno propagate contemporaneamente a tutti gli
oggetti della lista. Anche il cursore, rappresentato da un cono, viene
disegnato come una lista costituita da un oggetto singolo tramite la
funzione:
```
redrawCursor(const boolean& h, const int& nShadow);
```
il parametro booleano `h` deve essere impostato a 1 se si vuole che
venga fatto sia il rendering grafico che aptico del cursore, mentre
impostandolo a 0 verrà fatto solo il rendering grafico; il secondo
parametro è utilizzato nel calcolo delle ombre. Le istruzioni per il
rendering grafico sono le seguenti:
```
gCursorDisplayList = glGenLists(1);
glNewList(gCursorDisplayList, GL_COMPILE);
qobj = gluNewQuadric();
gluQuadricDrawStyle(qobj,GLU_FILL);
gluQuadricNormals(qobj,GLU_SMOOTH);
gluQuadricOrientation(qobj,GLU_OUTSIDE);
gluCylinder(qobj, 0, 5, 15, 30, 1);
glTranslatef(0, 0, 15);
gluDisk(qobj, 0, 5, 30, 1);
gluDisk(qobj, 0, 1, 15, 1);
gluDeleteQuadric(qobj);
glEndList();
```
Dal momento che il proxy è rappresentato da un unico punto nello spazio,
l'istruzione `glTranslatef(0, 0, 15)` permette di traslare il cono lungo
l'asse $$y$$ in modo tale che la sua punta coincida con la posizione del
proxy.

Tramite i comandi:
```
glBlendFunc(GL_SR_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
glEnable(GL_BLEND);
glEnable(GL_POINT_SMOOTH);
glHint(GL_POINT_SMOOTH_HINT, GL_NICEST);
glEnable(GL_LINE_SMOOTH);
glHint(GL_LINE_SMOOTH_HINT, GL_NICEST);
glEnable(GL_POLYGON_SMOOTH);
glHint(GL_POLYGON_SMOOTH_HINT, GL_NICEST);
```
contenuti all'interno della routine `initGL()` è stato aggiunto il
supporto all'anti--aliasing; l'effettivo uso di tale tecnica di
rendering dipende tuttavia dalle impostazioni dell'hardware grafico.

### Rendering delle ombre

Una caratteristica grafica che si è voluta implementare per aumentare il
realismo dello scenario senza aggiungere troppi dettagli è costituita
dalle ombre; questa scelta è opportuna in quanto le ombre forniscono
informazioni circa la posizione degli oggetti l'uno rispetto agli altri
(e rispetto alla sorgente di luce, anche quando questa non viene
rappresentata nella scena), ma non forniscono informazioni circa le
proprietà aptiche, il materiale di cui è costituito l'oggetto o le sue
tessiture più di quanto non faccia già la rappresentazione priva di
ombre.

Un'ombra viene prodotta quando una fonte di luce colpisce un oggetto che
oscura un altro oggetto o una superficie; i lati del primo oggetto che
non vengono colpiti dalla luce vengono rappresentati con un colore più
scuro, ma di default non viene proiettata nessuna ombra sugli altri
oggetti o sulle superfici. Anche se esistono diversi modi per
implementare questa caratteristica, la nostra attenzione si è
focalizzata su due di questi.

#### Trasposizione bidimensionale dell'oggetto

Con questo metodo, disegnare un'ombra è semplice: si crea una copia
"appiattita" dell'oggetto e la si trasla secondo una matrice di
trasposizione per farla giacere sullo stesso piano sul quale giace
l'oggetto; la forma e la dimensione di questa trasposizione sono
determinate dalla posizione della fonte di luce. Nelle librerie
`glTools` {% cite book:openglsuperbible %} è contenuta la funzione
`gltMakeShadowMatrix` che calcola la matrice di trasposizione sul piano
bidimensionale; richiede in input un vettore di tre punti giacenti sul
piano sul quale si vuole far apparire l'ombra, un vettore contenente la
posizione della sorgente di luce e un puntatore alla matrice di
trasformazione che deve essere creata.
```
void gltMakeShadowMatrix(GLTVector3 vPoints[3], GLTVector4 vLightPos, GLTMatrix destMat)
{
    GLTVector4 vPlaneEquation;
    GLfloat dot;
    gltGetPlaneEquation(vPoints[0], vPoints[1],  vPoints[2], vPlaneEquation);

    // Prodotto punto per punto dei vettori contenenti
    // le posizioni del piano e della luce
    dot = vPlaneEquation[0]*vLightPos[0] +
          vPlaneEquation[1]*vLightPos[1] +
          vPlaneEquation[2]*vLightPos[2] +
          vPlaneEquation[3]*vLightPos[3];

    // Calcolo della matrice di proiezione
    // Prima colonna
    destMat[0]  = dot  - vLightPos[0] * vPlaneEquation[0];
    destMat[4]  = 0.0f - vLightPos[0] * vPlaneEquation[1];
    destMat[8]  = 0.0f - vLightPos[0] * vPlaneEquation[2];
    destMat[12] = 0.0f - vLightPos[0] * vPlaneEquation[3];

    // Seconda colonna
    destMat[1]  = 0.0f - vLightPos[1] * vPlaneEquation[0];
    destMat[5]  = dot  - vLightPos[1] * vPlaneEquation[1];
    destMat[9]  = 0.0f - vLightPos[1] * vPlaneEquation[2];
    destMat[13] = 0.0f - vLightPos[1] * vPlaneEquation[3];

    // Terza colonna
    destMat[2]  = 0.0f - vLightPos[2] * vPlaneEquation[0];
    destMat[6]  = 0.0f - vLightPos[2] * vPlaneEquation[1];
    destMat[10] = dot  - vLightPos[2] * vPlaneEquation[2];
    destMat[14] = 0.0f - vLightPos[2] * vPlaneEquation[3];

    // Quarta colonna
    destMat[3]  = 0.0f - vLightPos[3] * vPlaneEquation[0];
    destMat[7]  = 0.0f - vLightPos[3] * vPlaneEquation[1];
    destMat[11] = 0.0f - vLightPos[3] * vPlaneEquation[2];
    destMat[15] = dot  - vLightPos[3] * vPlaneEquation[3];
}
```
Moltiplicando la matrice ottenuta per la matrice della vista corrente,
tutte le modifiche successive vengono trasposte sul piano. Nella nostra
applicazione la sorgente di luce ha coordinate $$x$$ e $$z$$ nulle, quindi è
stato necessario effettuare i calcoli relativi solo alla seconda colonna
della matrice (infatti i calcoli relativi alle altre colonne
restituiscono sempre $$0$$).

Come si può ben capire, questa tecnica può essere utilizzata solo in
rendering di scene nelle quali è presente un solo oggetto su un piano,
oppure con più oggetti giacenti sullo stesso piano ma opportunamente
spaziati (in modo che non ci si aspetti che un oggetto proietti la
propria ombra su un altro), in quanto l'ombra viene proiettata solamente
sul piano e non sugli altri poligoni.

{% include image-cap.html url="images/shadow1.jpg" description="Esempio di ombre ottenute tramite trasposizione bidimensionale degli oggetti" %}


#### Shadow mapping

Questa tecnica è più complessa, ma l'idea su cui si basa è molto
semplice: le zone in ombra sono quelle che non vengono colpite dalla
luce. Se poniamo il nostro punto di vista nella stessa posizione in cui
si trova la luce e guardiamo nella direzione in cui quest'ultima è
diretta, vediamo tutto quello che dovrà essere illuminato; ciò che non
vediamo è in ombra.

Effettuando il rendering della scena dal punto di vista della sorgente
di luce, otteniamo un depth buffer contenente, per ogni pixel, le
informazioni circa la distanza relativa tra questa sorgente e la
superficie più vicina in una certa direzione; questa superficie è
illuminata, tutte quelle che si trovano oltre restano nell'ombra.
L'algoritmo di shadow mapping consiste proprio nell'effettuare il
rendering della scena dal punto di vista della sorgente di luce, copiare
successivamente il contenuto del depth buffer in una texture, fare il
rendering dal punto di vista della camera e applicare la nuova texture
per determinare le zone di ombra.

Nell'applicazione Phantom Friction la tecnica di shadow mapping non
viene utilizzata di default; per attivarla è sufficiente compilare il
codice specificando la direttiva `_SHADOWMAPPING_` per il preprocessore.
L'inizializzazione è contenuta nella routine `ShadowMappingInit()`, la
quale comprende il caricamento delle texture che non devono essere
modificate e l'abilitazione dell'estensione `GL_ARB_shadow` (se
disponibile, questa estensione consente di eseguire un passaggio in meno
nel calcolo delle ombre). La funzione di callback per il ridisegno della
scena è:

```
void glutDisplay()
{ 
  ShadowMappingFirst(gCameraPosWC);
  drawScene();
  ShadowMappingSecond();
  RegenerateShadowMap(light0_position, shadowSize);
}
```

Per prima cosa vengono impostate le luci:

```
glLightfv(GL_LIGHT0, GL_AMBIENT, ambientLight);
glLightfv(GL_LIGHT0, GL_DIFFUSE, diffuseLight);
```

si effettua un confronto sulle ombre e si imposta il piano della visuale
corrente:

```
glEnable(TEXTURETYPE);
glTexEnvi(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_MODULATE);
glTexParameteri(TEXTURETYPE, GL_TEXTURE_COMPARE_MODE, 
                                        GL_COMPARE_R_TO_TEXTURE);
glTexParameteri(TEXTURETYPE, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(TEXTURETYPE, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

glEnable(GL_TEXTURE_GEN_S);
glEnable(GL_TEXTURE_GEN_T);
glEnable(GL_TEXTURE_GEN_R);
glEnable(GL_TEXTURE_GEN_Q);
glTexGenfv(GL_S, GL_EYE_PLANE, sPlane);
glTexGenfv(GL_T, GL_EYE_PLANE, tPlane);
glTexGenfv(GL_R, GL_EYE_PLANE, rPlane);
glTexGenfv(GL_Q, GL_EYE_PLANE, qPlane);
```

Tramite i comandi:

```
glMatrixMode(GL_MODELVIEW);
glLoadIdentity();
gluLookAt(light[0], light[1], light[2], 
                    0.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f);
glGetFloatv(GL_MODELVIEW_MATRIX, lightModelview);
glViewport(0, 0, shadowsize, shadowsize)
```

viene spostato il punto di vista in corrispondenza della sorgente di
luce. Si copia il contenuto del depth buffer in una texture
bidimensionale:

```
glCopyTexImage2D(TEXTURETYPE, 0, GL_DEPTH_COMPONENT,
                  0, 0, shadowsize, shadowsize, 0);
```

Al successivo rendering della scena si torna alla prospettiva originale
con i comandi:
```
glMatrixMode(GL_PROJECTION);
glLoadIdentity();
gluPerspective(40.0f, 1.0f, 274.0f, 1899.0f);
glMatrixMode(GL_MODELVIEW);
glLoadIdentity();
gluLookAt(cam[0], cam[1], cam[2], 0.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f);
glViewport(0, 0, windowWidth, windowHeight);
```

{% include image-cap.html url="images/shadow2.jpg" description="Esempio di applicazione dello shadow
mapping." %}


#### Scelta della tecnica di rendering delle ombre

Nell'applicazione Phantom Friction l'unico oggetto che deve proiettare
un'ombra è il cursore, e la proietta su un piano; quindi la tecnica più
adatta (e implementata di default) è la trasposizione bidimensionale.
Effettuando questa scelta si è anche tenuto conto del fatto che questa
tecnica è meno dispendiosa in termini di risorse di calcolo rispetto
allo shadow mapping, e quindi è meno probabile che causi il verificarsi
di latenze. Il cursore viene disegnato tramite il comando:

```
redrawCursor(true,0);
```

poi viene trasposto e disegnato una seconda volta, questa volta come
ombra:

```
glMultMatrixf((GLfloat *)shadowMat);
redrawCursor(true,1);
```

L'unico inconveniente nel quale si incorre è che, se il cursore viene
spostato oltre il limite della superficie, l'ombra viene disegnata lo
stesso, anche se l'utente si aspetta di non vederla; per ovviare a
questo problema sono state apportate due semplici modifiche:

-   l'ombra viene disegnata solo se la posizione lungo l'asse $y$ del
    proxy è maggiore o uguale della posizione del piano lungo lo stesso
    asse;

-   l'ombra e lo sfondo hanno lo stesso colore: in tal modo, quando
    l'ombra esce dalla superficie, si confonde con lo sfondo e, per
    l'occhio umano, non è distinguibile da questo.

### Aggiunta di texture grafiche

E' stata prevista la possibilità di aggiungere texture grafiche
bidimensionali alle superfici degli oggetti, anche se ciò non rientra
negli scopi dell'applicazione in quanto la percezione visiva di una
tessitura distoglie l'utente dalle percezioni aptiche e uditive; tale
caratteristica è disattivata per default, e per attivarla occorre
procedere alla ricompilazione del codice sorgente includendo la stringa
`_TEXTURE` tra le direttive del preprocessore.

La funzione:

```
loadTexture();
```

carica in memoria tutte le texture indicate nell'array `textureFiles`; è
sufficiente effettuare il caricamento durante l'inizializzazione
dell'applicazione, successivamente le texture resteranno disponibili in
memoria fino alla chiusura dell'applicazione stessa. Il comando:

```
glBindTexture(GL_TEXTURE_2D,textures[n]);
```

è utilizzato per applicare effettivamente la texture in posizione $n$
nell'array all'oggetto corrente.

Implementazione aptica
----------------------

### Rendering aptico degli oggetti virtuali

Per l'implementazione del rendering grafico si sono utilizzate sia le
HDAPI che le HLAPI. Le HLAPI sono molto utili quando si vogliono
impostare le proprietà aptiche degli oggetti virtuali e per gestire i
frame; ad esempio, per effettuare il rendering aptico della superficie
sono sufficienti le seguenti istruzioni:

```
hlBeginShape(HL_SHAPE_FEEDBACK_BUFFER, obj.shapeId);

hlMaterialf(HL_FRONT_AND_BACK, HL_STIFFNESS, obj.hap_stiffness);
hlMaterialf(HL_FRONT, HL_DAMPING, obj.hap_damping);
hlMaterialf(HL_FRONT, HL_STATIC_FRICTION, obj.hap_static_friction);
hlMaterialf(HL_FRONT, HL_DYNAMIC_FRICTION, obj.hap_dynamic_friction);

glCallList(obj.displayList);

hlEndShape();
```

con le quali vengono impostate la rigidità, il coefficiente di
smorzamento, frizione statica e frizione dinamica. Le primitive grafiche
utilizzate sono davvero poche, e ciò consiglia l'utilizzo del feedback
buffer per il rendering aptico (e di conseguenza anche per il rendering
grafico); questo viene impostato tramite il primo argomento di
`hlBeginShape`.

Nella rappresentazione del cursore non devono essere impostate proprietà
aptiche, ma è necessario calcolare le traslazioni e le trasformazioni
del proxy:

```
hlGetDoublev(HL_PROXY_TRANSFORM, proxytransform);
glMultMatrixd(proxytransform);
```

Tutti i comandi riguardanti il rendering grafico della superficie, del
cursore e delle ombre sono contenuti all'interno di un blocco
`hlBeginFrame`--`hlEndFrame`:

```
hlBeginFrame();

glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

// disegna la superficie
drawDraggableObjects(false,0);

glPushMatrix();
glEnable(GL_LIGHTING);
glLightfv(GL_LIGHT0,GL_POSITION,lightPos);

// disegna il cursore
redrawCursor(true,0);

glPopMatrix();
glDisable(GL_DEPTH_TEST);
glDisable(GL_LIGHTING);
glPushMatrix();

// disegna l'ombra del cursore
hlGetDoublev(HL_PROXY_POSITION, posHD);
if(posHD[1] > minCursorY )
{
    glMultMatrixf((GLfloat *)shadowMat);
    redrawCursor(true,1);
}

// ripristina la normale prospettiva
glPopMatrix();

glEnable(GL_DEPTH_TEST);

hlEndFrame();
```

Sempre utilizzando le HLAPI è stata abilitata l'ottimizzazione *haptic
camera view*:
```
hlEnable(HL_HAPTIC_CAMERA_VIEW);
```
in modo che venga effettuato il rendering aptico anche della porzione di
superficie non visibile nella scena. Con l'istruzione:
```
hlHinti(HL_SHAPE_FEEDBACK_BUFFER_VERTICES, 100);
```
viene allocata memoria per 100 vertici, sufficienti per la
rappresentazione in feedback buffer delle poche primitive usate; ciò si
traduce in un risparmio di memoria in quanto di default viene riservata
memoria sufficiente per 65536 vertici.

### Rilevamento dei contatti e rendering delle tessiture aptiche

Tutte le istruzioni viste fino a questo punto sono sufficienti a fare in
modo che, tramite l'uso del Phantom  Omni , il parallelepipedo possa
essere avvertito come un oggetto solido, senza la possibilità di
penetrarlo. Tuttavia le proprietà aptiche restano costanti lungo tutta
la superficie dell'oggetto; se si aggiunge il fatto che tale superficie
è piana, si può intuire come questa sia costituita da una tessitura
aptica uniforme su tutto l'oggetto. Durante la simulazione bimodale
(cioè quando le simulazioni aptica e sonora sono eseguite
contemporaneamente) si viene ad avvertire così una superficie che al
tatto si presenta come costantemente ruvida (con livello di ruvidità
proporzionale ai valori scelti di frizione statica e dinamica)
accompagnata da suoni di sfregamento che descrivono una tessitura
frattale e non costante. La discrepanza tra le due modalità non è
avvertibile quando vengono simulate superfici lisce o poco ruvide,
mentre si fa più evidente all'aumentare della ruvidità. Sono state
valutate le seguenti metodologie per l'effettiva implementazione di una
tessitura aptica.

#### Modifica della geometria della superficie

La superficie viene avvertita apticamente come piana in quanto
graficamente è piana. Un modo per far avvertire una superficie ruvida è
modificarne la geometria, con l'aggiunta ad esempio di diversi poligoni
a forma di piccoli coni che ne rappresentino le asperità; aggiungendo
queste primitive alla lista contenente il parallelepipedo, tutti gli
oggetti avranno le stesse proprietà aptiche e verranno rappresentati
(sia dal punto di vista grafico che dal punto di vista aptico) come un
unico oggetto. Disponendo i piccoli coni in modo opportuno, si ottiene
una superficie che può essere avvertita come ruvida da entrambi i punti
di vista aptico e grafico, e il livello di ruvidità dipende dalla
dimensione, quantità e disposizione dei coni.

Tale soluzione però contrasta con i nostri scopi in quanto si dà un
chiaro suggerimento visivo all'utente sulla tipologia di superficie,
facendo passare totalmente in secondo piano le caratteristiche aptiche e
sonore.

Si potrebbe pensare di rappresentare le asperità (cioè i piccoli coni)
solo dal punto di vista aptico e non da quello grafico; dato che anche
tutte le primitive vengono rappresentate come oggetti solidi (e quindi
non penetrabili dalla sonda), con tale metodo si verrebbero a creare
zone in cui il proxy si "blocca" senza urtare la porzione di superficie
rappresentata graficamente (si verifica un urto aptico ma non un urto
grafico), portando ad una notevole discrepanza tra le componenti
aptica/grafica e creando di conseguenza solo confusione nell'utente.

#### Modifica delle proprietà aptiche secondo pattern geometrici

Una seconda soluzione consiste nel modificare le proprietà aptiche della
superficie lungo la superficie stessa, invece di mantenerle costanti. Il
coefficiente di rigidità non può essere variato in quanto il
parallelepipedo che rappresenta la superficie deve essere avvertito
sempre come solido; la modifica del coefficiente della forza di
smorzamento non influenza il rendering aptico in questa implementazione;
quindi gli unici due parametri che possono essere variati sono le
frizioni statica e dinamica. Entrambe sono forze che si oppongono al
movimento tangenziale di un corpo.

Se pensiamo ad una superficie liscia come una superficie sulla quale i
corpi strisciano senza incontrare resistenza, mentre pensiamo ad una
superficie ruvida come una superficie sulla quale gli oggetti strisciano
incontrando una forza di resistenza ogniqualvolta urtano un'asperità,
allora vediamo come un aumento improvviso del coefficiente di frizione
statica in alcuni punti può simulare la presenza di asperità in questi
stessi punti, senza ricorrere a variazioni della geometria dell'oggetto.

In una prima implementazione si è scelto di mantenere i coefficienti
delle due frizioni costanti e inferiori a 0.5 (ricordiamo che i
coefficienti possono assumere valori compresi tra 0 e 1) nella
simulazione di superfici lisce o poco lisce. Per le superfici ruvide i
coefficienti vengono mantenuti ad un valore basso (0.2) e incrementati
solo in alcuni punti, determinati in base alle coordinate geometriche
del punto stesso: se il cursore si trova a contatto con la superficie e
la sua posizione lungo l'asse $$x$$ soddisfa la condizione:

```
(( (int)posHD[0]*10  ) % 2) != 0
```

(dove `posHD[0]` indica la posizione del proxy lungo l'asse $$x$$) allora
la frizione viene impostata ad un valore tanto più elevato quanto più
ruvida deve risultare la superficie. Dal momento che si considera solo
l'asse $$x$$, le asperità vengono posizionate lungo linee parallele
all'asse $$z$$ e giacenti sullo stesso piano della superficie (ovvero
quello determinato dagli assi $$x$$ e $$z$$).

Se la precedente condizione viene sostituita dalla seguente:

```
( (int)( sqrt(posHD[0]*posHD[0]+posHD[2]*posHD[2])*10  ) % 2) != 0
```

(dove `posHD[0]` indica ancora la posizione del proxy lungo l'asse $$x$$,
mentre `posHD[2]` indica la posizione lungo l'asse $$z$$), le asperità
vengono posizionate secondo cerchi concentrici giacenti sul piano $$xz$$.

Possono essere implementati facilmente altri pattern geometrici; i
micro--contatti dei quali viene simulato il suono emesso non sono però
disposti secondo pattern regolari, ma casualmente secondo un pattern
frattale. Rimane quindi una certa discrepanza tra le sensazioni aptiche
e le sensazioni uditive per superfici non lisce.

#### Modifica delle proprietà aptiche secondo pattern frattali

Il passo successivo consiste nella creazione di una tessitura aptica
frattale.

Si potrebbe pensare di scrivere una funzione che implementi l'algoritmo
discusso nel [post sui modelli audio]({{ site.baseurl }}{% link _posts/2019-01-29-pure-data-modelli-audio.md %}); ciò introdurrebbe un ulteriore
appesantimento nel carico computazionale, senza garantire che il pattern
generato nella patch per PD e quello implementato nell'applicazione
varino concordemente. Il metodo più semplice e più efficiente risulta
invece quello di utilizzare i dati calcolati nella subpatch
`holy-roller~`. Il blocco `circ_max_filter~` calcola il
profilo della superficie sulla quale avvengono i micro--contatti; il
valore inviato in output viene letto dall'applicazione Phantom Friction
(vedremo nella prossima sezione come avviene questa lettura) e,
opportunamente scalato, viene utilizzato come coefficiente di
proporzionalità per i valori di frizione statica e dinamica.

Nella sezione "Rendering delle tessiture aptiche" di [questo post]({{ site.baseurl }}{% link _posts/2019-02-05-dispositivi-aptici.md %}) sono state analizzate diverse
tecniche di rendering delle tessiture. Quella qui implementata può
essere descritta come una perturbazione delle forze (senza l'utilizzo
della formula di Max e Becker); inoltre, in modo simile a quanto avviene
per le tessiture aptiche basate sulle immagini, come indicatore della
profondità della tessitura viene usato il valore del profilo della
superficie calcolato nelle patch in Pure Data.

Per implementare questo procedimento sono state utilizzate tre funzioni
di callback. La prima rileva il verificarsi del primo contatto tra proxy
e superficie e imposta a `true` un valore booleano:

```
void HLCALLBACK touchCallback(HLenum event, 
                              HLuint object, 
                              HLenum thread,HLcache *cache, 
                              void *userdata)
{
    touching = true;
}
```

La seconda invece imposta questo valore a `false` quando il proxy non è
più in contatto con la superficie:
```
void HLCALLBACK untouchCallback(HLenum event, 
                                HLuint object, 
                                HLenum thread, 
                                HLcache *cache, 
                                void *userdata)
{
    touching = false;
}
```

Tale valore booleano viene usato dalla terza funzione di callback come
condizione di abilitazione del calcolo (e del conseguente invio alla
patch in PD) della velocità corrente e del fattore di amplificazione
proporzionale alla forza normale.

```
HDCallbackCode HDCALLBACK velocitaCallback(void *pUserData)
{
    if ( touching )
    {
        // richiesta della velocità corrente
        hdGetDoublev(HD_CURRENT_VELOCITY, veloHD);
        // richiesta della forza corrente
        hdGetDoublev(HD_CURRENT_FORCE, forceHD);

        velocita = sqrt( pow(veloHD[0],2) + pow(veloHD[2],2) );
                
        // scrittura in memoria dei dati aptici dello scenario
        setOpeData( &data,
                (float)( sqrt( abs(velocita * forceHD[1]) )/1000 ), 
                velocita/1000, 
                0,
                sceneDepth[indexScene],
                0,
                0,
                sceneNoiseFile[indexScene]);
        
        WriteOpeData(&data);
        
        pdSurface = ReadSurface();
        
        hap_static_friction = ( pdSurface - a )/ ( b );
    }
    else
    {
        setOpeData( &data, 0, sceneDepth[indexScene], 0, 0, 
                                0, 0, sceneNoiseFile[indexScene]);
        
        WriteOpeData(&data);
    }
    
    return HD_CALLBACK_CONTINUE;
}
```

Questa callback è stata implementata utilizzando le HDAPI come callback
asincrona, in modo tale che venga eseguita non appena viene schedulata.
Ciò è importante in quanto qui vengono generate le tessiture aptiche, e
tale funzione deve essere eseguita alla velocità propria del rendering
aptico, applicando l'effetto ad ogni iterazione del servo loop.
L'istruzione

```
hap_static_friction = ( pdSurface - a )/ ( b );
```

imposta i coefficienti di frizione al valore ricevuto da PD
(`pdSurface`) e opportunamente scalato nell'intervallo `(a,b)`, dove `a`
è impostato a $$0$$ (si suppone che la superficie abbia sempre un valore
positivo) e `b` corrisponde a $$0.04$$ (calcolato empiricamente). La
velocità viene calcolata come modulo delle componenti lungo gli assi $$x$$
e $$z$$ (il piano su cui giace la superficie) e viene divisa per 1000 per
adeguarla alle unità di misura usate dalla patch `sliding.pd`: in
quest'ultima la velocità è assunta in $$m/s$$, mentre le HDAPI ritornano
tale valore in $$mm/s$$. Tramite l'istruzione:

```
sqrt( abs(velocita * forceHD[1]) ),
```

dove `forceHD[1]` è la componente della forza esercitata dal dispositivo
aptico lungo l'asse $$y$$, viene calcolato il fattore di proporzionalità
dell'ampiezza del suono rispetto alla forza normale (vedi pagina ).

Scambio dei dati tra l'applicazione Phantom Friction e le patch in Pure Data
----------------------------------------------------------------------------

Punto cruciale dello sviluppo di questa applicazione è stata
l'implementazione di un'interfaccia di comunicazione con Pure Data, in
modo da consentire lo scambio dei dati tra i due processi in tempo reale
durante la simulazione bimodale. E' stato importante curare questo
aspetto perché la comunicazione dei dati deve avvenire alla stessa
frequenza del rendering aptico, quindi 1000 volte al secondo; se le
operazioni di scambio di informazioni svolte ad ogni ciclo sono troppo
onerose, si rischia di introdurre latenze eccessive.

La simulazione bimodale ha significato se gli stimoli aptico, visivo e
uditivo vengono percepiti dall'utente simultaneamente. Possiamo
distinguere tre momenti ad ogni ciclo della simulazione: il momento in
cui il proxy incontra una asperità, il momento in cui il dispositivo
aptico rileva questo contatto e invia una forza in retroazione e il
momento in cui viene generato il suono per questo evento. Tutti e tre i
momenti elencati devono essere distanti (nel tempo) tra di loro il meno
possibile, in accordo con la percezione dell'utente; se uno dei tre
momenti è temporalmente troppo distante dagli altri (si verifica cioè
una latenza), lo stimolo associato verrà percepito come estraneo
all'evento. Se invece tutti e tre gli stimoli si verificano con latenze
minori di certi livelli, allora verranno percepiti come contemporanei e
l'utente li individuerà come componenti di uno stesso evento.

Si possono distinguere latenze *intramodali* e latenze *intermodali*:

- latenze intramodali: le latenze intramodali si verificano tra stimoli dello stesso tipo:
    tra due stimoli sonori, tra due stimoli aptici o tra due stimoli
    visivi; i valori di latenza minimi percepibili variano a seconda
    della modalità considerata e corrispondono a 2 millisecondi per il
    suono, 27 millisecondi per il tatto e 43 millisecondi per la vista
    {% cite proc:levitin %};

- latenze intermodali: le latenze intermodali si verificano tra stimoli di tipo diverso (ad
    esempio si considera la latenza dello stimolo sonoro rispetto agli
    stimoli visivo e aptico), e i valori minimi sono diversi a seconda
    che lo stimolo preceda o segua gli altri: se un suono precede gli
    stimoli visivo e aptico, la massima latenza accettata è di 25
    millisecondi, mentre se li segue tale latenza sale a 42 millisecondi
    {% cite proc:levitin %}.

Se consideriamo che Pure Data, sintetizzando i suoni a 44100 Hz e avendo
un buffer di 64 campioni, introduce una latenza di 1,45 millisecondi,
mentre nell'applicazione Phantom Friction l'uso delle HLAPI introduce
una latenza di 10 millisecondi (per le HDAPI la latenza è di 1
millisecondo), si vede che resta un margine di circa 15 millisecondi per
una discrepanza temporale tra gli stimoli che sia accettabile.

Le soluzioni per la comunicazione tra i due processi sono essenzialmente
tre {% cite phd:crosato %}.

#### Protocollo di rete

Dato che in Pure Data è supportata la lettura dei dati (via protocollo
TCP e UDP) tramite l'oggetto `netreceive~`, sarebbe sufficiente
implementare la lettura/scrittura dei dati nell'applicazione Phantom
Friction tramite l'uso dei socket. Il vantaggio è che i due processi
potrebbero così comunicare anche in remoto, facendo eseguire la
simulazione aptica e quella sonora su due macchine diverse. Lo
svantaggio è che la latenza dipende fortemente dalle caratteristiche
dell'interfaccia di rete della macchina e dal traffico presente sulla
rete. Inoltre viene ridotta la portabilità del codice, in quanto la
programmazione dei socket in C++ è dipendente dal sistema operativo.

#### Driver di periferica

Si potrebbe creare un external per Pure Data che legga i dati
utilizzando i driver del dispositivo Phantom  Omni . Questa soluzione è
notevolmente complessa, a causa della scarsità di documentazione in
merito e a causa del fatto che non si potrebbero estrarre i dati
relativi alla geometria degli oggetti e agli istanti di collisione.
Inoltre resterebbe irrisolto il problema di poter leggere i dati di Pure
Data tramite l'applicazione Phantom Friction.

#### Memoria condivisa

{% include image-cap.html url="images/memoria_condivisa.jpg" description="" %}

La tecnica più efficiente si è rivelata la predisposizione di un'area di
memoria condivisa per la lettura/scrittura dei dati da parte di entrambi
i processi. Lo svantaggio di questa soluzione è che dipende dalla
piattaforma sulla quale il programma viene eseguito; inoltre Pure Data
non possiede un oggetto interno che implementi una funzione utile allo
scopo, perciò è stato necessario scrivere un external. Il vantaggio
maggiore (che compensa gli svantaggi citati) è la velocità con la quale
avvengono le operazioni di lettura e scrittura.

In particolare è stata creata una struttura dati che contenga tutti i
valori che dovranno essere trasferiti dall'applicazione Phantom Friction
a Pure Data:

```
typedef struct
{
    double nForce;
    double velocita;
    float kappa;
    float depth;
    float statFr;
    float dynFr;
    int noiseFile;
}  OpeData;
```

I valori che costituiscono la struttura `OpeData` sono i seguenti:

-   `nForce` è la radice quadrata del prodotto tra forza normale e
    velocità;

-   `velocita` indica la velocità corrente del proxy in $m/s$;

-   `kappa` è il coefficiente di elasticità della superficie;

-   `depth` è il fattore di amplificazione del segnale di rumore
    frattale;

-   `statFr` è il coefficiente di frizione statica;

-   `dynFr` è il coefficiente di frizione dinamica;

-   `noiseFile` è un numero intero che indica l'indice del file
    contenente il rumore frattale.

Nell'implementazione attuale solo i valori `nForce`, `velocita`, `depth`
e `noiseFile` vengono effettivamente utilizzati. Infatti la patch in PD
non ha bisogno di conoscere i coefficienti di frizione statica e
dinamica, mentre il coefficiente di elasticità resta invariato per
scelte implementative. E' possibile modificare i valori che fanno parte
della struttura dati tramite la funzione:

```
void setOpeData(OpeData *data, double nForce, 
                                double velocita, float kappa, 
                                float depth, float statFr, 
                                float dynFr, int noiseFile)
{
    data->nForce=nForce;
    data->velocita=velocita;
    data->kappa=kappa;
    data->depth=depth;
    data->statFr=statFr;
    data->dynFr=dynFr;
    data->noiseFile=noiseFile;
}
```

La gestione della memoria è implementata nel file `PhantomMemory.h`.
Tramite la seguente funzione avviene la creazione dell'area di memoria
condivisa tra i processi:

```
HANDLE hFile;

int CreatePhantomMemory()
{
    hFile = CreateFileMappingW(INVALID_HANDLE_VALUE,NULL,PAGE_READWRITE,
                                                                        0,sizeMem,(LPCWSTR)"PhantomMemory");
    if (hFile == NULL)
    {
        printf("ERROR: Unable to create a fileMapping.\n");
        return 1;
    }
    
    hView = MapViewOfFile(hFile,FILE_MAP_ALL_ACCESS,0,0,0);
    
    if (hView == NULL)
    {
        printf("ERROR: Unable to map a viewOfFile.\n");
        return 2;
    }
    return 0;
}
```

E' importante fare attenzione al parametro `sizeMem`, il quale indica la
dimensione dell'area di memoria condivisa e viene utilizzato anche per
calcolare la posizione dei diversi dati in memoria; un valore errato di
`sizeMem` porta alla scrittura e lettura di dati errati.

Il codice seguente si occupa dell'apertura e chiusura dell'area di
memoria:

```
int OpenPhantomMemory(void)
{
    hFile = OpenFileMappingW(FILE_MAP_ALL_ACCESS,FALSE,
                            (LPCWSTR)"PhantomMemory");
    if (hFile == NULL)
    {
        printf("ERROR: Unable to open the FileMapping.\n");
        return 3;
    } 
    
    hView = MapViewOfFile(hFile,FILE_MAP_ALL_ACCESS,0,0,0);
    
    if (hView == NULL)
    {
        printf("ERROR: Unable to open the FileMapping.\n");
        return 4;
    }
    hookOped = (OpeData*)(hView);
    hookSurface = (float*)(hookOped+1);
    return 0;
}

int ClosePhantomMemory(void)
{
    if (!UnmapViewOfFile(hView))
    {
        printf("ERROR: Could not unmap viewOfFile.\n");
        return 5;
    }
    CloseHandle(hFile);
    return 0;
}
```

Un oggetto `OpeData` può essere scritto in memoria e letto dalla memoria
usando le due funzioni `WriteOpeData(OpeData *elemento)` e
`ReadOpeData()` (nella prima deve essere passato come parametro un
puntatore all'oggetto):

```
void WriteOpeData(OpeData *elemento)
{
    hookOped->nForce = elemento->nForce;
    hookOped->velocita = elemento->velocita;
    hookOped->kappa = elemento->kappa;
    hookOped->depth = elemento->depth;
    hookOped->statFr = elemento->statFr;
    hookOped->dynFr = elemento->dynFr;
    hookOped->noiseFile = elemento->noiseFile;
}

OpeData ReadOpeData()
{
    return *hookOped;
}
```

Con semplici modifiche a questi due comandi si implementano la scrittura
e lettura del valore della superficie generata dall'oggetto
`circ_max_exp~`:

```
void WriteSurface(float *elemento)
{
    *hookSurface = *elemento;
}

float ReadSurface()
{
    return *hookSurface;
}
```

### La scrittura e la lettura della memoria da parte dell'applicazione Phantom Friction

E' l'applicazione Phantom Friction che si occupa di creare l'area di
memoria condivisa, e lo fa non appena viene avviata; subito dopo la
memoria viene aperta e si crea un oggetto `data` di tipo `OpeData`
contenente tutti i valori impostati a $$0$$, il quale viene scritto
assieme ad un valore nullo di `pdSurface` allo scopo di effettuare
un'inizializzazione della memoria stessa, cancellando eventuali dati
presenti. All'interno della callback asincrona `velocitaCallback`, dopo
aver calcolato i valori necessari alla impostazione corretta
dell'oggetto `data`, avvengono in sequenza le seguenti operazioni:

-   viene scritto in memoria l'oggetto `data`;

-   viene letto dalla memoria il valore `pdSurface`;

-   vengono calcolati i coefficienti di frizione statica e dinamica
    correnti.

Si è scelto di non fare un'apertura e una chiusura della memoria per
ogni ciclo di queste operazioni, in primo luogo per evitare conflitti
con le operazioni di lettura e scrittura svolte dalla patch in Pure
Data; in secondo luogo ciò comporterebbe un overhead considerevole nel
carico computazionale; basti pensare che, su un PC dotato di processore
Intel  Core  Duo T2400 con 2GB di RAM, un milione di cicli
lettura/scrittura con apertura/chiusura della memoria richiede tra i 12
e i 13 secondi, mentre eliminando l'apertura/chiusura della memoria si
scende a tempi dell'ordine di pochi millisecondi.

### La scrittura e la lettura della memoria da parte delle patch in Pure Data

Per consentire alle patch in Pure Data di leggere e scrivere dati in RAM
è stato necessario scrivere un external; per semplicità ci si è
appoggiati alla libreria *flext* discussa nel [post sui modelli audio]({{ site.baseurl }}{% link _posts/2019-01-29-pure-data-modelli-audio.md %}). 
Tale oggetto è stato chiamato `ReadOperativo`; non necessita di argomenti di
costruzione e possiede 2 inlet e 5 outlet: i due inlet ricevono
rispettivamente un bang e il valore della superficie, mentre vengono
mandati in output, in ordine:

-   la radice quadrata del prodotto tra la velocità e la forza normale;

-   la velocità corrente del proxy;

-   il coefficiente di elasticità;

-   il fattore di amplificazione del rumore frattale;

-   il nome del file contenente il rumore frattale.

{% include image-cap.html url="images/readoperativo.jpg" description="" %}


Tutto ciò viene inizializzato tramite il costruttore:

```
ReadOperativo::ReadOperativo()
{
    // aggiunta degli inlet
    AddInAnything("bang");//(0)
    AddInFloat("surface");//(1)

    // aggiunta degli outlet
    AddOutFloat("nForce");//(0)
    AddOutFloat("Velocita'");//(1)
    AddOutFloat("Kappa");//(2)
    AddOutFloat("Depth");//(3)
    AddOutSymbol("NoiseFile");//(4)

    // inizializzazione delle variabili
    lastResult = 0;
    lastDepth = 0;
    fileName = "";
    open = false;

    // registrazione dei metodi
    FLEXT_ADDBANG(0,ope_bang);
    FLEXT_ADDMETHOD(1,writeSurface);
}
```

Un oggetto `metro` invia un bang all'oggetto `ReadOperativo` ogni 0.5
millisecondi. Al primo bang ricevuto avviene l'apertura dell'area di
memoria condivisa. Un ciclo di lettura e scrittura avviene ogni volta
che viene ricevuto un bang, quindi la frequenza con la quale avvengono
queste operazioni è di 2 KHz. Ai primi due outlet i valori vengono
inviati aggiornati ad ogni ciclo, mentre i restanti vengono inviati solo
quando vengono modificati; ciò è in accordo con il fatto che i primi due
valori sono misure istantanee, mentre gli altri sono parametri che
riguardano uno scenario e restano invariati all'interno dello stesso
scenario.

Il valore della superficie non viene scritto direttamente in memoria, ma
viene prima filtrato attraverso un filtro passa--basso a 2 KHz, in modo da evitare il verificarsi di
aliasing.

{% include image-cap.html url="images/lop_surface.jpg" description="" %}


Infine il distruttore si occupa della chiusura della memoria condivisa,
che pertanto viene effettivamente chiusa solo alla chiusura della patch
`sliding.pd` (e solo se era stata aperta):

```
ReadOperativo::~ReadOperativo()
{
  if(open)
  ClosePhantomMemory();   
}
```

### Analisi delle prestazioni

Grazie alle scelte implementative fatte, si è giunti ad un'applicativo
che consente una simulazione bimodale realistica. Le latenze sono
ridotte entro i limiti mediamente accettabili dall'uomo, quindi l'utente
percepisce gli stimoli visivo, aptico e sonoro come stimoli coerenti. Le
prove sono state effettuate con un PC notebook dotato di processore
Intel  Core  Duo T2400 e 2 GByte di memoria RAM; tuttavia la scheda
audio è di fascia medio--bassa, e nonostante ciò le prestazioni restano
soddisfacenti. Utilizzando un hardware audio di fascia alta sicuramente
i valori di latenza degli stimoli sonori verrebbero ridotti al minimo,
permettendo l'uso della simulazione anche su PC meno potenti.

Riferimenti
-----------

{% bibliography --cited %}
