/* ===================================================================
   i18n4 — wiring layer that makes the rest of the app translatable.

   Two mechanisms, one helper tr():
   • CF_EN2KEY — a reverse index (English text → dict key) built from
     CF_DICT.en after i18n / i18n2 / i18n3 have merged. Lets us reach the
     ~16-language strings already in the dictionary just by their English
     source text.
   • CF_UI_MAP — fresh translations (es, ca, fr, de, it, pt) for the many
     UI strings that were hard-coded in English across the app
     (Medication, Community, Journal chrome, Home, Dr. CF…).

   tr(en)  → translated string for the current language (English passthrough)
   trf(en, vars) → tr() then fills {placeholders}
   =================================================================== */

/* English source → translations for the 6 requested languages. */
const CF_UI_MAP = {
  /* ---------------- MEDICATION ---------------- */
  "Tablet": { es:"Comprimido", ca:"Comprimit", fr:"Comprimé", de:"Tablette", it:"Compressa", pt:"Comprimido" },
  "Capsule": { es:"Cápsula", ca:"Càpsula", fr:"Gélule", de:"Kapsel", it:"Capsula", pt:"Cápsula" },
  "Injection": { es:"Inyección", ca:"Injecció", fr:"Injection", de:"Injektion", it:"Iniezione", pt:"Injeção" },
  "Eye drops": { es:"Colirio", ca:"Col·liri", fr:"Gouttes", de:"Augentropfen", it:"Collirio", pt:"Colírio" },
  "Tablets in stock": { es:"Comprimidos disponibles", ca:"Comprimits disponibles", fr:"Comprimés en stock", de:"Tabletten vorrätig", it:"Compresse disponibili", pt:"Comprimidos em estoque" },
  "Capsules in stock": { es:"Cápsulas disponibles", ca:"Càpsules disponibles", fr:"Gélules en stock", de:"Kapseln vorrätig", it:"Capsule disponibili", pt:"Cápsulas em estoque" },
  "Doses (pens) in stock": { es:"Dosis (plumas) disponibles", ca:"Dosis (plomes) disponibles", fr:"Doses (stylos) en stock", de:"Dosen (Pens) vorrätig", it:"Dosi (penne) disponibili", pt:"Doses (canetas) em estoque" },
  "Drops (ml) remaining": { es:"Gotas (ml) restantes", ca:"Gotes (ml) restants", fr:"Gouttes (ml) restantes", de:"Tropfen (ml) übrig", it:"Gocce (ml) rimaste", pt:"Gotas (ml) restantes" },
  "now": { es:"ahora", ca:"ara", fr:"maintenant", de:"jetzt", it:"adesso", pt:"agora" },
  "1h ago": { es:"hace 1 h", ca:"fa 1 h", fr:"il y a 1 h", de:"vor 1 Std.", it:"1 h fa", pt:"há 1 h" },
  "2h ago": { es:"hace 2 h", ca:"fa 2 h", fr:"il y a 2 h", de:"vor 2 Std.", it:"2 h fa", pt:"há 2 h" },
  "3h ago": { es:"hace 3 h", ca:"fa 3 h", fr:"il y a 3 h", de:"vor 3 Std.", it:"3 h fa", pt:"há 3 h" },
  "4h ago": { es:"hace 4 h", ca:"fa 4 h", fr:"il y a 4 h", de:"vor 4 Std.", it:"4 h fa", pt:"há 4 h" },
  "My medications": { es:"Mis medicamentos", ca:"Els meus medicaments", fr:"Mes médicaments", de:"Meine Medikamente", it:"I miei farmaci", pt:"Meus medicamentos" },
  "Add": { es:"Añadir", ca:"Afegeix", fr:"Ajouter", de:"Hinzufügen", it:"Aggiungi", pt:"Adicionar" },
  "with food": { es:"con comida", ca:"amb menjar", fr:"avec repas", de:"mit Essen", it:"con cibo", pt:"com comida" },
  "Reminders": { es:"Recordatorios", ca:"Recordatoris", fr:"Rappels", de:"Erinnerungen", it:"Promemoria", pt:"Lembretes" },
  "Reminders ring at each scheduled time. Tap a dose to mark it taken.": { es:"Los recordatorios suenan a cada hora programada. Toca una dosis para marcarla como tomada.", ca:"Els recordatoris sonen a cada hora programada. Toca una dosi per marcar-la com a presa.", fr:"Les rappels sonnent à chaque heure programmée. Touchez une dose pour la marquer comme prise.", de:"Erinnerungen klingeln zu jeder geplanten Zeit. Tippe auf eine Dosis, um sie als eingenommen zu markieren.", it:"I promemoria suonano a ogni orario programmato. Tocca una dose per segnarla come presa.", pt:"Os lembretes tocam em cada horário programado. Toque numa dose para marcá-la como tomada." },
  "Running low on {name}": { es:"Te queda poco de {name}", ca:"Et queda poc de {name}", fr:"Stock faible de {name}", de:"{name} wird knapp", it:"{name} sta per finire", pt:"{name} está acabando" },
  "{stock} left · about {days} days · tap to update": { es:"Quedan {stock} · unos {days} días · toca para actualizar", ca:"En queden {stock} · uns {days} dies · toca per actualitzar", fr:"Reste {stock} · environ {days} jours · touchez pour mettre à jour", de:"Noch {stock} · ca. {days} Tage · zum Aktualisieren tippen", it:"Rimangono {stock} · circa {days} giorni · tocca per aggiornare", pt:"Restam {stock} · cerca de {days} dias · toque para atualizar" },
  "Next dose": { es:"Próxima dosis", ca:"Pròxima dosi", fr:"Prochaine dose", de:"Nächste Dosis", it:"Prossima dose", pt:"Próxima dose" },
  "TODAY": { es:"HOY", ca:"AVUI", fr:"AUJOURD'HUI", de:"HEUTE", it:"OGGI", pt:"HOJE" },
  "Take now": { es:"Tomar ahora", ca:"Pren ara", fr:"Prendre", de:"Jetzt nehmen", it:"Prendi ora", pt:"Tomar agora" },
  "All doses taken 🌿": { es:"Todas las dosis tomadas 🌿", ca:"Totes les dosis preses 🌿", fr:"Toutes les doses prises 🌿", de:"Alle Dosen eingenommen 🌿", it:"Tutte le dosi prese 🌿", pt:"Todas as doses tomadas 🌿" },
  "Nothing scheduled": { es:"Nada programado", ca:"Res programat", fr:"Rien de prévu", de:"Nichts geplant", it:"Niente in programma", pt:"Nada agendado" },
  "Great job staying on track today.": { es:"¡Buen trabajo manteniéndote al día hoy!", ca:"Bona feina mantenint-te al dia avui!", fr:"Bravo d'avoir tout suivi aujourd'hui.", de:"Gut gemacht, heute alles eingehalten.", it:"Ottimo lavoro oggi, sei in regola.", pt:"Ótimo trabalho em dia hoje." },
  "Add a medication to get reminders.": { es:"Añade un medicamento para recibir recordatorios.", ca:"Afegeix un medicament per rebre recordatoris.", fr:"Ajoutez un médicament pour recevoir des rappels.", de:"Füge ein Medikament hinzu, um Erinnerungen zu erhalten.", it:"Aggiungi un farmaco per ricevere promemoria.", pt:"Adicione um medicamento para receber lembretes." },
  "MEDICATION REMINDER": { es:"RECORDATORIO DE MEDICACIÓN", ca:"RECORDATORI DE MEDICACIÓ", fr:"RAPPEL DE MÉDICAMENT", de:"MEDIKAMENTEN-ERINNERUNG", it:"PROMEMORIA FARMACO", pt:"LEMBRETE DE MEDICAÇÃO" },
  "Mark as taken": { es:"Marcar como tomada", ca:"Marca com a presa", fr:"Marquer comme prise", de:"Als eingenommen markieren", it:"Segna come presa", pt:"Marcar como tomada" },
  "Snooze 10 min": { es:"Posponer 10 min", ca:"Posposa 10 min", fr:"Reporter 10 min", de:"10 Min. später", it:"Posticipa 10 min", pt:"Adiar 10 min" },
  "Take {dose} with food & water": { es:"Toma {dose} con comida y agua", ca:"Pren {dose} amb menjar i aigua", fr:"Prenez {dose} avec repas et eau", de:"Nimm {dose} mit Essen & Wasser", it:"Prendi {dose} con cibo e acqua", pt:"Tome {dose} com comida e água" },
  "Take {dose}": { es:"Toma {dose}", ca:"Pren {dose}", fr:"Prenez {dose}", de:"Nimm {dose}", it:"Prendi {dose}", pt:"Tome {dose}" },
  "Daily alarm": { es:"Alarma diaria", ca:"Alarma diària", fr:"Alarme quotidienne", de:"Tägliche Erinnerung", it:"Sveglia giornaliera", pt:"Alarme diário" },
  "Scheduled alarm": { es:"Alarma programada", ca:"Alarma programada", fr:"Alarme programmée", de:"Geplante Erinnerung", it:"Sveglia programmata", pt:"Alarme agendado" },
  "Ringing at each time below": { es:"Suena a cada hora de abajo", ca:"Sona a cada hora de sota", fr:"Sonne à chaque heure ci-dessous", de:"Klingelt zu jeder Zeit unten", it:"Suona a ogni orario qui sotto", pt:"Toca em cada horário abaixo" },
  "Reminders are off": { es:"Los recordatorios están desactivados", ca:"Els recordatoris estan desactivats", fr:"Les rappels sont désactivés", de:"Erinnerungen sind aus", it:"I promemoria sono disattivati", pt:"Os lembretes estão desativados" },
  "How often?": { es:"¿Con qué frecuencia?", ca:"Amb quina freqüència?", fr:"À quelle fréquence ?", de:"Wie oft?", it:"Ogni quanto?", pt:"Com que frequência?" },
  "Reminder times": { es:"Horas de recordatorio", ca:"Hores de recordatori", fr:"Heures de rappel", de:"Erinnerungszeiten", it:"Orari dei promemoria", pt:"Horários de lembrete" },
  "Reminder time": { es:"Hora de recordatorio", ca:"Hora de recordatori", fr:"Heure de rappel", de:"Erinnerungszeit", it:"Orario del promemoria", pt:"Horário de lembrete" },
  "Dose {i}": { es:"Dosis {i}", ca:"Dosi {i}", fr:"Dose {i}", de:"Dosis {i}", it:"Dose {i}", pt:"Dose {i}" },
  "Time of dose": { es:"Hora de la dosis", ca:"Hora de la dosi", fr:"Heure de la dose", de:"Zeit der Dosis", it:"Orario della dose", pt:"Hora da dose" },
  "Time": { es:"Hora", ca:"Hora", fr:"Heure", de:"Zeit", it:"Orario", pt:"Hora" },
  "Times": { es:"Horas", ca:"Hores", fr:"Heures", de:"Zeiten", it:"Orari", pt:"Horários" },
  "Rings once a week at this time.": { es:"Suena una vez por semana a esta hora.", ca:"Sona un cop per setmana a aquesta hora.", fr:"Sonne une fois par semaine à cette heure.", de:"Klingelt einmal pro Woche zu dieser Zeit.", it:"Suona una volta a settimana a quest'ora.", pt:"Toca uma vez por semana neste horário." },
  "Rings once every 15 days at this time.": { es:"Suena una vez cada 15 días a esta hora.", ca:"Sona un cop cada 15 dies a aquesta hora.", fr:"Sonne une fois tous les 15 jours à cette heure.", de:"Klingelt alle 15 Tage zu dieser Zeit.", it:"Suona ogni 15 giorni a quest'ora.", pt:"Toca a cada 15 dias neste horário." },
  "Alarm sound": { es:"Sonido de alarma", ca:"So de l'alarma", fr:"Son de l'alarme", de:"Alarmton", it:"Suono della sveglia", pt:"Som do alarme" },
  "Save reminders": { es:"Guardar recordatorios", ca:"Desa els recordatoris", fr:"Enregistrer les rappels", de:"Erinnerungen speichern", it:"Salva promemoria", pt:"Salvar lembretes" },
  "Save changes": { es:"Guardar cambios", ca:"Desa els canvis", fr:"Enregistrer", de:"Änderungen speichern", it:"Salva modifiche", pt:"Salvar alterações" },
  "Forest chime": { es:"Campanas del bosque", ca:"Campanes del bosc", fr:"Carillon forêt", de:"Waldglocke", it:"Carillon bosco", pt:"Sino da floresta" },
  "Soft bell": { es:"Campana suave", ca:"Campana suau", fr:"Cloche douce", de:"Sanfte Glocke", it:"Campana dolce", pt:"Sino suave" },
  "Marimba": { es:"Marimba", ca:"Marimba", fr:"Marimba", de:"Marimba", it:"Marimba", pt:"Marimba" },
  "Birdsong": { es:"Canto de pájaros", ca:"Cant d'ocells", fr:"Chant d'oiseaux", de:"Vogelgesang", it:"Canto degli uccelli", pt:"Canto de pássaros" },
  "Edit medication": { es:"Editar medicamento", ca:"Edita el medicament", fr:"Modifier le médicament", de:"Medikament bearbeiten", it:"Modifica farmaco", pt:"Editar medicamento" },
  "Add medication": { es:"Añadir medicamento", ca:"Afegeix un medicament", fr:"Ajouter un médicament", de:"Medikament hinzufügen", it:"Aggiungi farmaco", pt:"Adicionar medicamento" },
  "New entry": { es:"Nueva entrada", ca:"Nova entrada", fr:"Nouvelle entrée", de:"Neuer Eintrag", it:"Nuova voce", pt:"Nova entrada" },
  "Name": { es:"Nombre", ca:"Nom", fr:"Nom", de:"Name", it:"Nome", pt:"Nome" },
  "Strength": { es:"Dosis", ca:"Dosi", fr:"Dosage", de:"Stärke", it:"Dosaggio", pt:"Dosagem" },
  "Type": { es:"Tipo", ca:"Tipus", fr:"Type", de:"Typ", it:"Tipo", pt:"Tipo" },
  "Dose": { es:"Dosis", ca:"Dosi", fr:"Dose", de:"Dosis", it:"Dose", pt:"Dose" },
  "With food": { es:"Con comida", ca:"Amb menjar", fr:"Avec repas", de:"Mit Essen", it:"Con cibo", pt:"Com comida" },
  "Delete": { es:"Eliminar", ca:"Elimina", fr:"Supprimer", de:"Löschen", it:"Elimina", pt:"Excluir" },
  "{n}× daily": { es:"{n}× al día", ca:"{n}× al dia", fr:"{n}× par jour", de:"{n}× täglich", it:"{n}× al giorno", pt:"{n}× por dia" },
  "1× / week": { es:"1× / semana", ca:"1× / setmana", fr:"1× / semaine", de:"1× / Woche", it:"1× / settimana", pt:"1× / semana" },
  "1× / 15 days": { es:"1× / 15 días", ca:"1× / 15 dies", fr:"1× / 15 jours", de:"1× / 15 Tage", it:"1× / 15 giorni", pt:"1× / 15 dias" },
  "left": { es:"restantes", ca:"restants", fr:"restant", de:"übrig", it:"rimaste", pt:"restantes" },
  "in {d}d": { es:"en {d}d", ca:"en {d}d", fr:"dans {d}j", de:"in {d}T", it:"tra {d}g", pt:"em {d}d" },
  "in {h}h {m}m": { es:"en {h}h {m}m", ca:"en {h}h {m}m", fr:"dans {h}h {m}m", de:"in {h}h {m}m", it:"tra {h}h {m}m", pt:"em {h}h {m}m" },
  "in {m} min": { es:"en {m} min", ca:"en {m} min", fr:"dans {m} min", de:"in {m} Min", it:"tra {m} min", pt:"em {m} min" },

  /* ---------------- COMMUNITY ---------------- */
  "Posts": { es:"Publicaciones", ca:"Publicacions", fr:"Posts", de:"Beiträge", it:"Post", pt:"Posts" },
  "CF Online": { es:"CF en línea", ca:"CF en línia", fr:"CF en ligne", de:"CF online", it:"CF online", pt:"CF online" },
  "Best CF Online": { es:"Mejores CF en línea", ca:"Millors CF en línia", fr:"Meilleurs CF en ligne", de:"Beste CF online", it:"Migliori CF online", pt:"Melhores CF online" },
  "Doctors": { es:"Médicos", ca:"Metges", fr:"Médecins", de:"Ärzte", it:"Medici", pt:"Médicos" },
  "New Post": { es:"Nueva publicación", ca:"Nova publicació", fr:"Nouveau post", de:"Neuer Beitrag", it:"Nuovo post", pt:"Novo post" },
  "Patient": { es:"Paciente", ca:"Pacient", fr:"Patient", de:"Patient", it:"Paziente", pt:"Paciente" },
  "Doctor": { es:"Médico", ca:"Metge", fr:"Médecin", de:"Arzt", it:"Medico", pt:"Médico" },
  "Verified Doctors": { es:"Médicos verificados", ca:"Metges verificats", fr:"Médecins vérifiés", de:"Verifizierte Ärzte", it:"Medici verificati", pt:"Médicos verificados" },
  "A network of verified doctors supporting Crohn Friends. Pick a specialty below and we'll show you the right experts. 🌿": { es:"Una red de médicos verificados que apoyan a Crohn Friends. Elige una especialidad abajo y te mostraremos los expertos adecuados. 🌿", ca:"Una xarxa de metges verificats que donen suport a Crohn Friends. Tria una especialitat a sota i et mostrarem els experts adequats. 🌿", fr:"Un réseau de médecins vérifiés qui soutiennent Crohn Friends. Choisissez une spécialité ci-dessous et nous vous montrerons les bons experts. 🌿", de:"Ein Netzwerk verifizierter Ärzte für Crohn Friends. Wähle unten eine Fachrichtung und wir zeigen dir die passenden Experten. 🌿", it:"Una rete di medici verificati a supporto di Crohn Friends. Scegli una specialità qui sotto e ti mostreremo gli esperti giusti. 🌿", pt:"Uma rede de médicos verificados que apoiam o Crohn Friends. Escolha uma especialidade abaixo e mostraremos os especialistas certos. 🌿" },
  "Choose a specialization": { es:"Elige una especialización", ca:"Tria una especialització", fr:"Choisissez une spécialisation", de:"Wähle eine Fachrichtung", it:"Scegli una specializzazione", pt:"Escolha uma especialização" },
  "Gastroenterologist": { es:"Gastroenterólogo", ca:"Gastroenteròleg", fr:"Gastro-entérologue", de:"Gastroenterologe", it:"Gastroenterologo", pt:"Gastroenterologista" },
  "IBD Specialist": { es:"Especialista en EII", ca:"Especialista en MII", fr:"Spécialiste MICI", de:"CED-Spezialist", it:"Specialista MICI", pt:"Especialista em DII" },
  "Colorectal Surgeon": { es:"Cirujano colorrectal", ca:"Cirurgià colorectal", fr:"Chirurgien colorectal", de:"Kolorektalchirurg", it:"Chirurgo colorettale", pt:"Cirurgião colorretal" },
  "IBD & Nutrition": { es:"EII y nutrición", ca:"MII i nutrició", fr:"MICI & nutrition", de:"CED & Ernährung", it:"MICI e nutrizione", pt:"DII e nutrição" },
  "Dietitian": { es:"Dietista", ca:"Dietista", fr:"Diététicien", de:"Diätassistent", it:"Dietista", pt:"Nutricionista" },
  "Pediatric GI": { es:"Gastro pediátrico", ca:"Gastro pediàtric", fr:"Gastro-pédiatre", de:"Kinder-Gastro", it:"Gastro pediatrico", pt:"Gastro pediátrico" },
  "Psychologist": { es:"Psicólogo", ca:"Psicòleg", fr:"Psychologue", de:"Psychologe", it:"Psicologo", pt:"Psicólogo" },
  "Psychiatrist": { es:"Psiquiatra", ca:"Psiquiatre", fr:"Psychiatre", de:"Psychiater", it:"Psichiatra", pt:"Psiquiatra" },
  "Dermatologist": { es:"Dermatólogo", ca:"Dermatòleg", fr:"Dermatologue", de:"Dermatologe", it:"Dermatologo", pt:"Dermatologista" },
  "Rheumatologist": { es:"Reumatólogo", ca:"Reumatòleg", fr:"Rhumatologue", de:"Rheumatologe", it:"Reumatologo", pt:"Reumatologista" },
  "Ophthalmologist": { es:"Oftalmólogo", ca:"Oftalmòleg", fr:"Ophtalmologue", de:"Augenarzt", it:"Oculista", pt:"Oftalmologista" },
  "Pain Specialist": { es:"Especialista del dolor", ca:"Especialista del dolor", fr:"Spécialiste de la douleur", de:"Schmerzspezialist", it:"Specialista del dolore", pt:"Especialista em dor" },
  "Gut, digestion & Crohn's care": { es:"Intestino, digestión y cuidado del Crohn", ca:"Intestí, digestió i cura del Crohn", fr:"Intestin, digestion & soin de Crohn", de:"Darm, Verdauung & Crohn-Versorgung", it:"Intestino, digestione e cura del Crohn", pt:"Intestino, digestão e cuidado do Crohn" },
  "Crohn's & colitis experts": { es:"Expertos en Crohn y colitis", ca:"Experts en Crohn i colitis", fr:"Experts Crohn & colite", de:"Crohn- & Colitis-Experten", it:"Esperti di Crohn e colite", pt:"Especialistas em Crohn e colite" },
  "Surgery & bowel resections": { es:"Cirugía y resecciones intestinales", ca:"Cirurgia i reseccions intestinals", fr:"Chirurgie & résections intestinales", de:"Operation & Darmresektionen", it:"Chirurgia e resezioni intestinali", pt:"Cirurgia e ressecções intestinais" },
  "Diet plans built for IBD": { es:"Planes de dieta para la EII", ca:"Plans de dieta per a la MII", fr:"Plans alimentaires pour MICI", de:"Ernährungspläne für CED", it:"Piani alimentari per MICI", pt:"Planos alimentares para DII" },
  "Everyday eating & gut health": { es:"Alimentación diaria y salud intestinal", ca:"Alimentació diària i salut intestinal", fr:"Alimentation quotidienne & santé intestinale", de:"Alltagsernährung & Darmgesundheit", it:"Alimentazione quotidiana e salute intestinale", pt:"Alimentação diária e saúde intestinal" },
  "Care for children & teens": { es:"Atención a niños y adolescentes", ca:"Atenció a infants i adolescents", fr:"Soins pour enfants & ados", de:"Versorgung für Kinder & Jugendliche", it:"Cura per bambini e adolescenti", pt:"Cuidado para crianças e adolescentes" },
  "Mental & emotional support": { es:"Apoyo mental y emocional", ca:"Suport mental i emocional", fr:"Soutien mental & émotionnel", de:"Mentale & emotionale Unterstützung", it:"Supporto mentale ed emotivo", pt:"Apoio mental e emocional" },
  "Mood, anxiety & medication": { es:"Ánimo, ansiedad y medicación", ca:"Ànim, ansietat i medicació", fr:"Humeur, anxiété & médicaments", de:"Stimmung, Angst & Medikamente", it:"Umore, ansia e farmaci", pt:"Humor, ansiedade e medicação" },
  "Skin flare-ups & rashes": { es:"Brotes cutáneos y erupciones", ca:"Brots cutanis i erupcions", fr:"Poussées cutanées & éruptions", de:"Hautschübe & Ausschläge", it:"Manifestazioni cutanee ed eruzioni", pt:"Surtos de pele e erupções" },
  "Joints & arthritis": { es:"Articulaciones y artritis", ca:"Articulacions i artritis", fr:"Articulations & arthrite", de:"Gelenke & Arthritis", it:"Articolazioni e artrite", pt:"Articulações e artrite" },
  "Eyes & uveitis": { es:"Ojos y uveítis", ca:"Ulls i uveïtis", fr:"Yeux & uvéite", de:"Augen & Uveitis", it:"Occhi e uveite", pt:"Olhos e uveíte" },
  "Chronic pain management": { es:"Manejo del dolor crónico", ca:"Maneig del dolor crònic", fr:"Gestion de la douleur chronique", de:"Behandlung chronischer Schmerzen", it:"Gestione del dolore cronico", pt:"Controle da dor crônica" },
  "All listed specialists are identity- and license-verified by Crohn Friends.": { es:"Todos los especialistas tienen identidad y licencia verificadas por Crohn Friends.", ca:"Tots els especialistes tenen identitat i llicència verificades per Crohn Friends.", fr:"Tous les spécialistes ont une identité et une licence vérifiées par Crohn Friends.", de:"Alle Spezialisten sind von Crohn Friends identitäts- und lizenzgeprüft.", it:"Tutti gli specialisti hanno identità e licenza verificate da Crohn Friends.", pt:"Todos os especialistas têm identidade e licença verificadas pelo Crohn Friends." },
  "Verified": { es:"Verificado", ca:"Verificat", fr:"Vérifié", de:"Verifiziert", it:"Verificato", pt:"Verificado" },
  "Speaks:": { es:"Habla:", ca:"Parla:", fr:"Parle :", de:"Spricht:", it:"Parla:", pt:"Fala:" },
  "yrs": { es:"años", ca:"anys", fr:"ans", de:"J.", it:"anni", pt:"anos" },
  "Ask for appointment": { es:"Pedir cita", ca:"Demana cita", fr:"Demander un RDV", de:"Termin anfragen", it:"Chiedi appuntamento", pt:"Pedir consulta" },
  "View request": { es:"Ver solicitud", ca:"Veure sol·licitud", fr:"Voir la demande", de:"Anfrage ansehen", it:"Vedi richiesta", pt:"Ver solicitação" },
  "Chat": { es:"Chat", ca:"Xat", fr:"Discuter", de:"Chat", it:"Chat", pt:"Chat" },
  "{n} verified doctor": { es:"{n} médico verificado", ca:"{n} metge verificat", fr:"{n} médecin vérifié", de:"{n} verifizierter Arzt", it:"{n} medico verificato", pt:"{n} médico verificado" },
  "{n} verified doctors": { es:"{n} médicos verificados", ca:"{n} metges verificats", fr:"{n} médecins vérifiés", de:"{n} verifizierte Ärzte", it:"{n} medici verificati", pt:"{n} médicos verificados" },
  "Recent Chats": { es:"Chats recientes", ca:"Xats recents", fr:"Discussions récentes", de:"Letzte Chats", it:"Chat recenti", pt:"Chats recentes" },
  "{n} open conversation": { es:"{n} conversación abierta", ca:"{n} conversa oberta", fr:"{n} conversation ouverte", de:"{n} offene Unterhaltung", it:"{n} conversazione aperta", pt:"{n} conversa aberta" },
  "{n} open conversations": { es:"{n} conversaciones abiertas", ca:"{n} converses obertes", fr:"{n} conversations ouvertes", de:"{n} offene Unterhaltungen", it:"{n} conversazioni aperte", pt:"{n} conversas abertas" },
  "Start a new chat": { es:"Iniciar un chat nuevo", ca:"Inicia un xat nou", fr:"Démarrer une discussion", de:"Neuen Chat starten", it:"Avvia una nuova chat", pt:"Iniciar um novo chat" },
  "Say hi 👋": { es:"Saluda 👋", ca:"Saluda 👋", fr:"Dites bonjour 👋", de:"Sag Hallo 👋", it:"Saluta 👋", pt:"Diga oi 👋" },
  "You: ": { es:"Tú: ", ca:"Tu: ", fr:"Vous : ", de:"Du: ", it:"Tu: ", pt:"Você: " },
  "Title": { es:"Título", ca:"Títol", fr:"Titre", de:"Titel", it:"Titolo", pt:"Título" },
  "A short, clear headline": { es:"Un titular breve y claro", ca:"Un titular breu i clar", fr:"Un titre court et clair", de:"Eine kurze, klare Überschrift", it:"Un titolo breve e chiaro", pt:"Um título curto e claro" },
  "What would you like to share?": { es:"¿Qué te gustaría compartir?", ca:"Què t'agradaria compartir?", fr:"Que voulez-vous partager ?", de:"Was möchtest du teilen?", it:"Cosa vuoi condividere?", pt:"O que você gostaria de compartilhar?" },
  "Share an experience, a tip, or ask the community a question…": { es:"Comparte una experiencia, un consejo o pregunta a la comunidad…", ca:"Comparteix una experiència, un consell o pregunta a la comunitat…", fr:"Partagez une expérience, un conseil ou posez une question à la communauté…", de:"Teile eine Erfahrung, einen Tipp oder stelle der Community eine Frage…", it:"Condividi un'esperienza, un consiglio o fai una domanda alla comunità…", pt:"Compartilhe uma experiência, uma dica ou faça uma pergunta à comunidade…" },
  "Publish post": { es:"Publicar", ca:"Publica", fr:"Publier", de:"Beitrag veröffentlichen", it:"Pubblica", pt:"Publicar" },
  "Share with the community": { es:"Comparte con la comunidad", ca:"Comparteix amb la comunitat", fr:"Partagez avec la communauté", de:"Mit der Community teilen", it:"Condividi con la comunità", pt:"Compartilhe com a comunidade" },
  "Posting as a community member": { es:"Publicando como miembro de la comunidad", ca:"Publicant com a membre de la comunitat", fr:"Publication en tant que membre", de:"Beitrag als Community-Mitglied", it:"Pubblichi come membro della comunità", pt:"Publicando como membro da comunidade" },
  "Category": { es:"Categoría", ca:"Categoria", fr:"Catégorie", de:"Kategorie", it:"Categoria", pt:"Categoria" },
  "Requested {date} · {time} — awaiting reply (within 48h)": { es:"Solicitado {date} · {time} — esperando respuesta (en 48 h)", ca:"Sol·licitat {date} · {time} — esperant resposta (en 48 h)", fr:"Demandé {date} · {time} — en attente de réponse (sous 48 h)", de:"Angefragt {date} · {time} — Antwort ausstehend (innerhalb 48 h)", it:"Richiesto {date} · {time} — in attesa di risposta (entro 48 h)", pt:"Solicitado {date} · {time} — aguardando resposta (em 48 h)" },
  "Comments": { es:"Comentarios", ca:"Comentaris", fr:"Commentaires", de:"Kommentare", it:"Commenti", pt:"Comentários" },
  "No comments yet — be the first!": { es:"Aún no hay comentarios. ¡Sé el primero!", ca:"Encara no hi ha comentaris. Sigues el primer!", fr:"Pas encore de commentaires — soyez le premier !", de:"Noch keine Kommentare — sei der Erste!", it:"Ancora nessun commento — sii il primo!", pt:"Ainda sem comentários — seja o primeiro!" },
  "Write a comment…": { es:"Escribe un comentario…", ca:"Escriu un comentari…", fr:"Écrire un commentaire…", de:"Kommentar schreiben…", it:"Scrivi un commento…", pt:"Escreva um comentário…" },
  "Nutrition": { es:"Nutrición", ca:"Nutrició", fr:"Nutrition", de:"Ernährung", it:"Nutrizione", pt:"Nutrição" },
  "Medications": { es:"Medicación", ca:"Medicació", fr:"Médicaments", de:"Medikamente", it:"Farmaci", pt:"Medicação" },
  "Medical Advice": { es:"Consejo médico", ca:"Consell mèdic", fr:"Conseil médical", de:"Medizinischer Rat", it:"Consiglio medico", pt:"Conselho médico" },
  "Holistic": { es:"Holístico", ca:"Holístic", fr:"Holistique", de:"Ganzheitlich", it:"Olistico", pt:"Holístico" },
  "General": { es:"General", ca:"General", fr:"Général", de:"Allgemein", it:"Generale", pt:"Geral" },
  "Thanks for sharing — this really helped me! 🙏": { es:"Gracias por compartir, ¡esto me ayudó mucho! 🙏", ca:"Gràcies per compartir, això m'ha ajudat molt! 🙏", fr:"Merci d'avoir partagé — ça m'a vraiment aidé ! 🙏", de:"Danke fürs Teilen — das hat mir sehr geholfen! 🙏", it:"Grazie per aver condiviso — mi ha aiutato molto! 🙏", pt:"Obrigado por compartilhar — isso me ajudou muito! 🙏" },
  "I experienced exactly the same thing.": { es:"Me pasó exactamente lo mismo.", ca:"Em va passar exactament el mateix.", fr:"J'ai vécu exactement la même chose.", de:"Mir ist genau dasselbe passiert.", it:"Ho vissuto esattamente la stessa cosa.", pt:"Passei exatamente pela mesma coisa." },
  "Really useful, saving this post!": { es:"Muy útil, ¡guardo esta publicación!", ca:"Molt útil, deso aquesta publicació!", fr:"Très utile, je sauvegarde ce post !", de:"Sehr nützlich, ich speichere diesen Beitrag!", it:"Molto utile, salvo questo post!", pt:"Muito útil, vou salvar este post!" },
  "Appreciate you speaking up about this 💚": { es:"Gracias por hablar de esto 💚", ca:"Gràcies per parlar-ne 💚", fr:"Merci d'en parler 💚", de:"Danke, dass du das ansprichst 💚", it:"Grazie per averne parlato 💚", pt:"Agradeço por falar sobre isso 💚" },

  /* ---------------- HOME ---------------- */
  "How was your day?": { es:"¿Cómo ha ido tu día?", ca:"Com ha anat el teu dia?", fr:"Comment s'est passée ta journée ?", de:"Wie war dein Tag?", it:"Com'è andata la tua giornata?", pt:"Como foi o seu dia?" },
  "You checked in today ✓": { es:"Has registrado hoy ✓", ca:"Has registrat avui ✓", fr:"Enregistré aujourd'hui ✓", de:"Heute eingecheckt ✓", it:"Registrato oggi ✓", pt:"Você registrou hoje ✓" },
  "Great job! · View your entry": { es:"¡Buen trabajo! · Ver tu registro", ca:"Bona feina! · Veure el registre", fr:"Bravo ! · Voir votre saisie", de:"Gut gemacht! · Eintrag ansehen", it:"Ottimo! · Vedi la voce", pt:"Bom trabalho! · Ver registro" },
  "10 seconds · tonight at 21:00": { es:"10 segundos · hoy a las 21:00", ca:"10 segons · avui a les 21:00", fr:"10 secondes · ce soir à 21h00", de:"10 Sekunden · heute um 21:00", it:"10 secondi · stasera alle 21:00", pt:"10 segundos · hoje às 21:00" },

  /* ---------------- JOURNAL extras ---------------- */
  "Bowel mov. today?": { es:"¿Deposiciones hoy?", ca:"Deposicions avui?", fr:"Selles aujourd'hui ?", de:"Stuhlgang heute?", it:"Evacuazioni oggi?", pt:"Evacuações hoje?" },
  "Steps done today?": { es:"¿Pasos hoy?", ca:"Passos avui?", fr:"Pas aujourd'hui ?", de:"Schritte heute?", it:"Passi oggi?", pt:"Passos hoje?" },
  "Time with loved ones today?": { es:"¿Tiempo con seres queridos hoy?", ca:"Temps amb éssers estimats avui?", fr:"Temps avec vos proches aujourd'hui ?", de:"Zeit mit Liebsten heute?", it:"Tempo con i cari oggi?", pt:"Tempo com pessoas queridas hoje?" },
  "Toxic people around today?": { es:"¿Personas tóxicas hoy?", ca:"Persones tòxiques avui?", fr:"Personnes toxiques aujourd'hui ?", de:"Toxische Menschen heute?", it:"Persone tossiche oggi?", pt:"Pessoas tóxicas hoje?" },
  "Sun protection used?": { es:"¿Has usado protección solar?", ca:"Has fet servir protecció solar?", fr:"Protection solaire utilisée ?", de:"Sonnenschutz benutzt?", it:"Protezione solare usata?", pt:"Usou proteção solar?" },
  "Flare-ups": { es:"Brotes", ca:"Brots", fr:"Poussées", de:"Schübe", it:"Riacutizzazioni", pt:"Crises" },
  "Bowel movements": { es:"Deposiciones", ca:"Deposicions", fr:"Selles", de:"Stuhlgang", it:"Evacuazioni", pt:"Evacuações" },
  "Water intake": { es:"Consumo de agua", ca:"Consum d'aigua", fr:"Hydratation", de:"Wasseraufnahme", it:"Acqua bevuta", pt:"Consumo de água" },
  "Sleep hours": { es:"Horas de sueño", ca:"Hores de son", fr:"Heures de sommeil", de:"Schlafstunden", it:"Ore di sonno", pt:"Horas de sono" },
  "Activity level": { es:"Nivel de actividad", ca:"Nivell d'activitat", fr:"Niveau d'activité", de:"Aktivitätsniveau", it:"Livello di attività", pt:"Nível de atividade" },
  "Steps today": { es:"Pasos hoy", ca:"Passos avui", fr:"Pas aujourd'hui", de:"Schritte heute", it:"Passi oggi", pt:"Passos hoje" },
  "Time in nature": { es:"Tiempo en la naturaleza", ca:"Temps a la natura", fr:"Temps dans la nature", de:"Zeit in der Natur", it:"Tempo in natura", pt:"Tempo na natureza" },
  "Time with animals": { es:"Tiempo con animales", ca:"Temps amb animals", fr:"Temps avec les animaux", de:"Zeit mit Tieren", it:"Tempo con gli animali", pt:"Tempo com animais" },
  "Sun exposure": { es:"Exposición al sol", ca:"Exposició al sol", fr:"Exposition au soleil", de:"Sonneneinstrahlung", it:"Esposizione al sole", pt:"Exposição ao sol" },
  "Cigarettes today": { es:"Cigarrillos hoy", ca:"Cigarrets avui", fr:"Cigarettes aujourd'hui", de:"Zigaretten heute", it:"Sigarette oggi", pt:"Cigarros hoje" },
  "Alcohol today": { es:"Alcohol hoy", ca:"Alcohol avui", fr:"Alcool aujourd'hui", de:"Alkohol heute", it:"Alcol oggi", pt:"Álcool hoje" },
  "Substances used": { es:"Sustancias usadas", ca:"Substàncies usades", fr:"Substances utilisées", de:"Verwendete Substanzen", it:"Sostanze usate", pt:"Substâncias usadas" },
  "Mindset": { es:"Mentalidad", ca:"Mentalitat", fr:"État d'esprit", de:"Einstellung", it:"Mentalità", pt:"Mentalidade" },
  "Time with loved ones": { es:"Tiempo con seres queridos", ca:"Temps amb éssers estimats", fr:"Temps avec les proches", de:"Zeit mit Liebsten", it:"Tempo con i cari", pt:"Tempo com pessoas queridas" },
  "Toxic people around": { es:"Personas tóxicas cerca", ca:"Persones tòxiques a prop", fr:"Personnes toxiques", de:"Toxische Menschen", it:"Persone tossiche", pt:"Pessoas tóxicas" },
  "Meditation": { es:"Meditación", ca:"Meditació", fr:"Méditation", de:"Meditation", it:"Meditazione", pt:"Meditação" },
  "Relaxation": { es:"Relajación", ca:"Relaxació", fr:"Détente", de:"Entspannung", it:"Relax", pt:"Relaxamento" },
  "Music listening": { es:"Escuchar música", ca:"Escoltar música", fr:"Écoute de musique", de:"Musik hören", it:"Ascolto di musica", pt:"Ouvir música" },
  "Few": { es:"Pocos", ca:"Pocs", fr:"Peu", de:"Wenige", it:"Pochi", pt:"Poucos" },
  "Rest": { es:"Reposo", ca:"Repòs", fr:"Repos", de:"Ruhe", it:"Riposo", pt:"Repouso" },
  "Logging for": { es:"Registrando", ca:"Registrant", fr:"Saisie du", de:"Eintrag für", it:"Registrazione del", pt:"Registrando" },
  "saved automatically": { es:"guardado automáticamente", ca:"desat automàticament", fr:"enregistré automatiquement", de:"automatisch gespeichert", it:"salvato automaticamente", pt:"salvo automaticamente" },
  "Food Journal": { es:"Diario de comidas", ca:"Diari de menjars", fr:"Journal alimentaire", de:"Ernährungstagebuch", it:"Diario alimentare", pt:"Diário alimentar" },
  "Snap your plate — we read the portion, calories & nutrients, then forget the photo.": { es:"Fotografía tu plato: leemos la ración, calorías y nutrientes, y luego olvidamos la foto.", ca:"Fotografia el teu plat: llegim la ració, calories i nutrients, i després oblidem la foto.", fr:"Photographiez votre assiette : on lit la portion, les calories et les nutriments, puis on oublie la photo.", de:"Fotografiere deinen Teller — wir erfassen Portion, Kalorien & Nährstoffe und vergessen das Foto.", it:"Fotografa il piatto: leggiamo porzione, calorie e nutrienti, poi dimentichiamo la foto.", pt:"Fotografe seu prato — lemos a porção, calorias e nutrientes, e esquecemos a foto." },
  "Your details": { es:"Tus datos", ca:"Les teves dades", fr:"Vos informations", de:"Deine Angaben", it:"I tuoi dati", pt:"Seus dados" },
  "Used to personalise your insights": { es:"Se usa para personalizar tus análisis", ca:"S'usa per personalitzar els teus anàlisis", fr:"Sert à personnaliser vos analyses", de:"Dient zur Personalisierung deiner Auswertungen", it:"Serve a personalizzare le tue analisi", pt:"Usado para personalizar suas análises" },
  "Edit": { es:"Editar", ca:"Edita", fr:"Modifier", de:"Bearbeiten", it:"Modifica", pt:"Editar" },
  "Weight": { es:"Peso", ca:"Pes", fr:"Poids", de:"Gewicht", it:"Peso", pt:"Peso" },
  "Height": { es:"Altura", ca:"Alçada", fr:"Taille", de:"Größe", it:"Altezza", pt:"Altura" },
  "Age": { es:"Edad", ca:"Edat", fr:"Âge", de:"Alter", it:"Età", pt:"Idade" },
  "With Crohn": { es:"Con Crohn", ca:"Amb Crohn", fr:"Avec Crohn", de:"Mit Crohn", it:"Con Crohn", pt:"Com Crohn" },
  "Years with Crohn": { es:"Años con Crohn", ca:"Anys amb Crohn", fr:"Années avec Crohn", de:"Jahre mit Crohn", it:"Anni con Crohn", pt:"Anos com Crohn" },
  "Edit your details": { es:"Edita tus datos", ca:"Edita les teves dades", fr:"Modifier vos informations", de:"Deine Angaben bearbeiten", it:"Modifica i tuoi dati", pt:"Editar seus dados" },
  "Keep these up to date for better insights.": { es:"Mantenlos actualizados para mejores análisis.", ca:"Mantén-los actualitzats per a millors anàlisis.", fr:"Gardez-les à jour pour de meilleures analyses.", de:"Halte sie aktuell für bessere Auswertungen.", it:"Tienili aggiornati per analisi migliori.", pt:"Mantenha-os atualizados para melhores análises." },
  "Save details": { es:"Guardar datos", ca:"Desa les dades", fr:"Enregistrer", de:"Angaben speichern", it:"Salva dati", pt:"Salvar dados" },
  "Food calendar": { es:"Calendario de comidas", ca:"Calendari de menjars", fr:"Calendrier alimentaire", de:"Ernährungskalender", it:"Calendario alimentare", pt:"Calendário alimentar" },
  "Take a photo": { es:"Hacer una foto", ca:"Fes una foto", fr:"Prendre une photo", de:"Foto aufnehmen", it:"Scatta una foto", pt:"Tirar uma foto" },
  "Food calendar track": { es:"Seguimiento por calendario", ca:"Seguiment per calendari", fr:"Suivi par calendrier", de:"Kalender-Verlauf", it:"Monitoraggio a calendario", pt:"Acompanhar por calendário" },
  "point camera at your plate": { es:"apunta la cámara a tu plato", ca:"apunta la càmera al teu plat", fr:"pointez la caméra sur votre assiette", de:"Kamera auf deinen Teller richten", it:"punta la fotocamera sul piatto", pt:"aponte a câmera para o prato" },
  "Best results: good light, plate filling most of the frame.": { es:"Mejores resultados: buena luz y el plato llenando casi todo el encuadre.", ca:"Millors resultats: bona llum i el plat omplint gairebé tot l'enquadrament.", fr:"Meilleurs résultats : bonne lumière, assiette remplissant le cadre.", de:"Beste Ergebnisse: gutes Licht, Teller füllt den Rahmen.", it:"Risultati migliori: buona luce e piatto che riempie l'inquadratura.", pt:"Melhores resultados: boa luz e o prato preenchendo o quadro." },
  "Reading your plate…": { es:"Leyendo tu plato…", ca:"Llegint el teu plat…", fr:"Lecture de votre assiette…", de:"Teller wird gelesen…", it:"Lettura del piatto…", pt:"Lendo seu prato…" },
  "Estimating portion, calories & nutrients": { es:"Estimando ración, calorías y nutrientes", ca:"Estimant ració, calories i nutrients", fr:"Estimation portion, calories & nutriments", de:"Portion, Kalorien & Nährstoffe werden geschätzt", it:"Stima di porzione, calorie e nutrienti", pt:"Estimando porção, calorias e nutrientes" },
  "Scan another": { es:"Escanear otro", ca:"Escaneja un altre", fr:"Scanner un autre", de:"Weiteren scannen", it:"Scansiona un altro", pt:"Escanear outro" },
  "Save summary": { es:"Guardar resumen", ca:"Desa el resum", fr:"Enregistrer le résumé", de:"Zusammenfassung speichern", it:"Salva riepilogo", pt:"Salvar resumo" },
  "Estimates only — not medical or dietary advice.": { es:"Solo estimaciones, no es consejo médico ni dietético.", ca:"Només estimacions, no és consell mèdic ni dietètic.", fr:"Estimations seulement — pas un avis médical ou diététique.", de:"Nur Schätzungen — keine medizinische oder Ernährungsberatung.", it:"Solo stime — non è un consiglio medico o dietetico.", pt:"Apenas estimativas — não é conselho médico ou dietético." },
  "Quantity on the plate:": { es:"Cantidad en el plato:", ca:"Quantitat al plat:", fr:"Quantité dans l'assiette :", de:"Menge auf dem Teller:", it:"Quantità nel piatto:", pt:"Quantidade no prato:" },
  "kcal · estimated": { es:"kcal · estimadas", ca:"kcal · estimades", fr:"kcal · estimées", de:"kcal · geschätzt", it:"kcal · stimate", pt:"kcal · estimadas" },
  "Vitamins": { es:"Vitaminas", ca:"Vitamines", fr:"Vitamines", de:"Vitamine", it:"Vitamine", pt:"Vitaminas" },
  "Minerals": { es:"Minerales", ca:"Minerals", fr:"Minéraux", de:"Mineralstoffe", it:"Minerali", pt:"Minerais" },
  "No meals logged this day": { es:"No hay comidas registradas este día", ca:"No hi ha menjars registrats aquest dia", fr:"Aucun repas enregistré ce jour", de:"An diesem Tag keine Mahlzeiten erfasst", it:"Nessun pasto registrato in questo giorno", pt:"Nenhuma refeição registrada neste dia" },
  "Snap a plate to start tracking.": { es:"Fotografía un plato para empezar.", ca:"Fotografia un plat per començar.", fr:"Photographiez une assiette pour commencer.", de:"Fotografiere einen Teller, um zu starten.", it:"Fotografa un piatto per iniziare.", pt:"Fotografe um prato para começar." },
  "What you logged that day.": { es:"Lo que registraste ese día.", ca:"El que vas registrar aquell dia.", fr:"Ce que vous avez enregistré ce jour-là.", de:"Was du an dem Tag erfasst hast.", it:"Ciò che hai registrato quel giorno.", pt:"O que você registrou naquele dia." },
  "Tap a highlighted day to see your meals.": { es:"Toca un día resaltado para ver tus comidas.", ca:"Toca un dia ressaltat per veure els teus menjars.", fr:"Touchez un jour mis en évidence pour voir vos repas.", de:"Tippe auf einen markierten Tag, um deine Mahlzeiten zu sehen.", it:"Tocca un giorno evidenziato per vedere i pasti.", pt:"Toque num dia destacado para ver suas refeições." },
  "Snap your plate — we read it, then forget the photo.": { es:"Fotografía tu plato: lo leemos y luego olvidamos la foto.", ca:"Fotografia el teu plat: el llegim i després oblidem la foto.", fr:"Photographiez votre assiette : on la lit, puis on oublie la photo.", de:"Fotografiere deinen Teller — wir lesen ihn und vergessen das Foto.", it:"Fotografa il piatto: lo leggiamo e poi dimentichiamo la foto.", pt:"Fotografe seu prato — lemos e esquecemos a foto." },

  /* ---------------- SETTINGS / misc ---------------- */
  "About Us": { es:"Sobre nosotros", ca:"Sobre nosaltres", fr:"À propos", de:"Über uns", it:"Chi siamo", pt:"Sobre nós" },
  "{n} languages": { es:"{n} idiomas", ca:"{n} idiomes", fr:"{n} langues", de:"{n} Sprachen", it:"{n} lingue", pt:"{n} idiomas" },

  /* ---------------- DR. CF ---------------- */
  "New conversation": { es:"Nueva conversación", ca:"Nova conversa", fr:"Nouvelle conversation", de:"Neue Unterhaltung", it:"Nuova conversazione", pt:"Nova conversa" },
  "New": { es:"Nueva", ca:"Nova", fr:"Nouvelle", de:"Neu", it:"Nuova", pt:"Nova" },
  "Previous conversations": { es:"Conversaciones anteriores", ca:"Converses anteriors", fr:"Conversations précédentes", de:"Frühere Unterhaltungen", it:"Conversazioni precedenti", pt:"Conversas anteriores" },
  "No conversations yet": { es:"Aún no hay conversaciones", ca:"Encara no hi ha converses", fr:"Pas encore de conversations", de:"Noch keine Unterhaltungen", it:"Ancora nessuna conversazione", pt:"Ainda sem conversas" },
  'Tap "New conversation" to start.': { es:'Toca "Nueva conversación" para empezar.', ca:'Toca "Nova conversa" per començar.', fr:'Touchez « Nouvelle conversation » pour commencer.', de:'Tippe auf „Neue Unterhaltung", um zu starten.', it:'Tocca "Nuova conversazione" per iniziare.', pt:'Toque em "Nova conversa" para começar.' },
  "{n} saved conversation": { es:"{n} conversación guardada", ca:"{n} conversa desada", fr:"{n} conversation enregistrée", de:"{n} gespeicherte Unterhaltung", it:"{n} conversazione salvata", pt:"{n} conversa salva" },
  "{n} saved conversations": { es:"{n} conversaciones guardadas", ca:"{n} converses desades", fr:"{n} conversations enregistrées", de:"{n} gespeicherte Unterhaltungen", it:"{n} conversazioni salvate", pt:"{n} conversas salvas" },
  "analysing your data…": { es:"analizando tus datos…", ca:"analitzant les teves dades…", fr:"analyse de vos données…", de:"deine Daten werden analysiert…", it:"analisi dei tuoi dati…", pt:"analisando seus dados…" },
  "How has my health been this week?": { es:"¿Cómo ha estado mi salud esta semana?", ca:"Com ha estat la meva salut aquesta setmana?", fr:"Comment va ma santé cette semaine ?", de:"Wie war meine Gesundheit diese Woche?", it:"Com'è stata la mia salute questa settimana?", pt:"Como esteve minha saúde esta semana?" },
  "Any patterns between my lifestyle and flares?": { es:"¿Hay patrones entre mi estilo de vida y los brotes?", ca:"Hi ha patrons entre el meu estil de vida i els brots?", fr:"Y a-t-il des liens entre mon mode de vie et mes poussées ?", de:"Gibt es Muster zwischen meinem Lebensstil und Schüben?", it:"Ci sono schemi tra il mio stile di vita e le riacutizzazioni?", pt:"Há padrões entre meu estilo de vida e as crises?" },
  "Tell me about my medications": { es:"Háblame de mis medicamentos", ca:"Parla'm dels meus medicaments", fr:"Parle-moi de mes médicaments", de:"Erzähl mir von meinen Medikamenten", it:"Parlami dei miei farmaci", pt:"Fale sobre meus medicamentos" },

  /* ---------------- EDIT PROFILE ---------------- */
  "Change photo": { es:"Cambiar foto", ca:"Canvia la foto", fr:"Changer la photo", de:"Foto ändern", it:"Cambia foto", pt:"Mudar foto" },
  "Upload a photo": { es:"Subir una foto", ca:"Puja una foto", fr:"Importer une photo", de:"Foto hochladen", it:"Carica una foto", pt:"Enviar uma foto" },
  "Or pick a colour": { es:"O elige un color", ca:"O tria un color", fr:"Ou choisissez une couleur", de:"Oder eine Farbe wählen", it:"Oppure scegli un colore", pt:"Ou escolha uma cor" },
  "Remove photo": { es:"Quitar foto", ca:"Treu la foto", fr:"Retirer la photo", de:"Foto entfernen", it:"Rimuovi foto", pt:"Remover foto" },
  "Display name": { es:"Nombre visible", ca:"Nom visible", fr:"Nom affiché", de:"Anzeigename", it:"Nome visualizzato", pt:"Nome de exibição" },
  "Status": { es:"Estado", ca:"Estat", fr:"Statut", de:"Status", it:"Stato", pt:"Status" },
  "A short line about you": { es:"Una frase corta sobre ti", ca:"Una frase curta sobre tu", fr:"Une courte phrase sur vous", de:"Eine kurze Zeile über dich", it:"Una breve frase su di te", pt:"Uma frase curta sobre você" },
  "e.g. Crohn's warrior since 2012 🌿": { es:"p. ej. Guerrero del Crohn desde 2012 🌿", ca:"p. ex. Guerrer del Crohn des del 2012 🌿", fr:"ex. Combattant de Crohn depuis 2012 🌿", de:"z. B. Crohn-Kämpfer seit 2012 🌿", it:"es. Guerriero del Crohn dal 2012 🌿", pt:"ex. Guerreiro do Crohn desde 2012 🌿" },
};

/* Build reverse index English text → dict key (after i18n/i18n2/i18n3). */
const CF_EN2KEY = {};
(function buildEn2Key() {
  try {
    const en = (window.CF_DICT && CF_DICT.en) || {};
    Object.keys(en).forEach((k) => {
      const v = en[k];
      if (typeof v === 'string' && v.length && CF_EN2KEY[v] === undefined) CF_EN2KEY[v] = k;
    });
  } catch (e) {}
})();

/* main helper — translate an English UI string for the active language */
function tr(en) {
  if (en == null) return en;
  const lang = (window.I18n && I18n.lang) || 'en';
  if (lang === 'en') return en;
  const m = CF_UI_MAP[en];
  if (m && m[lang]) return m[lang];
  const key = CF_EN2KEY[en];
  if (key) return I18n.t(key);
  return en;
}

/* template helper — tr() then substitute {placeholders} */
function trf(en, vars) {
  let s = tr(en);
  if (vars) Object.keys(vars).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
  return s;
}

Object.assign(window, { CF_UI_MAP, CF_EN2KEY, tr, trf });
