---
layout: post
title: Dispositivi Aptici
tags: [haptic feedback, pure data]
permalink: dispositivi-aptici
---

{% include tesi-disclaimer.html %}

Cosa sono i dispositivi aptici
------------------------------

Negli anni settanta e ottanta la ricerca nel campo della robotica ha
iniziato a dirigere la sua attenzione verso la percezione e la
manipolazione tattile per la creazione di robot autonomi; negli anni
novanta invece la presenza di nuove tecnologie ha permesso la nascita
della *computer haptics*, cioè una virtualizzazione che, come nella
computer graphics, permette di simulare oggetti in maniera interattiva.
Sebbene Knoll abbia dimostrato già negli anni sessanta la possibilità di
eseguire una interazione aptica con semplici oggetti, solo le tecnologie
recenti hanno reso possibile la realizzazione di tale interazione con
oggetti sempre più complessi, combinando insieme dispositivi ad alte
prestazioni, modelli di calcolo geometrici, tecniche di rilevamento
delle collisioni e comprensione del sistema tattile umano.

I dispositivi aptici si comportano come piccoli robot che effettuano uno
scambio di energia con l'utente; in particolare permettono all'utente di
interagire con un ambiente virtuale ricevendo un feedback tattile,
ottenuto applicando delle forze opposte al movimento dell'utente lungo i
tre assi $$x$$, $$y$$ e $$z$$. La caratteristica principale che li distingue
dalle altre tipologie di dispositivi è la loro *bidirezionalità*, cioè
la possibilità di ricevere informazioni dall'utente e di inviare
informazioni all'utente. Infatti, durante il normale utilizzo di un tale
dispositivo, l'uomo imprime una forza al meccanismo aptico (uno stilo,
un ditale o un altro componente diverso a seconda del tipo di
interfaccia) e ne cambia la posizione; successivamente è il dispositivo
a riflettere una forza calcolata in base al movimento al quale è stato
sottoposto.

I *Bilateral Master--Slave Manipulator* (MSMs) fanno parte dei primi
dispositivi aptici sviluppati e venivano impiegati nell'industria
nucleare per manipolare in modo sicuro e remoto il materiale irradiato.
Il termine MSMs deriva dal fatto che il braccio meccanico *master* è
tipicamente una riproduzione di un braccio remoto *slave*, e i due sono
legati da catene, cavi o altri sistemi elettromeccanici. Un altro dei
primi usi dei bracci meccanici master è avvenuto nell'ambito della
realtà virtuale per la manipolazione delle molecole e l'interazione
aptica con la simulazione della forza elettrostatica
molecola--substrato; un esempio di questo è mostrato in figura  {% cite art:stone %}:

{% include image-cap.html url="images/molecole.jpg" description="Uso di un braccio meccanico per la manipolazione di molecole in un ambiente di realtà virtuale." %}

Altri progetti importanti sono stati sviluppati nel campo
del force feedback per la chirurgia, come il progetto IERAPSI dello
European Union Framework, un ambiente per le prove e la pianificazione
degli interventi chirurgici, oppure nel campo militare per il training
sul rilevamento e disinnesco delle mine.

{% include image-cap.html url="images/chirurgia.jpg" description="Sistema di feedback aptico usato per la pianificazione di interventi chirurgici." %}

Il termine *aptico* (dal greco *haptesthai* che significa *toccare*)
indica la parte di fisiologia inerente il senso del tatto, mentre con
*feedback aptico* (haptic feedback) si indica sia la consapevolezza
degli stimoli ricevuti in conseguenza di un contatto con una superficie,
sia le informazioni cinetiche ricevute in base alla posizione e al
movimento del corpo. Lo scambio bidirezionale di informazioni con un
dispositivo aptico viene chiamato *percezione aptica* (haptic
perception).

In figura è riportato lo schema di un'interazione aptica:

{% include image-cap.html url="images/interazione_aptica.jpg" description="Interazione aptica tra utente e dispositivo." %}

nella parte sinistra si vede come avvengono le
elaborazioni all'interno del corpo umano: i recettori posti sulla pelle
ricevono le informazioni sulla forza e le trasmettono al cervello, il
quale comanda poi i muscoli del braccio e della mano. Il dispositivo
invece (parte destra) rileva il moto attraverso dei sensori che inviano
i dati sulla posizione al computer al quale il dispositivo stesso è
collegato; quest'ultimo elabora i dati ricevuti e invia i comandi di
torsione agli attuatori che generano la forza di resistenza nel
dispositivo.

Tipi di dispositivi
-------------------

I dispositivi aptici possono essere distinti in base al loro
posizionamento:

_Dispositivi ground based_

I dispositivi *ground based* sono quelli che vengono appoggiati ad
un tavolo di lavoro e includono i joystick che riflettono le forze e
le interfacce aptiche desktop, come il Phantom  Omni  o il Phantom 
Desktop di SensAble Tecnologies.

{% include image-cap.html url="images/PhantomDesktop.jpg" description="Dispositivo aptico Phantom Desktop di SensAble Technologies." %}

_Esoscheletri meccanici_

Gli *esoscheletri meccanici* sono dei dispositivi che vengono
indossati dall'utente su braccia o gambe.

{% include image-cap.html url="images/esoscheletro.jpg" description="Dispositivo aptico CyberForce composto da un esoscheletro poggiato direttamente al suolo, [www.immersion.com](www.immersion.com)" %}

_Guanti force feedback_

I *guanti force feedback* leggono le informazioni di contatto delle
singole dita e restituiscono le forze di resistenza, ma non possono
riprodurre sensazioni di oggetti pesanti o inerzie

{% include image-cap.html url="images/cybergrasp.jpg" description="" %}

Un altro tipo di distinzione è tra dispositivi a *impedenza* o
*ammettenza*: i primi leggono informazioni relative alla posizione e
inviano in output informazioni sulle forze, i secondi leggono le forze e
inviano i dati sulla posizione. Il terzo modo di classificare i
dispositivi è in base ai gradi di libertà che caratterizzano il loro
movimento:

_Dispositivi ad un grado di libertà_

Misurano e applicano le forze lungo una sola direzione. Esempi di
movimenti reali ad un grado di libertà includono l'apertura di una
porta, l'uso di un paio di forbici o la pressione del pistone di una
siringa. La simulazione aptica ad un grado di libertà più comune è
il *muro virtuale*, che corrisponde al rendering di una forza che si
manifesta al contatto con una superficie molto rigida.

_Dispositivi a due gradi di libertà_

Il mouse è un semplice esempio di dispositivo a due gradi di
libertà; possono essere utilizzati per interagire con oggetti
tridimensionali mappando opportunamente i punti di contatto a tre
gradi di libertà su un piano.

_Dispositivi a tre gradi di libertà_

In questo caso la mappatura dallo spazio tridimensionale del
dispositivo a quello virtuale è più immediata, in quanto ogni
componente della posizione nel sistema di riferimento solidale al
dispositivo deve essere trasformata nella corrispondente componente
nel sistema di riferimento virtuale. Nell'interazione con gli
oggetti virtuali il modulo della forza è calcolato in base a quanto
il dispositivo penetra l'oggetto, mentre per il calcolo della
direzione sono stati sviluppati vari metodi, tra i quali quello
maggiormente utilizzato è l'algoritmo del *proxy*.

_Dispositivi a più di tre gradi di libertà_

Per rendere più realistici gli scenari virtuali si è reso necessario
introdurre la possibilità di effettuare torsioni. Barbagli
{% cite art:barbagli1 %} ha scritto un algoritmo che supporta l'interazione
con un punto di contatto con frizione e momenti per simulare quattro
gradi di libertà; la simulazione di cinque gradi di libertà (come
nel caso del contatto tra un segmento e un oggetto) è stata
implementata da Basdogan {% cite art:basdogan1 %}, mentre studi sulle
interazioni a sei gradi di libertà sono stati eseguiti da McNeely
{% cite art:mcneely %} e Otaduy e Lin {% cite art:otaduy %}.

#### Caratteristiche e prestazioni dei dispositivi

Le prestazioni dei vari tipi di dispositivi dipendono dalle abilità e
limitazioni umane e dell'utente; le simulazioni di oggetti e ambienti
virtuali sono sempre basate su calcoli approssimati, e sono proprio le
limitazioni della sensibilità dell'utente a determinare se tali
approssimazioni sono sufficienti. Le caratteristiche che un'interfaccia
aptica dovrebbe possedere sono {% cite art:basdogan2 %}:

-   Livelli di inerzia e frizione bassi, assieme ad assenza di
    costrizioni cinematiche imposte dal dispositivo, in modo tale che il
    movimento libero sia avvertito effettivamente come tale (in altre
    parole, l'utente non deve avvertire forze di resistenza quando
    queste non vengono simulate dall'applicazione).

-   La risoluzione, sia in termini di posizione che di forza riflessa,
    deve corrispondere a quella del sistema tattile umano e dipende dal
    processo nel quale viene impiegato il dispositivo. In particolare
    l'utente:

    -   non deve poter attraversare gli oggetti applicando una forza
        eccessiva;

    -   non deve avvertire vibrazioni non volute (come quelle dovute a
        quantizzazioni);

    -   non deve avvertire come elastici gli oggetti che invece sono
        rigidi e viceversa.

-   Ergonomia e comfort: i dispositivi non devono arrecare disturbi
    all'utente che li indossa o li utilizza, in quanto tali disturbi
    potrebbero sovrastare tutte le altre sensazioni, in particolare
    quelle aptiche.

Struttura di una pipeline di rendering aptico {#sec:rendering_aptico}
---------------------------------------------

La struttura di una pipeline di rendering aptico è relativamente
semplice.

{% include image-cap.html url="images/renderingaptico.jpg" description="Processo associato al rendering delle forze. Le linee in grassetto rappresentano i flussi del processo, mentre quelle tratteggiate rappresentano lo scambio di informazioni." %}

Quando l'utente muove la sonda del
dispositivo, i nuovi valori di posizione e orientazione vengono
catturati dai codificatori; successivamente vengono rilevate le
eventuali collisioni con gli oggetti virtuali: se la sonda entra in
contatto con un oggetto, viene calcolata la forza di reazione in base
alla profondità della penetrazione della sonda nell'oggetto. La forza
calcolata viene poi mappata sulla superficie dell'oggetto in modo da
tenere in considerazione i dettagli di quest'ultimo; il vettore delle
forze così modificato viene inviato al dispositivo e, tramite questo,
all'utente.

Le diverse tecniche di rendering possono essere distinte a seconda del
tipo di interazione in *point based* e *ray based*:

{% include image-cap.html url="images/pointray.jpg" description="Interazioni aptiche point--based e ray--based." %}

-   Con l'interazione point--based solo l'estremità del dispositivo
    (*HIP*, haptic interface point) entra in contatto con gli oggetti.
    Dato che questi hanno una rigidità finita, il punto HIP li penetra e
    la profondità della penetrazione è calcolata come la minima distanza
    tra HIP e superficie dell'oggetto virtuale.

-   Nell'interazione ray--based la sonda è modellata come un raggio
    finito; l'algoritmo di collisione individua come punto di contatto
    l'intersezione tra il raggio e la superficie dell'oggetto, mentre
    come profondità della penetrazione si considera la distanza tra HIP
    e punto di collisione lungo la normale alla superficie.

In entrambi i casi la forza è calcolata usando la legge di Hooke $$F=kx$$,
dove $$x$$ è la stessa direzione lungo la quale viene calcolata la
profondità di penetrazione; se le interazioni sono prive di forze di
frizione, la forza di reazione è normale alla superficie nel punto di
contatto.

Zilles e Salisbury {% cite art:zilles %} hanno sviluppato un algoritmo più
sofisticato per il rendering delle forze basato sulla tecnica
point--based; hanno definito un nuovo punto, detto *god--object* o
*proxy*, rappresentante la locazione sulla superficie del punto di
contatto che viene calcolato ogni volta che il dispositivo viene mosso,
con il vincolo ulteriore che la distanza tra god--object e HIP deve
essere minimizzata, mentre il god--object resta sempre sulla superficie
dell'oggetto anche quando il punto HIP lo penetra.

Un approccio più semplice consiste nel calcolare un'approssimazione
della superficie come un piano tangente al punto di contatto; tale piano
viene aggiornato ad una frequenza inferiore a quella propria del
rendering delle forze, pertanto può portare a sentire delle
discontinuità se il dispositivo viene mosso su grandi distanze prima che
il piano venga aggiornato.

Un'altra tecnica consiste nel considerare gli oggetti virtuali come
volumi formati da *voxel* (elementi di volume rappresentanti un valore
su una griglia regolare nello spazio tridimensionale); ad ogni voxel
vengono associati otto byte di informazioni, includenti i valori di
densità del materiale, gradiente di densità, colore e altre proprietà
aptiche come viscosità ed elasticità. Quando il punto HIP si trova
all'interno dell'oggetto, il valore scalare di densità al punto di
contatto viene usato per calcolare la forza di reazione attraverso delle
trasformazioni lineari, mentre il valore di gradiente della densità
viene usato per determinare la direzione normale alla superficie.

Basdogan ha sviluppato una tecnica di rendering ray--based
{% cite art:basdogan1 %} nella quale le coordinate delle due estremità della
sonda vengono aggiornate ad ogni movimento, rilevando ogni collisione
tra il raggio e l'oggetto virtuale e calcolando la forza secondo la
legge di Hooke. Il rilevamento delle collisioni avviene in tre passi:
per prima cosa viene rilevata la collisione tra il raggio e lo spazio
rettangolare contenente l'oggetto virtuale, poi tra il raggio e lo
spazio che circonda un qualsiasi elemento triangolare; infine viene
rilevato il contatto tra il raggio e l'elemento triangolare usando
calcoli geometrici. La divisione in più passi porta ad un aumento di
prestazioni consentendo di lavorare a frame rate più elevati.

Rendering dei dettagli della superficie
---------------------------------------

{% include image-cap.html url="images/forcedetail.jpg" description="Tecniche di rendering aptico dei dettagli di una superficie; le frecce rappresentano i vettori delle forze riflesse. L'area in grigio rappresenta la geometria dell'oggetto mentre la linea nera indica la geometria della superficie come viene percepita dall'utente." %}

Esistono diverse tecniche per effettuare il rendering dei dettagli della
superficie, diverse a seconda del tipo di sensazione che deve essere
data: superficie smussata, superficie con tessitura o superficie con
frizione.

### Rendering di superfici smussate

Quando gli oggetti vengono rappresentati tramite insiemi di poligoni,
l'utente non percepisce la forma che si intendeva rappresentare, ma
avverte i lati e gli angoli dei vari poligoni. Per minimizzare tale
effetto Morgenbesser e Srinivasan {% cite art:srinivasan2 %} hanno elaborato una
tecnica chiamata *force shading*: con tale metodo il vettore della forza
viene interpolato lungo la superficie in modo che la sua direzione vari
con continuità, di conseguenza l'utente avverte una
superficie più smussata rispetto alla sua rappresentazione originale.
Diventa così possibile sviluppare modelli geometrici di diverso livello
di dettaglio ed effettuare poi il rendering con il modello di forza
dettagliato o con il modello force--shaded a seconda dei requisiti
dell'applicazione.

Il force shading potrebbe diventare poco efficiente quando gli angoli
tra i poligoni che rappresentano una superficie sono al di sotto di un
certo valore; in questo caso è sufficiente diminuire il numero di
poligoni utilizzati fino a quando gli angoli tra questi sono tutti
maggiori del valore critico.

### Rendering delle tessiture aptiche {#sec:rendering_tessiture}

Srinivasan e Basdogan {% cite art:basdogan2 %} hanno sviluppato due metodologie
per il rendering delle tessiture di superfici tridimensionali che
prendono spunto da quelle usate nella computer graphics:

- _Perturbazione delle forze_: La perturbazione delle forze consiste nel modificare la direzione e
    il modulo del vettore delle forze per generare effetti sulla
    superficie (come la ruvidità). Max e Becker {% cite art:max %} hanno
    sviluppato una formula che permette di generare delle ruvidità
    visuali, basandosi sulla normale alla superficie originale:
    $$M = N - \nabla h + (\nabla h \cdot N)N$$ dove $$M$$ è la normale
    modificata, $$N$$ è la normale originale e $$\nabla h$$ è il gradiente
    della profondità della tessitura. Lo stesso metodo può essere usato
    per generare la ruvidità aptica.

- _Displacement mapping_:  In questo caso, invece di modificare il vettore delle forze, viene
    modificata la geometria della superficie. Per generare micro--tessiture è
    necessario che la superficie sia composta da un numero elevato di
    poligoni, in modo tale da rendere possibile la sua modifica punto
    per punto; tutto ciò però incrementa considerevolmente il carico
    computazionale. Usare questa tecnica per il rendering aptico
    comporta ulteriori problemi: gli oggetti virtuali non possono essere
    infinitamente rigidi, perciò il dispositivo penetra all'interno
    della superficie; oppure il rilevamento delle collisioni o la
    localizzazione dei punti sulla superficie ogni volta che la sonda
    viene mossa crea ambiguità dovute all'esistenza di micro--dettagli,
    portando a delle discontinuità delle forze. Si capisce come il
    displacement mapping sia più indicato per il rendering di
    macro--tessiture.

Altre tecniche invece si basano sull'uso della frequenza e della
profondità delle tessiture:

- _Tessiture aptiche basate sulle immagini_: L'idea consiste nell'utilizzare le informazioni dell'immagine
    bidimensionale usata come texture dell'oggetto virtuale; assumendo
    che le intensità di grigio dell'immagine possano essere usate
    direttamente come indicatori della profondità della tessitura
    aptica, possiamo associare ogni coordinata della texture $$(u,v)$$
    alle coordinate di ogni vertice $$(x,y,z)$$. Viene poi calcolato il
    gradiente della profondità al punto di collisione e il vettore della
    forza è perturbato di conseguenza.

- _Tessiture aptiche procedurali_: L'obiettivo è generare le tessiture aptiche mediante funzioni
    matematiche, usandole poi per modificare il gradiente $$\nabla h$$ e
    la forza di reazione al punto di contatto, o per modificare la
    geometria dell'oggetto; un esempio è la simulazione di tessiture
    stocastiche {% cite art:fritz %}.

### Rendering delle superfici con frizione

L'aggiunta di forze di frizione rende la simulazione aptica più
realistica; ad esempio, senza frizione non saremmo in grado di premere
un pulsante virtuale in quanto il dispositivo scivolerebbe su di esso.

Molti ricercatori hanno proposto l'utilizzo di frizioni di Coulomb o
frizioni viscose; le prime hanno una componente di frizione statica e
una di frizione dinamica, mentre le altre sono dipendenti dalla
velocità. Entrambi i tipi esercitano una forza opposta e tangenziale al
punto di contatto. Se la misurazione della velocità di contatto è
affetta da rumore o i cambiamenti di posizione sono troppo veloci,
l'interazione aptica potrebbe diventare instabile.

Generazione di tessiture casuali con il metodo stocastico {#sec:tessiture_stocastiche}
---------------------------------------------------------

Definiamo *spazio di tessitura* un volume di tessitura rappresentato da
vettori tridimensionali; un campione in un punto qualsiasi è un vettore
tridimensionale senza vincoli su modulo o direzione. Questo spazio
continuo viene generato tramite vari processi che possono essere
deterministici, stocastici o misti.

Le caratteristiche di una tessitura possono essere descritte tramite il
suo spettro di potenza, e variando lo spettro si ottengono diverse
tessiture.

### Modelli stocastici

I modelli stocastici sono caratterizzati da misure statistiche di una
immagine di texture; spesso sono sufficienti le misure di basso ordine.
Il pattern della texture viene sintetizzato applicando ad un rumore
bianco un filtro basato sulla funzione di autocorrelazione.

Dato che l'obiettivo non è simulare tessiture reali, bensì tessiture che
siano percettibilmente diverse l'una dall'altra, è possibile generare le
texture proprio processando un rumore tramite un filtro. Il rumore deve
essere a banda limitata (rumore rosa), stazionario (invariante rispetto
alla traslazione), isotropico e non deve essere periodico; il rumore
bianco filtrato possiede queste proprietà. In particolare si considera
il *rumore bianco gaussiano*: una trasformazione di un vettore casuale
gaussiano resta gaussiano ed è completamente definito dalle sue
statistiche di primo e secondo ordine. Semplicemente modificando la
varianza (e di conseguenza lo spettro di potenza) è possibile ottenere
tessiture che vanno da lisce a ruvide {% cite art:siira %}.

Per tessiture complesse si può utilizzare una *pdf* (probability density
function) ottenuta da varie pdf gaussiane:
$$f(x) = \sum_{i=1}^{M} a_i N({\mu}_i,C_i),$$ dove
$$\sum_{i=1}^{M} a_i = 1$$ e $$N(\cdot)$$ è l'i-esima pdf gaussiana con
media $${\mu}_i$$ e matrice di covarianza $$C_i$$; i termini $$a_i$$ possono
essere variati arbitrariamente, o modellati in base a tessiture reali.
In figura è rappresentata una texture bidimensionale
composta da due pdf gaussiane.

{% include image-cap.html url="images/gaussianpdf.jpg" description="Texture bidimensionale composta da due pdf
gaussiane." %}

Tutte queste metodologie producono campioni indipendenti e identicamente
distribuiti, ottenendo così uno spettro di potenza costante; per
modificare tale spettro è sufficiente filtrarlo con tecniche che
affiancano trasformazioni statistiche al normale filtraggio. Un esempio
è costituito dal moto Browniano visto nel paragrafo
[\[sec:tessiture\_superficie\]](#sec:tessiture_superficie){reference-type="ref"
reference="sec:tessiture_superficie"}, un processo invariante rispetto
alla scala descritto da un parametro di auto--similarità $$h$$ e uno
spettro di potenza di tipo $$1/f$$ {% cite art:ebert %} {% cite art:haruyama %}.

### Procedure implicite e sintesi spettrale di Fourier

La creazione di uno spettro di potenza è possibile anche tramite
procedure implicite, usando ad esempio delle sinusoidi, che nel dominio
della frequenza diventano degli impulsi. Dalla teoria di Fourier si sa
che ogni segnale periodico può essere visto come somma di infinite
sinusoidi: così la creazione di una texture diventa un procedimento di
sintesi spettrale di Fourier. Le caratteristiche dello spettro vengono
modificate modulando l'ampiezza e la frequenza delle sinusoidi, mentre
altri effetti spaziali possono essere ottenuti con variazioni di fase.
Possono essere utilizzate anche altre funzioni, come dente di sega o
onde quadre, le quali aggiungono componenti in alta frequenza ad
intervalli armonici; segnali di questo tipo diventano delle vibrazioni
in un'interfaccia aptica, fatto che può rendere più realistica la
tessitura.

Se il periodo dei segnali è sufficientemente ampio, le funzioni
periodiche possono essere usate per creare tessiture che appaiono
casuali. Un altro modo per creare tessiture casuali con funzioni
periodiche è l'uso di un processo stocastico: il vettore delle forze
della tessitura $$F_t$$ alla posizione $$p$$ può essere espresso tramite la
seguente equazione: $$F_t(p) = Sg(p)+N,$$ dove $$g(p)$$ è una funzione
implicita e deterministica, $$S$$ è un rumore moltiplicativo e $$N$$
rappresenta un rumore sovrapposto. Il rumore moltiplicativo può essere
usato per scalare casualmente una funzione deterministica apportando
ulteriori variazioni alla tessitura.

### Filtraggio

{% include image-cap.html url="images/filtraggio.jpg" description="Schema a blocchi per modellare una texture tramite filtraggio; H(z) è la funzione di trasferimento complessiva." %}

Il filtraggio viene usato per modellare lo spettro di potenza allo scopo
di ottenere una tessitura con determinate caratteristiche. Una
classificazione qualitativa delle tessiture può così essere tradotta in
una descrizione spettrale. Ad esempio, le tessiture possono essere
ruvide, lisce, fini, granulate, regolari o irregolari; alcune di queste
caratteristiche denotano periodicità, mentre altre comportano delle
amplificazioni a determinate frequenze. Così, manipolando lo spettro di
potenza delle primitive in input è possibile cambiare questi descrittori
qualitativi. Diverse tecniche di filtraggio possono essere impiegate a
tale scopo:

-   I filtri lineari FIR sono filtri facili da progettare e implementare
    e offrono una certa flessibilità. Il modellamento di un rumore
    bianco può ad esempio essere fatto mediante un banco di filtri FIR
    passabanda (equalizzatore parametrico), nel quale i parametri
    impostabili sono la frequenza centrale, la larghezza di banda e il
    guadagno.

-   I filtri IIR consentono un miglior controllo spettrale, pur essendo
    più complessi da progettare. Quando in input ad un filtro IIR viene
    dato un rumore, il sistema è anche noto come modello ARMA
    (autoregressive moving average).

L'implementazione del filtraggio è computazionalmente piuttosto costosa.
Tale problema può essere ovviato utilizzando un pre--filtraggio, il
quale permette di risparmiare tempo durante la simulazione consumando
però più memoria.

Riferimenti
-----------

{% bibliography --cited %}
