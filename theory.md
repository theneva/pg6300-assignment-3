# Drøftingsoppgave

__1. Hva kjennetegner de to viktigste typene automatisert testing av webapplikasjoner, og er det noen gang fordelaktig å _ikke_ benytte alle tilgjengelige former for automatisert testing?__

De to viktigste typene automatisert testing av webapplikasjoner (definert som både front- og back-end) er:

__Enhetstesting__ (unit testing)

Brukes én og én unit of code (funksjon) isolert fra resten av applikasjonen. For å oppnå isolasjon er det vanlig å _mocke_ ut eksterne avhengigheter. Enhetstester må være (veldig) raske og kjøres ofte – ellers er det ikke noe poeng i å ha dem. De skal derfor i utgangspunktet ikke for eksempel faktisk kontakte databasen. Viktigheten av dette blir spesielt tydelig når for eksempel utvikler en applikasjon til mobil enhet, der applikasjonen må deployes til en device (emulator eller fysisk enhet) for at avhengigheter skal være tilgjengelige. Skrives primært for å fange bugs med én gang de introduseres av ny kode.

Det er verdt å merke seg at det ofte kan være bedre å benytte seg av _noen_ dependencies i enkelte miljøer, som for eksempel når man skriver tester av controllerne til Express i Node.js.

I AngularJS/Node.js-verden benytter vi i dette kurset Mocha som testrammeverk og Chai som assertion-bibliotek. Alternativer inkluderer QUnit (designet for JQuery) som testrammeverk, og Jasmine i stedet for hele stacken.

__Ende-til-ende-testing__ (end-to-end testing)

Brukes for å teste brukerens opplevelse av applikasjonen for å fange bugs som direkte påvirker brukeren under endring av applikasjonen. Rører alle tredjepartsavhengigheter (kommuniserer faktisk med serveren, som igjen kommuniserer med eventuelle databaser), og krever derfor et faktisk testmiljø.

e2e-tester bruker (nødvendigvis) lang tid på å kjøres, fordi de krever at en faktisk nettleser kan interageres med for å hente ut elementer og navigere i applikasjonen. Som et resultat av dette er det lurt å teste de viktigste flytene i programmet (for eksempel innlogging og utlogging, innlegging av elementer i lister, og tilsvarende primærfunksjoner), og å skrive disse testene underveis. Det er viktig å ikke bli alt for spesifikk når man skriver testene, fordi dette fører til at små endringer i applikasjonens flyt eller design krever oppdatering (eller ofte sletting) av eksisterende tester, som det ofte har gått mye arbeid ned i å skrive.

I Angular.js/Node-verden benytter vi Protractor som bygger på Selenium og WebDriver til å utføre testene, Mocha som testrammeverk, og Chai som assertion-bibliotek.

__Når bør man ikke benytte testing?__

En bør kun ikke skrive automatiserte tester dersom kunden eksplisitt ikke gir lov til det. Som vi vil se under neste spørsmål, er det veldig mange positive aspekter ved å ha automatisert testing av applikasjonen. Det kan argumenteres for at disse fordelene kun blir tydelige i "store" applikasjoner med flere utviklere, og at et helgeprosjekt ikke trenger automatisert testing – men så lenge det finnes en spesifikasjon, burde disse uttrykkes som funksjonelle tester. Svaret er altså: __når økonomiske årsaker ikke tillater det__.

__2. Hvilke involverte parter drar nytte av automatisert testing, og på hvilke(n) måte(r)?__

Automatisert testing av applikasjonen har flere formål som i stor grad overlapper.

__Tester er funksjonell dokumentasjon__

Tester (spesielt e2e-tester) er en type dokumentasjon som faktisk tester at applikasjonen oppfører seg etter spec. Dette fører til at utviklerne (eller doc-teamet) kan bruke
færre ressurser på å skrive tekstlig dokumentasjon, fordi koden allerede inneholder godt beskrevne test suites og spesifikke tester. Dette er selvsagt nyttig for utviklerne, og kombinert med de neste punktene har automatisert testing også en stor økonomisk betydning: noen må selvfølgelig betale for prosjektet.

__Bug-fanging__

Automatisert testing av eksisterende kode fanger automatisk opp nye bugs som introduseres av nye endringer på kodebasen. Mens dette ikke nødvendigvis _alltid_ betyr at den nye koden er _feil_ (for eksempel kan applikasjonen ha fått nye krav til design), gir det en mulighet til å se hvilke user stories (krav) det nye designet bryter med. Kostnaden av å rette en feil øker drastisk proporsjonalt med tiden som går etter at feilen ble sluppet ut i produksjonsmiljøet (dårlig rykte, supportkostnader, brukere som går i tap), så automatisert testing vil definitivt spare mye tid og ressurser etter hvert som kodebasen vokser – spesielt hvis prosjektet involverer mange parter (utviklere, testere, kunder, andre stakeholders).

__Oppsummert__

Alt i alt kan det sies at automatisert testing, med sin positive effekt på tidssparing i både dokumentasjonsarbeid og -lesing, fanging av bugs, og fanging av brudd med tidligere krav i nytt design, har en positiv effekt på prosjektets helhetlige kostnader og effektivitet, i tillegg til å gjøre kodebasen enklere å arbeide med for utviklerne. Påvirkede parter blir dermed primært de som __betaler for__ prosjektet, men også for de som __styrer__ prosjektet fordi man umiddelbart fanger opp at nye krav bryter med gamle krav, og for __utviklerne__ av prosjektet fordi de (optimalt sett) umiddelbart fanger opp eventuelle feil de selv gjør.

Til sist bør det trekkes frem at krav til testbarhet ofte fører til tydeligere definerte moduler og lavere kobling i kodebasen, som gjør at den generelt blir lettere å manipulere, som igjen fører til at det blir lettere å fokusere på verdiskapning i form av nye features i stedet for vedlikehold og manuell testing.
