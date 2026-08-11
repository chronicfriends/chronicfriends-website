/* ===================================================================
   i18n5 — additional CF_UI_MAP entries for strings wired in the
   Medication + Journal (check-in / food journal / PDF) screens.
   Loaded right after i18n4.jsx; merges into CF_UI_MAP so tr() finds
   them. Languages: es, ca, fr, de, it, pt (en is the source text).
   =================================================================== */
Object.assign(CF_UI_MAP, {
  /* ---- medication dose strings (seed doses) ---- */
  "2 tablets": { es:"2 comprimidos", ca:"2 comprimits", fr:"2 comprimés", de:"2 Tabletten", it:"2 compresse", pt:"2 comprimidos" },
  "1 tablet": { es:"1 comprimido", ca:"1 comprimit", fr:"1 comprimé", de:"1 Tablette", it:"1 compressa", pt:"1 comprimido" },
  "1 capsule": { es:"1 cápsula", ca:"1 càpsula", fr:"1 gélule", de:"1 Kapsel", it:"1 capsula", pt:"1 cápsula" },
  "1 injection": { es:"1 inyección", ca:"1 injecció", fr:"1 injection", de:"1 Injektion", it:"1 iniezione", pt:"1 injeção" },
  "1 drop each eye": { es:"1 gota en cada ojo", ca:"1 gota a cada ull", fr:"1 goutte par œil", de:"1 Tropfen pro Auge", it:"1 goccia per occhio", pt:"1 gota em cada olho" },

  /* ---- journal: questions / labels missing from earlier maps ---- */
  "Activity level?": { es:"¿Nivel de actividad?", ca:"Nivell d'activitat?", fr:"Niveau d'activité ?", de:"Aktivitätsniveau?", it:"Livello di attività?", pt:"Nível de atividade?" },
  "years": { es:"años", ca:"anys", fr:"ans", de:"Jahre", it:"anni", pt:"anos" },

  /* ---- food journal ---- */
  "The photo is analysed on-device and never saved — only this written summary is kept.": { es:"La foto se analiza en el dispositivo y nunca se guarda: solo se conserva este resumen escrito.", ca:"La foto s'analitza al dispositiu i mai es desa: només es conserva aquest resum escrit.", fr:"La photo est analysée sur l'appareil et jamais enregistrée — seul ce résumé écrit est conservé.", de:"Das Foto wird auf dem Gerät analysiert und nie gespeichert — nur diese schriftliche Zusammenfassung bleibt.", it:"La foto è analizzata sul dispositivo e mai salvata — resta solo questo riepilogo scritto.", pt:"A foto é analisada no aparelho e nunca salva — apenas este resumo escrito é mantido." },
  "Amber days have logged meals. Each dot is one entry — tap a day to read it back.": { es:"Los días ámbar tienen comidas registradas. Cada punto es una entrada: toca un día para leerla.", ca:"Els dies ambre tenen menjars registrats. Cada punt és una entrada: toca un dia per llegir-la.", fr:"Les jours ambre ont des repas enregistrés. Chaque point est une entrée — touchez un jour pour la relire.", de:"Bernsteinfarbene Tage haben erfasste Mahlzeiten. Jeder Punkt ist ein Eintrag — tippe auf einen Tag.", it:"I giorni ambra hanno pasti registrati. Ogni punto è una voce — tocca un giorno per rileggerla.", pt:"Dias âmbar têm refeições registradas. Cada ponto é uma entrada — toque num dia para ler." },
  "kcal total": { es:"kcal en total", ca:"kcal en total", fr:"kcal au total", de:"kcal gesamt", it:"kcal totali", pt:"kcal no total" },
  "Gentle on the gut": { es:"Suave para el intestino", ca:"Suau per a l'intestí", fr:"Doux pour l'intestin", de:"Schonend für den Darm", it:"Delicato per l'intestino", pt:"Suave para o intestino" },
  "Generally fine": { es:"Generalmente bien", ca:"Generalment bé", fr:"Globalement ok", de:"Generell in Ordnung", it:"Generalmente ok", pt:"Geralmente ok" },
  "Worth watching": { es:"A vigilar", ca:"A vigilar", fr:"À surveiller", de:"Im Auge behalten", it:"Da tenere d'occhio", pt:"Vale observar" },
  "Protein": { es:"Proteína", ca:"Proteïna", fr:"Protéines", de:"Eiweiß", it:"Proteine", pt:"Proteína" },
  "Carbs": { es:"Carbohidratos", ca:"Carbohidrats", fr:"Glucides", de:"Kohlenhydrate", it:"Carboidrati", pt:"Carboidratos" },
  "Fat": { es:"Grasa", ca:"Greix", fr:"Lipides", de:"Fett", it:"Grassi", pt:"Gordura" },
  "Fiber": { es:"Fibra", ca:"Fibra", fr:"Fibres", de:"Ballaststoffe", it:"Fibre", pt:"Fibra" },

  /* ---- chart time ranges ---- */
  "Last 3 Days": { es:"Últimos 3 días", ca:"Últims 3 dies", fr:"3 derniers jours", de:"Letzte 3 Tage", it:"Ultimi 3 giorni", pt:"Últimos 3 dias" },
  "Last 7 Days": { es:"Últimos 7 días", ca:"Últims 7 dies", fr:"7 derniers jours", de:"Letzte 7 Tage", it:"Ultimi 7 giorni", pt:"Últimos 7 dias" },
  "Last 2 Weeks": { es:"Últimas 2 semanas", ca:"Últimes 2 setmanes", fr:"2 dernières semaines", de:"Letzte 2 Wochen", it:"Ultime 2 settimane", pt:"Últimas 2 semanas" },
  "Last 30 Days": { es:"Últimos 30 días", ca:"Últims 30 dies", fr:"30 derniers jours", de:"Letzte 30 Tage", it:"Ultimi 30 giorni", pt:"Últimos 30 dias" },
  "Last 6 Months": { es:"Últimos 6 meses", ca:"Últims 6 mesos", fr:"6 derniers mois", de:"Letzte 6 Monate", it:"Ultimi 6 mesi", pt:"Últimos 6 meses" },
  "Last 12 Months": { es:"Últimos 12 meses", ca:"Últims 12 mesos", fr:"12 derniers mois", de:"Letzte 12 Monate", it:"Ultimi 12 mesi", pt:"Últimos 12 meses" },
  "Last 2 Years": { es:"Últimos 2 años", ca:"Últims 2 anys", fr:"2 dernières années", de:"Letzte 2 Jahre", it:"Ultimi 2 anni", pt:"Últimos 2 anos" },
  "Last 3 days": { es:"Últimos 3 días", ca:"Últims 3 dies", fr:"3 derniers jours", de:"Letzte 3 Tage", it:"Ultimi 3 giorni", pt:"Últimos 3 dias" },
  "Last 7 days": { es:"Últimos 7 días", ca:"Últims 7 dies", fr:"7 derniers jours", de:"Letzte 7 Tage", it:"Ultimi 7 giorni", pt:"Últimos 7 dias" },
  "Last 14 days": { es:"Últimos 14 días", ca:"Últims 14 dies", fr:"14 derniers jours", de:"Letzte 14 Tage", it:"Ultimi 14 giorni", pt:"Últimos 14 dias" },
  "Last month": { es:"Último mes", ca:"Últim mes", fr:"Dernier mois", de:"Letzter Monat", it:"Ultimo mese", pt:"Último mês" },
  "Last 6 months": { es:"Últimos 6 meses", ca:"Últims 6 mesos", fr:"6 derniers mois", de:"Letzte 6 Monate", it:"Ultimi 6 mesi", pt:"Últimos 6 meses" },
  "Last year": { es:"Último año", ca:"Últim any", fr:"Dernière année", de:"Letztes Jahr", it:"Ultimo anno", pt:"Último ano" },
  "Last 2 years": { es:"Últimos 2 años", ca:"Últims 2 anys", fr:"2 dernières années", de:"Letzte 2 Jahre", it:"Ultimi 2 anni", pt:"Últimos 2 anos" },

  /* ---- PDF export sheet ---- */
  "Report preview": { es:"Vista previa del informe", ca:"Vista prèvia de l'informe", fr:"Aperçu du rapport", de:"Berichtvorschau", it:"Anteprima del report", pt:"Prévia do relatório" },
  "Download PDF": { es:"Descargar PDF", ca:"Baixa el PDF", fr:"Télécharger le PDF", de:"PDF herunterladen", it:"Scarica PDF", pt:"Baixar PDF" },
  "Generated from your saved entries.": { es:"Generado a partir de tus registros guardados.", ca:"Generat a partir dels teus registres desats.", fr:"Généré à partir de vos saisies enregistrées.", de:"Erstellt aus deinen gespeicherten Einträgen.", it:"Generato dalle tue voci salvate.", pt:"Gerado a partir dos seus registros salvos." },
  "Pick the charts and the period to export.": { es:"Elige los gráficos y el periodo a exportar.", ca:"Tria els gràfics i el període a exportar.", fr:"Choisissez les graphiques et la période à exporter.", de:"Wähle Diagramme und Zeitraum für den Export.", it:"Scegli i grafici e il periodo da esportare.", pt:"Escolha os gráficos e o período para exportar." },
  "Time period": { es:"Periodo de tiempo", ca:"Període de temps", fr:"Période", de:"Zeitraum", it:"Periodo di tempo", pt:"Período" },
  "Charts to include": { es:"Gráficos a incluir", ca:"Gràfics a incloure", fr:"Graphiques à inclure", de:"Enthaltene Diagramme", it:"Grafici da includere", pt:"Gráficos a incluir" },
  "Clear all": { es:"Quitar todo", ca:"Treu-ho tot", fr:"Tout effacer", de:"Alle abwählen", it:"Deseleziona tutto", pt:"Limpar tudo" },
  "Select all": { es:"Seleccionar todo", ca:"Selecciona-ho tot", fr:"Tout sélectionner", de:"Alle auswählen", it:"Seleziona tutto", pt:"Selecionar tudo" },
  "Food journal entries": { es:"Entradas del diario de comidas", ca:"Entrades del diari de menjars", fr:"Entrées du journal alimentaire", de:"Einträge des Ernährungstagebuchs", it:"Voci del diario alimentare", pt:"Entradas do diário alimentar" },
  "Building your report…": { es:"Generando tu informe…", ca:"Generant el teu informe…", fr:"Création de votre rapport…", de:"Bericht wird erstellt…", it:"Creazione del report…", pt:"Gerando seu relatório…" },
  "{n} section": { es:"{n} sección", ca:"{n} secció", fr:"{n} section", de:"{n} Abschnitt", it:"{n} sezione", pt:"{n} seção" },
  "{n} sections": { es:"{n} secciones", ca:"{n} seccions", fr:"{n} sections", de:"{n} Abschnitte", it:"{n} sezioni", pt:"{n} seções" },
  "Adjust": { es:"Ajustar", ca:"Ajusta", fr:"Ajuster", de:"Anpassen", it:"Regola", pt:"Ajustar" },
  "Downloaded": { es:"Descargado", ca:"Baixat", fr:"Téléchargé", de:"Heruntergeladen", it:"Scaricato", pt:"Baixado" },
  "Saved to your phone · Crohn-Friends-Report.pdf": { es:"Guardado en tu teléfono · Crohn-Friends-Report.pdf", ca:"Desat al teu telèfon · Crohn-Friends-Report.pdf", fr:"Enregistré sur votre téléphone · Crohn-Friends-Report.pdf", de:"Auf deinem Handy gespeichert · Crohn-Friends-Report.pdf", it:"Salvato sul telefono · Crohn-Friends-Report.pdf", pt:"Salvo no seu telefone · Crohn-Friends-Report.pdf" },

  /* ---- PDF document ---- */
  "Personal Health Report": { es:"Informe personal de salud", ca:"Informe personal de salut", fr:"Rapport de santé personnel", de:"Persönlicher Gesundheitsbericht", it:"Report personale di salute", pt:"Relatório pessoal de saúde" },
  "Patient details": { es:"Datos del paciente", ca:"Dades del pacient", fr:"Données du patient", de:"Patientendaten", it:"Dati del paziente", pt:"Dados do paciente" },
  "Active medications": { es:"Medicación activa", ca:"Medicació activa", fr:"Médicaments actifs", de:"Aktive Medikamente", it:"Farmaci attivi", pt:"Medicações ativas" },
  "Period summary": { es:"Resumen del periodo", ca:"Resum del període", fr:"Résumé de la période", de:"Zeitraum-Übersicht", it:"Riepilogo del periodo", pt:"Resumo do período" },
  "Days logged": { es:"Días registrados", ca:"Dies registrats", fr:"Jours saisis", de:"Erfasste Tage", it:"Giorni registrati", pt:"Dias registrados" },
  "Avg pain": { es:"Dolor medio", ca:"Dolor mitjà", fr:"Douleur moy.", de:"Ø Schmerz", it:"Dolore medio", pt:"Dor média" },
  "Avg energy": { es:"Energía media", ca:"Energia mitjana", fr:"Énergie moy.", de:"Ø Energie", it:"Energia media", pt:"Energia média" },
  "Flare days": { es:"Días con brote", ca:"Dies amb brot", fr:"Jours de poussée", de:"Schubtage", it:"Giorni di riacutizzazione", pt:"Dias de crise" },
  "Meals": { es:"Comidas", ca:"Menjars", fr:"Repas", de:"Mahlzeiten", it:"Pasti", pt:"Refeições" },
  "Total kcal": { es:"Kcal totales", ca:"Kcal totals", fr:"Kcal totales", de:"Kcal gesamt", it:"Kcal totali", pt:"Kcal totais" },
  "Symptom & lifestyle trends": { es:"Tendencias de síntomas y estilo de vida", ca:"Tendències de símptomes i estil de vida", fr:"Tendances symptômes & mode de vie", de:"Symptom- & Lebensstil-Trends", it:"Tendenze di sintomi e stile di vita", pt:"Tendências de sintomas e estilo de vida" },
  "Food journal — what you ate": { es:"Diario de comidas: lo que comiste", ca:"Diari de menjars: el que vas menjar", fr:"Journal alimentaire — ce que vous avez mangé", de:"Ernährungstagebuch — was du gegessen hast", it:"Diario alimentare — cosa hai mangiato", pt:"Diário alimentar — o que você comeu" },
  "No meals logged in this period.": { es:"No hay comidas registradas en este periodo.", ca:"No hi ha menjars registrats en aquest període.", fr:"Aucun repas enregistré sur cette période.", de:"Keine Mahlzeiten in diesem Zeitraum erfasst.", it:"Nessun pasto registrato in questo periodo.", pt:"Nenhuma refeição registrada neste período." },
  "Generated": { es:"Generado", ca:"Generat", fr:"Généré", de:"Erstellt", it:"Generato", pt:"Gerado" },
  "Energy": { es:"Energía", ca:"Energia", fr:"Énergie", de:"Energie", it:"Energia", pt:"Energia" },
  "Pain": { es:"Dolor", ca:"Dolor", fr:"Douleur", de:"Schmerz", it:"Dolore", pt:"Dor" },
  "{n} meal": { es:"{n} comida", ca:"{n} menjar", fr:"{n} repas", de:"{n} Mahlzeit", it:"{n} pasto", pt:"{n} refeição" },
  "{n} meals": { es:"{n} comidas", ca:"{n} menjars", fr:"{n} repas", de:"{n} Mahlzeiten", it:"{n} pasti", pt:"{n} refeições" },
  "Page 1 of 1": { es:"Página 1 de 1", ca:"Pàgina 1 d'1", fr:"Page 1 sur 1", de:"Seite 1 von 1", it:"Pagina 1 di 1", pt:"Página 1 de 1" },
  "This report summarises self-tracked data from Crohn Friends. It is not a medical document and is not a substitute for professional advice. Share it with your clinician as context only.": { es:"Este informe resume datos autorregistrados en Crohn Friends. No es un documento médico ni sustituye el consejo profesional. Compártelo con tu médico solo como contexto.", ca:"Aquest informe resumeix dades autoregistrades a Crohn Friends. No és un document mèdic ni substitueix el consell professional. Comparteix-lo amb el teu metge només com a context.", fr:"Ce rapport résume des données auto-suivies dans Crohn Friends. Ce n'est pas un document médical et il ne remplace pas un avis professionnel. Partagez-le avec votre clinicien à titre de contexte uniquement.", de:"Dieser Bericht fasst selbst erfasste Daten aus Crohn Friends zusammen. Er ist kein medizinisches Dokument und ersetzt keine professionelle Beratung. Teile ihn mit deinem Arzt nur als Kontext.", it:"Questo report riassume dati auto-registrati in Crohn Friends. Non è un documento medico e non sostituisce il parere professionale. Condividilo con il tuo medico solo come contesto.", pt:"Este relatório resume dados autorregistrados no Crohn Friends. Não é um documento médico e não substitui aconselhamento profissional. Compartilhe com seu médico apenas como contexto." },
});

/* translate option values / short labels: tOpt() first, then tr() */
function tx(s) {
  if (s == null) return s;
  try {
    const o = tOpt(s);
    if (o !== s) return o;
    return tr(s);
  } catch (e) { return s; }
}
Object.assign(window, { tx });
