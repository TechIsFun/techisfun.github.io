---
layout: post
title: Una piattaforma per il rendering audio aptico di interazioni continue
tags: [haptic feedback, pure data]
image: hero-phantomomni.jpg
---

_Nel 2006 pubblicavo questa tesi dal titolo "Una piattaforma per il rendering audio aptico di interazioni continue" per la mia laurea in Ingegneria Informatica all’Università di Padova. 9 mesi passati a lavorare su quello che sicuramente è il progetto più complesso e interessante sul quale abbia mai lavorato._

# Indice dei capitoli

1. [La percezione aptica]({{ site.baseurl }}{% link _posts/2019-01-15-percezione-aptica.md %})
2. [La percezione uditiva]({{ site.baseurl }}{% link _posts/2019-01-22-percezione-uditiva.md %})
3. [Pure Data e i modelli audio]({{ site.baseurl }}{% link _posts/2019-01-29-pure-data-modelli-audio.md %})
4. [Dispositivi aptici]({{ site.baseurl }}{% link _posts/2019-02-05-dispositivi-aptici.md %})
5. [Il Phantom Omni]({{ site.baseurl }}{% link _posts/2019-02-12-phantom-omni.md %})
6. [L'applicazione Phantom Friction]({{ site.baseurl }}{% link _posts/2019-02-19-applicazione-phantom-friction.md %})
7. Esperimenti sulla percezione audio-aptica

# Introduzione
Se nel campo della computer graphics le tessiture (texture) sono state studiate estensivamente allo scopo di rendere sempre più reali gli ambienti virtuali, altrettanto non si può dire per quanto riguarda la computer haptics, dove con tale termine si intende la scienza che studia la simulazione e lo scambio tra utente e computer di informazioni legate al senso del tatto. Tuttavia, per creare un ambiente virtuale realistico, è indispensabile fornire all’utente un ritorno di suono in corrispondenza al verificarsi di un evento (come un contatto tra oggetti).

Quando tocchiamo la superficie di un oggetto reale ad occhi chiusi, raccogliamo principalmente due tipi di informazione: il primo tipo è costituito dalle informazioni percepite tramite le dita e le mani, ovvero tramite il senso del tatto; il secondo tipo è invece costituito dalle informazioni uditive, catturate dai suoni che vengono generati nel momento in cui muoviamo le nostre dita sulla superficie. La piattaforma descritta è stata realizzata proprio basandosi su questi concetti, estendendoli all’interazione con oggetti simulati.

L’obiettivo a cui mira questa tesi è la realizzazione di un sistema che permetta l’interazione visiva, aptica e sonora con un ambiente virtuale (dove la parola aptica è legata al senso di tocco attivo):
visiva in quanto l’utente può visualizzare su uno schermo gli oggetti virtuali con cui interagisce;
aptica perché gli oggetti virtuali possono essere sentiti al tatto;
audio perché, come in un ambiente reale, sia possibile ascoltare i suoni provocati dalle interazioni.

In particolare l’attenzione viene concentrata sulla realizzazione di tessiture sulle superfici, le quali, attraverso il controllo di alcuni parametri di significato fisico, possano far sentire (sia tramite il tatto che l’udito) all’utente super ci di diverso livello di ruvidità (non ci preoccupiamo invece delle tessiture grafiche). La sintesi dell’audio non ha più come elemento centrale il segnale che viene prodotto e percepito, ma la sorgente del suono: attraverso modelli fisici si cerca quindi di descrivere la sorgente (o le sorgenti) sonore unitamente agli eventi che producono il suono stesso. Variando un insieme ristretto di parametri è così possibile simulare diverse sorgenti; gli stessi parametri possono poi essere utilizzati per controllare la simulazione aptica.

La rappresentazione grafica dell’ambiente tridimensionale virtuale è stata fatta sfruttando le API OpenGL; si è scelto di mantenere questa componente molto semplice, infatti l’ambiente è costituito da un solo oggetto che si presenta liscio e monocromatico alla vista. Per rendere possibile la rappresentazione aptica invece è necessario eseguire un interfacciamento tra l’applicazione grafica e un dispositivo di force feedback (il Phantom® Omni di SensAble Technologies in questo caso); utilizzando tale dispositivo sarà possibile toccare ogni oggetto dell’ambiente virtuale. Infine la sintesi dell’audio è stata realizzata separatamente tramite l’ambiente di programmazione visuale Pure Data, implementando dei modelli fisici la cui validità è già consolidata. Le tre componenti possono essere eseguite contemporaneamente, realizzando una completa simulazione in tempo reale che può prestarsi ad una molteplicità di usi diversi.

Nel primo capitolo si descrive brevemente il senso del tatto, in particolare come il corpo umano raccoglie ed elabora le informazioni tattili; nel secondo invece viene analizzato il modo di percepire da parte dell’uomo i suoni nell’ambiente circostante.

Nel terzo capitolo si illustrano per prima cosa i modelli fisici su cui viene basata la sintesi dell’audio. I modelli comprendono la realizzazione di tessiture stocastiche a partire da un rumore filtrato e il rendering di suoni di contatto tramite una sintesi modale. Successivamente viene descritto il funzionamento dell’ambiente di programmazione Pure Data e dei moduli esterni utilizzati; segue una spiegazione dettagliata su come sono stati implementati i modelli fisici in patch eseguibili in tale ambiente.

Il capitolo 4 riporta una panoramica sui dispositivi aptici, mentre il capitolo successivo illustra nel dettaglio il dispositivo Phantom® Omni , unitamente al toolkit OpenHaptics utilizzato per la programmazione di tale dispositivo.

Nel capitolo 6 si tratta la programmazione dell’interfaccia grafica e dell’interfaccia aptica; viene spiegato come avviene il rendering delle forze e come sono realizzate le tessiture aptiche. Infine si spiega come queste componenti siano state integrate tra loro e come avviene la comunicazione tra l’interfaccia grafica/aptica e l’algoritmo di sintesi audio creato ed eseguito in Pure Data.

La parte finale (capitolo 7) è dedicata agli esperimenti di percezione bimodale audio aptica: dopo aver presentato una panoramica sugli studi che sono già stati condotti in questo campo, vengono illustrate le differenze rispetto a questi e gli aspetti innovativi degli studi svolti in questa tesi. Sono stati svolti tre esperimenti: il primo in condizione di variazione concorde degli stimoli audio e aptico, gli altri in condizioni di variazione discorde dei due stimoli. In conclusione vengono riportati i risultati e le discussioni sulle percezioni avute dai partecipanti.

