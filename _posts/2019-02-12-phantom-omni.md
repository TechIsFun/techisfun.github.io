---
layout: post
title: Il Phantom  Omni
tags: [haptic feedback, pure data]
---

{% include tesi-disclaimer.html %}

Le interfacce Phantom
---------------------

Lo sviluppo del Personal Haptic Interface Mechanism (Phantom) ha avuto
inizio al MIT Artificial Intelligence Laboratory. L'interazione da parte
dell'utente avveniva inserendo un dito in un apposito ditale (sistema
che poi è stato sostituito dall'uso di uno stilo): il Phantom legge la
posizione e in base a questa esercita una forza corrispondente sul dito.

Lo sviluppo del Phantom è basato su tre importanti osservazioni:

-   *Le caratteristiche aptiche più importanti sono la forza e il moto.*
    Le informazioni su come un oggetto si muove in risposta ad una forza
    applicata e le forze che nascono dal tentativo di muoverlo possono
    essere sufficienti per capire la geometria (forma, posizione), le
    proprietà (frizione, elasticità) degli oggetti e gli eventi in un
    ambiente. Le interazioni aptiche, al contrario degli altri tipi di
    interazioni, permettono uno scambio di dati bidirezionale.

-   *Molte interazioni aptiche significative non coinvolgono movimenti
    di torsione.* Tale osservazione ha portato all'uso del ditale, e
    pertanto il dito dell'utente può essere modellato come un punto o
    una piccola sfera nell'ambiente virtuale (lo stesso avviene se si
    usa uno stilo). Tutto ciò semplifica notevolmente sia la
    programmazione che la progettazione.

-   *Uno spazio di lavoro piccolo e centrato sul polso è sufficiente.*
    Molte interazioni aptiche avvengono all'interno dello spazio che può
    essere coperto dal movimento delle dita, mentre l'avambraccio compie
    movimenti limitati. Dai risultati di alcuni esperimenti si è deciso
    di costruire il Phantom in modo tale che un utente possa muovere
    liberamente il polso senza uscire dallo spazio di lavoro (come
    avviene per i mouse pad e le tastiere).

Inoltre il design e la progettazione sono state pensate nel rispetto di
tre regole fondamentali per garantire una riflessione delle forze
corretta ed efficiente:

-   *Il movimento libero deve essere avvertito come tale* (il
    dispositivo non deve esercitare forze esterne sull'utente).

-   *Gli oggetti virtuali solidi devono essere avvertiti come oggetti
    rigidi*. Il Phantom (nel modello Omni) è in grado di riflettere una
    rigidità massima di circa 35 N/cm, sufficienti per simulare una
    resistenza da parte degli oggetti rigidi al tocco.

-   *I vincoli virtuali non possono essere violati*. Ad esempio non può
    accadere che, imprimendo una grande forza contro un muro virtuale,
    l'utente sia in grado di attraversarlo.

Il Phantom  Omni  è una delle interfacce aptiche più economiche
attualmente disponibili sul mercato. Si tratta di un dispositivo aptico
ground--based a sei gradi di libertà in input, in grado di leggere la
posizione sui tre assi principali $$x$$, $$y$$ e $$z$$ e di computare le forze
lungo gli stessi. E' compatibile con tutti i PC intel--based ed è dotato
di una connessione FireWire  IEEE-1394a che assicura un trasferimento
dei dati ad alta velocità.


{% include image-cap.html url="images/phantomomni.jpg" description="Il dispositivo aptico Phantom  Omni  di SensAble Tecnologies." %}


Il toolkit OpenHaptics 
-----------------------

La programmazione del Phantom  Omni  avviene tramite il toolkit
*OpenHaptics* di SensAble. Tale toolkit include:

- HDAPI (Haptic Device API): Costituiscono lo strato di livello più basso per la programmazione
    aptica; permettono il rendering diretto delle forze e offrono un
    controllo sulla configurazione in runtime.

- HLAPI (Haptic Library API): Si appoggiano alle HDAPI per fornire un controllo di più alto
    livello; risultano familiari a chi già conosce l'OpenGL e sono più
    facili da usare in quanto il programmatore non deve preoccuparsi di
    eventi critici come il rendering di equazioni fisiche o la sicurezza
    dei thread.

Le HDAPI possono essere usate per richiedere le proprietà del
dispositivo, come i gradi di libertà in input e output, la forza
nominale massima, le dimensioni dello spazio di lavoro. Devono essere
utilizzate per inizializzare e configurare l'HHD (haptic device handle)
e inoltre possono essere usate per modificare la frequenza del *servo
loop*; il servo loop è il ciclo di controllo usato per calcolare le
forze da inviare al dispositivo aptico. Per avere un feedback stabile,
il ciclo deve essere eseguito ad una frequenza pari a 1 KHz o superiore
(maggiore è la frequenza, maggiore è l'utilizzo di CPU), e pertanto
viene eseguito in un thread separato ad alta priorità (*servo thread*).

Le HLAPI permettono l'aggiunta di effetti personalizzati, ovvero
l'aggiunta di forze da inviare al dispositivo aptico. Dato che le forze
sono computate nel servo thread, possono essere usate in aggiunta alle
callback HLAPI per avere ulteriori informazioni sul dispositivo.

Creazione di un ambiente aptico
-------------------------------

Nei dispositivi aptici le forze sono usate per resistere o assistere il
movimento del dispositivo stesso. Le interazioni delle forze derivano
dal considerare la posizione del dispositivo in relazione agli oggetti
presenti nell'ambiente virtuale: se la forza è nulla il movimento del
dispositivo è libero. Quando l'utente muove il dispositivo, viene
effettuato il rendering delle forze alla frequenza di 1000 Hz, impedendo
all'*end effector* di penetrare la superficie degli oggetti; il modo in
cui vengono renderizzate varia a seconda dell'effetto che si deve
ottenere sulle superfici (dure, soffici, elastiche, ruvide) o
sull'ambiente (come viscosità e inerzia). Un altro effetto desiderato
potrebbe essere quello di costringere il movimento del dispositivo lungo
un determinato percorso.

Il vettore delle forze è l'unità di output per un dispositivo aptico; le
tre classi principali di forze sono:

-   Forze dipendenti dal moto.

-   Forze dipendenti dal tempo.

-   Forze dipendenti sia dalla posizione che dal tempo.

### Forze dipendenti dal moto

Una forza è dipendente dal moto quando viene calcolata in base al
movimento del dispositivo aptico; tali forze sono:

- Forza elastica: La forza elastica può essere calcolata usando la legge di Hooke
    $$F=kx ,$$ dove $$k$$ è la costante elastica e $$x$$ è il vettore della
    posizione. La molla che rappresenta la forza è attaccata, ad una
    estremità, ad un punto fisso $$p_0$$, solitamente collocato sulla
    superficie dell'oggetto che l'utente sta toccando, mentre l'altra
    estremità coincide con la posizione $$p_1$$ del dispositivo; il
    vettore $$x=p_0-p_1$$ è orientato in modo tale che la forza elastica
    sia sempre diretta verso il punto fisso.

- Frizione viscosa: L'utilità principale della frizione viscosa è ridurre la vibrazione
    opponendosi al moto; in generale tale forza è proporzionale alla
    velocità del dispositivo: $$F=-bv$$, dove $$b$$ è la costante di
    smorzamento e $$v$$ la velocità del dispositivo.

- Frizione statica: E' una forza che si oppone alla direzione del moto con modulo
    costante: $$F=-c\cdot sgn(v) ,$$ dove $$v$$ è la velocità del
    dispositivo e $$c$$ è la costante di frizione, dipendente dalla forza
    normale. Può essere utile per creare una transizione smorzata nei
    cambiamenti di direzione.

- Frizione dinamica: E' simile alla frizione viscosa, e pertanto viene calcolata mediante
    la formula $$F=-bv$$, dove $$b$$ dipende dalla forza normale.

- Inerzia: E' associata alla massa in movimento e si calcola, una volta nota la
    traiettoria, con la legge di Newton $$F=ma$$.

### Forze dipendenti dal tempo

Le forze funzioni del tempo possono essere suddivise in:

- Costanti: Si tratta di forze costanti sia in modulo che in direzione. Possono
    essere usate per far sentire il dispositivo più pesante oppure, al
    contrario, più leggero effettuando una compensazione della forza di
    gravità.

- Periodiche: Derivano dall'applicazione di un pattern (dente di sega, onda
    quadra, sinusoide) che si ripete nel tempo. Una forza periodica è
    descritta da una direzione, da una costante di tempo che controlla
    il periodo del pattern e un'ampiezza che determina quanto forte
    dovrà essere la forza al suo picco massimo.

- Impulsive: Sono costituite da un vettore delle forze che viene applicato
    istantaneamente; nella pratica, un impulso con un dispositivo aptico
    è applicato su un piccolo intervallo di tempo.

Contatti e vincoli
------------------

Simulare contatti con un oggetto virtuale significa computare le forze
che impediscono all'*end--effector* del dispositivo di penetrare la
superficie dell'oggetto virtuale. Ciò può essere simulato tramite il
concetto di *proxy* che segue la trasformazione dell'end--effector
nell'ambiente virtuale.

Il proxy è identificato con un punto, una sfera o un insieme di punti;
se si tratta di un punto lo definiamo *SCP* (*surface contact point* o
punto di contatto di superficie.

{% include image-cap.html url="images/scp.jpg" description="SCP - surface contact point." %}


Quando l'end--effector penetra la superficie, viene calcolata una
trasformazione del proxy che raggiunga la configurazione ad energia
minima tra la superficie di contatto e l'end--effector. Successivamente
vengono determinate le forze che impediscono al moto del dispositivo di
penetrare ulteriormente la superficie, usando un controllo di
elasticità--smorzamento; più precisamente, il punto SCP è un punto che
segue la posizione dell'end--effector pur essendo costretto a restare
sulla superficie dell'oggetto. Nello spazio libero l'SCP si trova nella
stessa posizione dell'end--effector ($$t_0$$ in figura); al
momento del contatto con un oggetto l'SCP può essere calcolato muovendo
l'ultimo SCP verso la posizione dell'end--effector senza oltrepassare la
superficie. La forza viene calcolata simulando una molla collegata da un
lato all'SCP e dall'altro alla posizione dell'end--effector: in figura $$t_1$$
indica la penetrazione nell'oggetto e $$t_2$$ mostra una penetrazione
ulteriore (la molla è maggiormente allungata facendo sentire una
maggiore resistenza all'utente).

Sincronizzazione
----------------

La sincronizzazione è importante quando l'interfaccia utente è composta
sia di una parte grafica che di una parte aptica, in quanto i due cicli
di rendering devono accedere alle stesse informazioni; ciò implica la
creazione di copie dei dati in memoria, resi così disponibili in modo
sicuro ad entrambi i thread. Non può essere usata la mutua esclusione in
primo luogo perché il ciclo di rendering aptico deve sempre girare ad
una frequenza di 1000 Hz e non può quindi attendere altri processi, in
secondo luogo perché la diversa frequenza dei due cicli facilita la
presenza di inconsistenze se sono in movimento più oggetti
contemporaneamente.

Anche nella gestione degli eventi il ciclo di rendering aptico deve
avere la maggiore priorità. Quando si verifica un evento (come il tocco
di una superficie o l'applicazione di un particolare vincolo), questo
viene prima gestito dal thread aptico, in modo da fornire una risposta
al dispositivo immediata, e poi accodato dal thread grafico che si
occuperà di aggiornare la visualizzazione sullo schermo al successivo
frame.

Convenzioni nell'interfaccia grafica e aptica
---------------------------------------------

- Pozzo di gravità: Il pozzo di gravità viene usato per attirare il dispositivo verso un
    determinato punto, solitamente indicato come *vincolo istantaneo*.
    Al pozzo è associato un raggio di influenza: quando il dispositivo
    si trova all'interno di tale raggio, viene applicata una forza che
    lo attira verso il centro del pozzo (solitamente viene usata una
    forza elastica).

- Trasformazioni relative: I dispositivi aptici hanno una posizione assoluta, dal momento che
    si trovano ancorati al tavolo di lavoro. L'unico modo per ottenere
    una manipolazione relativa è applicare delle trasformazioni
    addizionali alle coordinate del dispositivo, così da dare
    l'impressione che quest'ultimo si stia muovendo relativamente ad una
    data posizione e orientazione.

- Accoppiamento delle informazione aptiche e visive: Il senso aptico del contatto può essere migliorato fornendo una
    rappresentazione visuale del contatto stesso; ciò si ottiene
    semplicemente dando una corretta visuale. Ad esempio, la sensazione
    di contatto sarà più verosimile se il cursore non penetra mai la
    superficie (rappresentando quindi il proxy e non la posizione del
    dispositivo).

- Stabilizzazione della manipolazione con la frizione: Applicare una piccola frizione aiuta l'utente a stabilizzare la mano
    mentre cerca di arrivare alla posizione desiderata; senza frizione,
    il dispositivo è troppo "libero", rendendo difficile effettuare
    posizionamenti precisi.

Programmare con le HDAPI
------------------------

Le Haptic Device API consistono di due componenti: le API relative al
dispositivo e quelle relative allo scheduler. Le prime si occupano
dell'astrazione di ogni meccanismo tridimensionale supportato. Le API
dello scheduler invece permettono di introdurre dei comandi che verranno
eseguiti all'interno del servo loop thread. Il tipico uso delle HDAPI
prevede l'inizializzazione del dispositivo e dello scheduler, l'avvio di
quest'ultimo, l'esecuzione di alcuni comandi tramite lo scheduler stesso
e l'uscita. Ad esempio, consideriamo la creazione di un piano che
respinga il dispositivo quando questo cerca di penetrarlo; la creazione
di tale ambiente si divide in 5 passi:

1.  Inizializzazione del dispositivo.

2.  Creazione delle callback dello scheduler che chiedono la posizione
    del dispositivo e comandano la forza che deve respingere il
    dispositivo al momento della penetrazione.

3.  Abilitazione delle forze del dispositivo.

4.  Avvio dello scheduler.

5.  Reset del dispositivo e dello scheduler quando l'applicazione viene
    terminata.

Le routine relative al dispositivo possono essere raggruppate come
segue:

-   Inizializzazione del dispositivo (creazione dell'handle del
    dispositivo, abilitazione delle forze, calibrazione).

-   Sicurezza del dispositivo (controllo della sicurezza del force
    feedback, come temperatura dei motori, forze e velocità eccessive).

-   Stato del dispositivo (richiesta di posizione, velocità, pulsanti e
    matrici di trasformazione).


{% include image-cap.html url="images/hdapi.jpg" description="Schema di programmazione con le HDAPI." %}


### Operazioni del dispositivo

Le operazioni di dispositivo sono tutte quelle inerenti la richiesta e
l'impostazione dello stato corrente; sono tutte operazioni che
dovrebbero essere eseguite esclusivamente all'interno del servo loop
utilizzando le callback dello scheduler.

- Inizializzazione: Sia il dispositivo che lo scheduler devono essere inizializzati
    prima dell'uso; al momento dell'inizializzazione le forze sono
    disattivate, verranno invece attivate nel momento in cui verrà fatto
    partire lo scheduler. Se vengono utilizzati più dispositivi, ognuno
    deve essere inizializzato separatamente, mentre viene avviato un
    solo scheduler.

- Dispositivo corrente: Nel caso in cui vengano utilizzati più dispositivi, uno deve essere impostato come il dispositivo corrente; per fare ciò viene usato il comando `mdMakeCurrentDevice(hHD)`. Nell'utilizzo di un singolo dispositivo tale comando non deve mai essere utilizzato.

- Caratteristiche del dispositivo: Alcune caratteristiche del dispositivo possono essere abilitate o
    disabilitate a seconda delle necessità, usando i comandi `hdEnable`
    e `hdDisable`. Tali istruzioni devono essere utilizzate con
    attenzione e sempre tramite callback dello scheduler.

### Frame aptici

I frame aptici definiscono i limiti all'interno dei quali lo stato del
dispositivo è consistente. All'avvio del frame, lo stato del dispositivo
viene aggiornato e memorizzato per l'uso in quel frame; successivamente
tutte le operazioni dovrebbero essere eseguite all'interno dello stesso
frame, dato che cercando di ottenere lo stato del dispositivo al di
fuori del frame si può ottenere invece lo stato del frame precedente. Ad
ogni istante lo scheduler dovrebbe avere un solo frame attivo per ogni
dispositivo; tuttavia i frame per dispositivi diversi possono essere
annidati.

### Operazioni dello scheduler

Come già detto, lo scheduler si occupa della gestione del servo loop
thread e opera ad una frequenza di circa 1000 Hz; diventa perciò
pericoloso accedere manualmente alle variabili: per fare ciò conviene
sempre utilizzare le callback. Le chiamate allo scheduler sono di due
tipi:

- Chiamate sincrone: Ritornano solamente quando sono complete, e il thread deve attendere
    il completamento prima di continuare. Sono usate principalmente per
    richiedere lo stato del sistema.

- Chiamate asincrone: Ritornano non appena sono state schedulate. Sono usate per
    rappresentare un effetto aptico e perciò risiedono nello scheduler,
    applicando l'effetto ad ogni iterazione. Al momento della
    schedulazione di una callback asincrona viene restituito un handle
    che può essere riutilizzato successivamente per eseguire operazioni
    sulla callback, come l'eliminazione della stessa dallo scheduler o
    il suo blocco fino al completamento.

Tutte le callback hanno associata una priorità, in base alla quale viene
determinato l'ordine di esecuzione all'interno dello scheduler; per ogni
ciclo di scheduler viene eseguita sempre ogni callback. In ogni momento
viene eseguito un solo thread di schedulazione e, se sono presenti più
dispositivi, questi condividono lo stesso thread.

### Stato del sistema

#### Ottenimento dello stato

Lo stato del dispositivo (assieme ad altre informazioni) può essere
richiesto tramite l'uso delle funzioni della famiglia `hdGet`, come ad
esempio `hdGetDoublev`. Tali funzioni richiedono un parametro valido ed
un singolo indirizzo di ritorno o un array. Le richieste possono essere
fatte al frame corrente o al precedente; in generale, se vengono
eseguite all'esterno di un frame, vengono riferite a quello precedente.
Per i parametri di forze in output il valore viene impostato a zero
automaticamente all'inizio di ogni frame.

#### Impostazione dello stato

L'impostazione dello stato deve essere sempre eseguita all'interno di
uno stesso frame, ed è necessario passare il numero corretto di
parametri; questo per evitare l'introduzione di errori dato che si va a
modificare le caratteristiche o il comportamento del dispositivo. Le
forze non vengono inviate al dispositivo fino alla fine del frame,
quindi se viene impostato due volte lo stesso stato, la seconda
impostazione sostituisce la prima (se ad esempio si vogliono sommare più
forze, sarà necessario farlo in una variabile separata).

#### Sincronizzazione dello stato

Lo scheduler fornisce una sincronizzazione dello stato tra thread
diversi. Un esempio è costituito dal caso in cui uno stato deve essere
aggiornato alla frequenza del servo loop, e contemporaneamente un altro
thread (come il thread grafico) accede e modifica lo stato. E' possibile
ottenere lo stato attuale da un singolo frame all'interno del ciclo
aptico usando le callback sincrone.

Programmare con le HLAPI
------------------------

Le HLAPI sono delle API in C di alto livello per il rendering aptico e
si accompagnano alle API OpenGL per il rendering grafico. Le HLAPI
permettono al programmatore di specificare primitive geometriche come
triangoli, linee e punti assieme a proprietà aptiche come frizione e
rigidità; tramite tali informazioni il motore di rendering aptico
calcola poi le forze appropriate. Inoltre queste API permettono sia di
impostare che di richiedere lo stato degli oggetti, richiedere lo stato
del Phantom (posizione e orientamento) e impostare le funzioni di
callback.

### Generazione delle forze

Esistono tre modi per generare un feedback aptico usando le HLAPI:

- Rendering delle forme: Permette di specificare primitive geometriche (tramite istruzioni
    OpenGL) che il motore di rendering usa per computare le giuste forze
    di reazione per simulare il tocco della superficie.
    L'identificazione delle geometrie create in OpenGL può avvenire in
    due modi: tramite il *depth buffer* oppure tramite il *feedback
    buffer*.

- Rendering degli effetti: Permettono di specificare forze globali non definibili tramite
    primitive geometriche (cioè non legate al tocco di una figura
    geometrica).

- Rendering diretto del proxy: Permettono di impostare un orientamento per il dispositivo aptico il
    quale verrà portato nella giusta posizione dal motore di rendering.

### Threading

Dato che il rendering aptico necessita di un aggiornamento molto più
frequente rispetto all'applicazione grafica, il motore HLAPI crea due
thread in aggiunta a quello dell'applicazione principale: il *servo
thread* e il *collision thread*.

- Servo thread: Gestisce la comunicazione diretta con il dispositivo aptico,
    leggendo la posizione e l'orientamento del dispositivo e aggiornando
    le forze ad una frequenza molo alta (generalmente 1000 Hz). La
    differenza rispetto alle HDAPI è che le HLAPI nascondono il servo
    thread all'utente.

- Collision thread: Determina quali primitive geometriche sono in contatto con il proxy
    ad una frequenza di 100 Hz (minore rispetto al servo thread ma
    maggiore del client thread). Una volta determinato quale oggetto è
    in contatto con il proxy, viene elaborata un'approssimazione della
    forma locale dell'oggetto, la quale viene inviata al servo thread
    che la utilizza nel calcolo delle forze.

### Struttura della programmazione con le HLAPI

{% include image-cap.html url="images/hlapi.jpg" description="Schema di programmazione con le HLAPI." %}


In figura si può
vedere la struttura tipica di un programma che implementa le HLAPI. Il
primo passo è l'inizializzazione dell'ambiente OpenGL con la creazione
di un contesto grafico e la rispettiva finestra; segue
l'inizializzazione delle HLAPI con la creazione del contesto aptico.
Successivamente viene specificato come le coordinate fisiche (quelle del
Phantom) devono essere mappate nello spazio delle coordinate usato
dall'ambiente grafico. A questo punto è possibile effettuare il
rendering grafico e inizia la cattura degli eventi aptici, procedendo
così con il rendering aptico; in aggiunta viene rappresentato un cursore
tridimensionale in corrispondenza della posizione del proxy. Il ciclo
prosegue tornando alla cattura degli eventi.

### Setup del dispositivo

Come con le HDAPI, l'inizializzazione del dispositivo avviene tramite il
comando `hdInitDevice`, seguito dal comando `hlCreateContext`, il quale
crea il contesto aptico. Infine il contesto viene impostato come
corrente con l'istruzione `hlMakeCurrent` (ciò è richiesto da tutti i
comandi delle HLAPI). Il rendering del contesto deve essere attivo per
un solo thread alla volta, in quanto le routine HLAPI, come quelle
OpenGL, non sono *thread safe*; ciò può essere implementato con l'uso di
un *mutex* per sincronizzare le chiamate a `hlMakeCurrent` per i
contesti condivisi.

### Frame aptici

{% include image-cap.html url="images/hlapiframe.jpg" description="Collocazione dei frame con le HLAPI." %}

Tutti i comandi implementati dalle HLAPI devono essere inseriti
all'interno di un *frame aptico*, delimitato dalle chiamate a
`hlBeginFrame` (posta all'inizio del ciclo di rendering) e `hlEndFrame`
(alla fine del ciclo di rendering), come evidenziato in
[1.4](#fig:hlapiframe){reference-type="ref" reference="fig:hlapiframe"}.
In generale sarà presente un frame aptico per ogni frame grafico. Ciò è
molto diverso rispetto alla programmazione con le HDAPI, perché in
questo caso il frame grafico viene aggiornato alla stessa frequenza di
quello aptico: le chiamate avvengono nel thread dato che entrambi
accedono alle medesime informazioni geometriche. `hlBeginFrame` campiona
lo stato corrente del rendering aptico dal thread aptico;
successivamente `hlEndFrame` aggiorna la posizione del proxy in base ai
cambiamenti nella dinamica degli oggetti. In aggiunta `hlBeginFrame` si
occupa di aggiornare le coordinate globali usate dal motore di rendering
aptico. Tutte le richieste dello stato del dispositivo o del proxy
effettuate all'interno di uno stesso frame riportano lo stesso
risultato, ovvero lo stato presente al momento in cui è stato richiamato
`hlBeginFrame`. Alla fine del frame, tutti i cambiamenti allo stato che
sono intervenuti vengono trasmessi al rendering aptico. Ciò fa si che
più cambiamenti allo scenario all'interno di uno stesso frame vengano
trasmessi ai cicli aptico e grafico simultaneamente alla fine del frame.

### Rendering delle forme {#sec:rendering_forme}

Il rendering delle forme con le HLAPI è usato per rappresentare
superfici e oggetti solidi. Una forma può essere creata combinando
insieme più primitive grafiche come linee e poligoni.

#### Inizio e fine di una forma

Le forme geometriche vengono specificate attraverso istruzioni OpenGL
racchiuse tra le chiamate a `hlBeginShape` e `hlEndShape`. Le HLAPI
catturano tali geometrie per calcolare il rendering aptico.

#### Identificatori delle forme

Ogni forma deve essere identificata univocamente da un intero che sarà
usato dal motore di rendering per i cambiamenti della forma da frame a
frame in modo da calcolare correttamente le forze. Tale identificatore
può essere rilasciato quando la forma non è più usata.

#### Depth buffer

La geometria degli oggetti può essere catturata dal *depth buffer* usato
dalle OpenGL: quando viene richiamata l'istruzione `hlEndShape` le API
leggono un'immagine da tale buffer, immagine che viene poi passata al
collision thread e usata per calcolare le collisioni con il proxy. Ogni
modifica al depth buffer verrà riconosciuta come modifica di un oggetto
e quindi ne verrà fatto il rendering aptico. Dato che gli oggetti
vengono convertiti in un immagine, è fondamentale utilizzare il punto di
vista corretto durante il rendering, in quanto non è possibile sentire
quelle parti della scena che non sono visibili da tale punto. Esiste la
possibilità di abilitare l'ottimizzazione del punto di vista, con la
quale le HLAPI correggono automaticamente i parametri di visualizzazione
OpenGL in base alla mappatura del dispositivo aptico sulla scena; il
comando corrispondente è

```
hlEnable(HL_HAPTIC_CAMERA_VIEW)
```

Grazie al *depth buffer* è possibile effettuare il rendering aptico e
grafico delle forme in un unico ciclo, semplicemente includendo il
codice di rendering grafico all'interno di un blocco `hlBeginShape` -
`hlEndShape`. Se è attiva l'ottimizzazione *haptic camera view*, tale
metodo non funzionerà in quanto il rendering grafico verrà effettuato
dal punto di vista modificato.

#### Feedback buffer

Il rendering tramite *feedback buffer* usa il feedback buffer delle
OpenGL per catturare le primitive geometriche: quando l'istruzione
`hlBeginShape` viene richiamata, le HLAPI automaticamente allocano tale
buffer e impostano la modalità di rendering OpenGL a feedback buffer;
tutte le primitive vengono così salvate, ma solo i comandi che generano
punti, linee o vertici vengono catturati dalla routine aptica (gli altri
comandi, come quelli relativi all'impostazione delle texture, vengono
ignorati). Con il comando `hlEndShape` le primitive salvate nel feedback
buffer vengono usate per il rendering aptico. E' opportuno utilizzare
l'istruzione `hlHinti` per impostare il numero di vertici che saranno
presenti nella scena, numero che verrà usato dalle HLAPI per allocare la
memoria per il feedback buffer; ad esempio il comando seguente alloca
memoria per 4 vertici:

```
hlHinti(HL_SHAPE_FEEDBACK_BUFFER_VERTICES, 4);
```
il valore di default è 65536.

Durante la creazione di un oggetto con il feedback buffer è importante
non richiamare l'istruzione `glCullFace` (o la relativa
abilitazione/disabilitazione) all'interno della coppia di istruzioni
`hlBeginShape` - `hlEndShape`, altrimenti può accadere di non essere in
grado di percepire alcune parti dell'oggetto.

#### Ottimizzazione del rendering

Come nella grafica è possibile ottimizzare il rendering effettuandolo
solo sulle forme che vengono visualizzate al momento, è possibile
ottimizzare il rendering aptico effettuandolo solo sulle forme che
possono essere toccate (ad esempio considerando solo le parti degli
oggetti vicini alla posizione corrente del proxy). Di seguito è
riportato un elenco delle possibili ottimizzazioni che possono essere
effettuate.

- Adaptive Viewport: Tale ottimizzazione consiste nel limitare la regione del depth
    buffer che viene letta nella memoria per il rendering aptico
    all'area prossima alla posizione corrente del proxy. L'incremento di
    prestazioni dipende dalla velocità con la quale la scheda grafica
    riesce a leggere il depth buffer dalla memoria. Il comando per
    abilitare tale opzione è `hlEnable(HL_ADAPTIVE_VIEWPORT)`.
    Per utilizzare l'adaptive viewport la scena deve essere ridisegnata
    regolarmente quando il dispositivo aptico è in movimento, ad una
    frequenza tanto più alta quanto più veloce è il movimento del
    dispositivo.

- Haptic Camera View: Con tale opzione attivata, le HLAPI modificano automaticamente i
    parametri di visualizzazione usati per il rendering del depth buffer
    o del feedback buffer, in modo tale che solo le forme vicino alla
    posizione attuale del proxy vengono visualizzate. Nel caso venga
    utilizzato il feedback buffer, tale tecnica può portare ad un
    incremento delle prestazioni in quanto viene ridotto il numero delle
    primitive geometriche prese in considerazione dal rendering aptico
    (l'incremento effettivo dipende dalla densità degli oggetti presenti
    sulla scena). Nel caso invece di utilizzo del depth buffer
    l'incremento sarà di minore entità, in quanto il rendering aptico
    del depth buffer è indipendente dal numero di primitive; inoltre
    l'immagine generata dal depth buffer è solo un sottoinsieme
    dell'intero buffer ed è possibile sentire parti degli oggetti che
    non sono visibili dal punto di vista grafico. Come per l'adaptive
    viewport, l'abilitazione dell'opzione *haptic camera view* richiede
    che la scena venga ridisegnata ad una frequenza proporzionale alla
    velocità di movimento del dispositivo.
    L'utilizzo di questa opzione disabilita l'adaptive viewport.

- Culling con partizioni spaziali: Quando nella scena sono presenti degli oggetti costituiti da un
    numero molto grande di primitive il culling può diventare molto
    costoso in termini di risorse di calcolo; usando strutture
    particolari (come alberi binari) è possibile effettuare il culling
    di molte primitive in un'unica operazione.
    Per prima cosa è necessario determinare la regione dello spazio che
    viene presa in considerazione per il rendering aptico; tale regione
    è semplicemente quella che viene impostata dalle HLAPI nella
    chiamata a `hlBeginShape` quando è abilitata la *haptic camera
    view*. Una volta individuata la regione, si utilizzano delle
    partizioni dello spazio per trovare il sottoinsieme di primitive che
    si trovano all'interno (completamente o parzialmente) di essa; tali
    geometrie vengono visualizzate tramite OpenGL.

In conclusione, se si lavora con un numero elevato di primitive è
conveniente utilizzare il depth buffer mentre, al contrario, è
conveniente utilizzare il feedback buffer se il numero di primitive è
ridotto.

Il depth buffer è meno accurato del feedback buffer, anche se tale
differenza non è percettibile: con il depth buffer infatti le forme
vengono trasformate in un'immagine bidimensionale prima di calcolarne il
rendering aptico, e tale trasformazione comporta una perdita di
informazioni. L'opzione *haptic camera view* permette di individuare una
vista che minimizzi la perdita di dettagli dell'immagine, anche se non
sempre è possibile catturare tutte le informazioni. Se vengono usate
linee o punti come vincoli, deve essere usato il feedback buffer in
quanto tali primitive non possono essere catturate dal depth buffer.

### Mappatura del dispositivo aptico sulla scena

Di seguito viene descritto come i movimenti del dispositivo aptico
vengono tradotti in movimenti nella rappresentazione grafica.

#### Lo spazio di lavoro aptico

Lo spazio di lavoro aptico è lo spazio che può essere raggiunto dal
dispositivo aptico, e le dimensioni (in millimetri) di tale spazio
possono essere ottenute con il comando

```
HLdouble workspaceDims[6];
hlGetDoublev(HL_WORKSPACE, workspaceDims);
```

Si può scegliere di non utilizzare l'intero spazio di lavoro scegliendo
la porzione utilizzabile con la chiamata a `hlWorkspace`.

#### Stack di matrici

Sono previsti due stack di matrici 4x4 tramite le quali viene effettuata
la mappatura: `HL_VIEWTOUCH_MATRIX` e `HL_TOUCHWORKSPACE_MATRIX`. Mentre
il primo ha la funzione di definire una mappatura tra lo spazio di
lavoro e le coordinate visive, il secondo serve ad orientare lo spazio
di lavoro secondo le coordinate visive.

{% include image-cap.html url="images/matrixstack1.jpg" description="Mappatura dallo spazio di lavoro aptico alla scena grafica." %}

Le coordinate globali vengono prima trasformate nelle coordinate locali
(le coordinate della vista corrente); successivamente si ottengono le
coordinate di tocco, le quali rappresentano la base della mappatura
dello spazio di lavoro sulle coordinate della vista corrente. Infine
l'ultima trasformazione porta ad ottenere le coordinate dello spazio di
lavoro (coordinate locali del dispositivo aptico).

Il funzionamento dei due stack è analogo a quello delle OpenGL: le HLAPI
mantengono uno stack corrente e tutte le operazioni hanno effetto su
questo.

### Proprietà dei materiali ed effetti aptici

Controllando le proprietà dei materiali si controllano le proprietà
tattili della superficie, analogamente a come vengono controllate le
proprietà visive. Il comando per specificare tali proprietà è
`hlMaterial`, e può essere applicato al fronte o retro della superficie
o ad entrambe le facce.

- Rigidità: La rigidità di una superficie viene impostata tramite il comando `hlMaterialf(HL_FRONT_AND_BACK, HL_STIFFNESS, 0.7)` dove la `f` aggiunta indica che il parametro numerico è un *float*.
    Matematicamente rappresenta il tasso con il quale la forza aumenta
    mano a mano che il dispositivo tenta di penetrare la superficie
    secondo la legge di Hooke $$F=kx$$, dove $$k$$ è la costante di rigidità
    e $$x$$ è il vettore rappresentante la penetrazione.

- Smorzamento: Impostando tale proprietà tramite il comando `hlMaterialf(HL_FRONT_AND_BACK, HL_DAMPING, 0.1)`
    viene aggiunta una forza di resistenza dipendente dalla velocità
    secondo la legge $$F=kv$$, con $$k$$ costante di smorzamento e $$v$$
    velocità del dispositivo.

- Frizione: La frizione indica la resistenza di un oggetto al movimento laterale
    su di esso. Si distingue tra frizione *statica* e *dinamica*: la
    prima rappresenta la resistenza che si avverte quando il dispositivo
    inizia il suo moto sull'oggetto, mentre la seconda indica la
    resistenza che si avverte quando il dispositivo è in movimento
    sull'oggetto. Si può pensare al ghiaccio come esempio di materiale
    dotato di un'alta frizione statica ma bassa frizione dinamica; la
    gomma invece ha coefficienti elevati per entrambi i tipi di
    frizione. Il comando per settare le due proprietà è:
```
hlMaterialf(HL_FRONT_AND_BACK, HL_STATIC_FRICTION, 0.3)
hlMaterialf(HL_FRONT_AND_BACK, HL_DYNAMIC_FRICTION, 0.2)
```

- Vincoli: Sulla superficie possono essere specificati dei vincoli che
    costringono il proxy in una determinata posizione (come nella
    simulazione di una superficie magnetica). Per attivare questa
    modalità è sufficiente eseguire il seguente comando prima della
    creazione dell'oggetto:
```
hlTouchModel(HL_COSTRAINT);
```

    per tornare alla modalità di default si richiama nuovamente la
    funzione `hlTouchModel` con il parametro `HL_CONTACT`. E' possibile
    inoltre impostare il raggio d'azione del vincolo tramite il comando:
```
hlTouchModelf(HL_SNAP_DISTANCE, 1.5);
```

    oggi volta che il proxy viene a trovarsi ad una distanza dal vincolo
    minore del valore specificato da questa istruzione, verrà applicato
    il vincolo con una forza proporzionale alla distanza.

Per tutte le proprietà il coefficiente varia da 0 a 1. E' opportuno
porre attenzione all'utilizzo di valori troppo elevati in quanto possono
causare instabilità del dispositivo.

### Eventi

Tramite le HLAPI è possibile associare una funzione al verificarsi di un
determinato evento. Ciò avviene eseguendo il comando:
```
hlAddEventCallback(HL_EVENT_TOUCH, HL_OBJECT_ANY, HL_CLIENT_THREAD, &function, NULL);
```

in questo modo verrà eseguita la funzione `function` ogni volta che
un'oggetto verrà toccato. La funzione di callback deve essere
specificata come segue:
```
void HLCALLBACK function(HLENUM event, HLuint object, HLenum thread, HLcache *cache, void *userdata)
```

Le callback possono essere associate ai seguenti eventi:

- Tocco: Un tocco (*touch*) viene individuato quando il motore di rendering
    determina un contatto tra il proxy e un oggetto di cui è stato fatto
    il rendering nell'ultimo frame; se il proxy resta in contatto con
    l'oggetto, solo il primo istante di contatto viene rilevato come
    tocco. Analogamente il distacco (*untouch*) dalla superficie viene
    rilevato quando il proxy smette di essere in contatto con l'oggetto.

- Movimento: Il moto viene rilevato come tale quando la posizione o
    l'orientamento del proxy cambiano. La variazione di movimento e
    orientamento che viene rilevata come movimento può essere modificata
    tramite le variabili `HL_EVENT_MOTION_TOLERANCE` e
    `HL_EVENT_ANGULAR_TOLERANCE`.

- Pulsante: Possono essere associate delle funzioni anche alla pressione dei
    pulsanti presenti sul dispositivo usando come identificatori per il
    primo pulsante `HL_EVENT1_BUTTON_DOWN`, `HL_EVENT1_BUTTON_UP` e per
    il secondo pulsante `HL_EVENT2_BUTTON_DOWN`, `HL_EVENT2_BUTTON_UP`.

