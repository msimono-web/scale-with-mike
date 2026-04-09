import type {
  Lead,
  Agent,
  RendezVous,
  Invoice,
  Article,
  Template,
  MessageHistory,
  LandingPage,
  DailyStats,
  SourceStats,
  AgentStats,
  MonthlyStats,
} from "./types";

// ─── Agents ───────────────────────────────────────────────────────────────────

export const agents: Agent[] = [
  {
    id: "agent-1",
    nom: "Mickael Durand",
    email: "mickael@scalewithmike.fr",
    telephone: "+33 6 12 34 56 78",
    role: "admin",
    status: "actif",
    couleur: "#2563EB",
  },
  {
    id: "agent-2",
    nom: "Sarah Leblanc",
    email: "sarah@scalewithmike.fr",
    telephone: "+33 6 23 45 67 89",
    role: "agent",
    status: "actif",
    couleur: "#7C3AED",
  },
  {
    id: "agent-3",
    nom: "Thomas Dupont",
    email: "thomas@scalewithmike.fr",
    telephone: "+33 6 34 56 78 90",
    role: "agent",
    status: "actif",
    couleur: "#059669",
  },
];

// ─── Leads ────────────────────────────────────────────────────────────────────

export const leads: Lead[] = [
  {
    id: "lead-1",
    prenom: "Jean-Pierre",
    nom: "Moreau",
    email: "jp.moreau@constructions-moreau.fr",
    telephone: "+33 6 11 22 33 44",
    entreprise: "Constructions Moreau",
    secteur: "BTP",
    source: "SEO",
    status: "rdv_pris",
    agentId: "agent-1",
    scoreIA: 9.2,
    caPotentiel: 14500,
    dateEntree: "2025-03-10",
    derniereAction: "2025-04-07",
    notes: "Très intéressé par l'offre complète. Budget confirmé.",
    historique: [
      { id: "h1", type: "note", label: "Lead entrant via blog SEO", date: "2025-03-10", agentId: "agent-1" },
      { id: "h2", type: "appel", label: "Premier contact — intéressé", date: "2025-03-12", agentId: "agent-1" },
      { id: "h3", type: "rdv", label: "RDV visio planifié pour le 10/04", date: "2025-04-07", agentId: "agent-1" },
    ],
  },
  {
    id: "lead-2",
    prenom: "Isabelle",
    nom: "Fontaine",
    email: "i.fontaine@immo-fontaine.com",
    telephone: "+33 6 22 33 44 55",
    entreprise: "Immobilier Fontaine",
    secteur: "Immobilier",
    source: "Instagram",
    status: "signe",
    agentId: "agent-2",
    scoreIA: 9.8,
    caPotentiel: 12000,
    dateEntree: "2025-02-15",
    derniereAction: "2025-03-28",
    notes: "Client signé — offre Premium 12k€/an.",
    historique: [
      { id: "h4", type: "note", label: "Lead Instagram Ads", date: "2025-02-15", agentId: "agent-2" },
      { id: "h5", type: "appel", label: "Appel de qualification", date: "2025-02-17", agentId: "agent-2" },
      { id: "h6", type: "rdv", label: "RDV closing", date: "2025-03-01", agentId: "agent-2" },
      { id: "h7", type: "statut", label: "Signé ✅ — 12 000€", date: "2025-03-28", agentId: "agent-2" },
    ],
  },
  {
    id: "lead-3",
    prenom: "Marc",
    nom: "Bertrand",
    email: "m.bertrand@brasserie-centrale.fr",
    telephone: "+33 6 33 44 55 66",
    entreprise: "Brasserie Centrale",
    secteur: "Restauration",
    source: "Facebook",
    status: "contacte",
    agentId: "agent-3",
    scoreIA: 6.4,
    caPotentiel: 3500,
    dateEntree: "2025-03-25",
    derniereAction: "2025-04-01",
    notes: "Budget limité mais motivé. Propose offre starter.",
    historique: [
      { id: "h8", type: "note", label: "Lead Facebook", date: "2025-03-25", agentId: "agent-3" },
      { id: "h9", type: "appel", label: "Premier appel effectué", date: "2025-04-01", agentId: "agent-3" },
    ],
  },
  {
    id: "lead-4",
    prenom: "Sophie",
    nom: "Laurent",
    email: "s.laurent@mode-sl.com",
    telephone: "+33 6 44 55 66 77",
    entreprise: "Mode SL",
    secteur: "E-commerce",
    source: "LinkedIn",
    status: "negociation",
    agentId: "agent-1",
    scoreIA: 8.7,
    caPotentiel: 8000,
    dateEntree: "2025-03-18",
    derniereAction: "2025-04-05",
    notes: "Négocie une réduction sur l'offre annuelle. Décision cette semaine.",
    historique: [
      { id: "h10", type: "note", label: "Lead LinkedIn organique", date: "2025-03-18", agentId: "agent-1" },
      { id: "h11", type: "email", label: "Envoi proposition commerciale", date: "2025-04-02", agentId: "agent-1" },
      { id: "h12", type: "appel", label: "Négociation en cours", date: "2025-04-05", agentId: "agent-1" },
    ],
  },
  {
    id: "lead-5",
    prenom: "Antoine",
    nom: "Girard",
    email: "a.girard@coach-girard.fr",
    telephone: "+33 6 55 66 77 88",
    entreprise: "Coaching Girard",
    secteur: "Coaching",
    source: "Referral",
    status: "rdv_fait",
    agentId: "agent-2",
    scoreIA: 7.9,
    caPotentiel: 4500,
    dateEntree: "2025-03-30",
    derniereAction: "2025-04-06",
    notes: "RDV fait hier. Proposition envoyée ce matin.",
    historique: [
      { id: "h13", type: "note", label: "Référé par Isabelle Fontaine", date: "2025-03-30", agentId: "agent-2" },
      { id: "h14", type: "rdv", label: "RDV visio effectué", date: "2025-04-06", agentId: "agent-2" },
    ],
  },
  {
    id: "lead-6",
    prenom: "Claire",
    nom: "Martin",
    email: "c.martin@clinique-martin.fr",
    telephone: "+33 6 66 77 88 99",
    entreprise: "Clinique Martin",
    secteur: "Santé",
    source: "Ads Google",
    status: "a_contacter",
    agentId: "agent-3",
    scoreIA: 7.2,
    caPotentiel: 6000,
    dateEntree: "2025-04-07",
    derniereAction: "2025-04-07",
    notes: "Nouveau lead Google Ads. À contacter aujourd'hui.",
    historique: [
      { id: "h15", type: "note", label: "Lead Google Ads campagne santé", date: "2025-04-07", agentId: "agent-3" },
    ],
  },
  {
    id: "lead-7",
    prenom: "Philippe",
    nom: "Rousseau",
    email: "p.rousseau@cabinet-rousseau.fr",
    telephone: "+33 6 77 88 99 00",
    entreprise: "Cabinet Rousseau",
    secteur: "Juridique",
    source: "SEO",
    status: "pas_de_reponse",
    agentId: "agent-1",
    scoreIA: 5.8,
    caPotentiel: 5000,
    dateEntree: "2025-03-20",
    derniereAction: "2025-03-25",
    notes: "2 appels sans réponse. Email envoyé.",
    historique: [
      { id: "h16", type: "appel", label: "Appel — pas de réponse", date: "2025-03-22", agentId: "agent-1" },
      { id: "h17", type: "appel", label: "2ème appel — messagerie", date: "2025-03-25", agentId: "agent-1" },
    ],
  },
  {
    id: "lead-8",
    prenom: "Nathalie",
    nom: "Petit",
    email: "n.petit@invest-petit.fr",
    telephone: "+33 6 88 99 00 11",
    entreprise: "Invest Petit",
    secteur: "Finance",
    source: "LinkedIn",
    status: "proposition_envoyee",
    agentId: "agent-2",
    scoreIA: 8.1,
    caPotentiel: 10000,
    dateEntree: "2025-03-15",
    derniereAction: "2025-04-03",
    notes: "Proposition envoyée. Attend validation direction.",
    historique: [
      { id: "h18", type: "appel", label: "Appel de qualification — très chaud", date: "2025-03-17", agentId: "agent-2" },
      { id: "h19", type: "rdv", label: "RDV effectué", date: "2025-03-28", agentId: "agent-2" },
      { id: "h20", type: "email", label: "Proposition 10k€ envoyée", date: "2025-04-03", agentId: "agent-2" },
    ],
  },
  {
    id: "lead-9",
    prenom: "David",
    nom: "Duval",
    email: "d.duval@btp-duval.fr",
    telephone: "+33 6 99 00 11 22",
    entreprise: "BTP Duval",
    secteur: "BTP",
    source: "Manuel",
    status: "nouveau",
    agentId: "agent-3",
    scoreIA: 6.9,
    caPotentiel: 9000,
    dateEntree: "2025-04-08",
    derniereAction: "2025-04-08",
    notes: "Lead ajouté manuellement suite salon BTP.",
    historique: [
      { id: "h21", type: "note", label: "Lead salon professionnel BTP", date: "2025-04-08", agentId: "agent-3" },
    ],
  },
  {
    id: "lead-10",
    prenom: "Emilie",
    nom: "Leroy",
    email: "e.leroy@agence-immo-leroy.fr",
    telephone: "+33 6 10 20 30 40",
    entreprise: "Agence Leroy",
    secteur: "Immobilier",
    source: "Facebook",
    status: "relance_envoyee",
    agentId: "agent-1",
    scoreIA: 6.1,
    caPotentiel: 7000,
    dateEntree: "2025-03-28",
    derniereAction: "2025-04-04",
    notes: "Relance envoyée J+7. Pas de retour.",
    historique: [
      { id: "h22", type: "appel", label: "Premier contact — intéressé", date: "2025-03-30", agentId: "agent-1" },
      { id: "h23", type: "whatsapp", label: "Relance WhatsApp envoyée", date: "2025-04-04", agentId: "agent-1" },
    ],
  },
  {
    id: "lead-11",
    prenom: "Lucas",
    nom: "Bernard",
    email: "l.bernard@shopbernard.com",
    telephone: "+33 6 20 30 40 50",
    entreprise: "ShopBernard",
    secteur: "E-commerce",
    source: "Instagram",
    status: "nouveau",
    agentId: "agent-2",
    scoreIA: 7.5,
    caPotentiel: 4000,
    dateEntree: "2025-04-08",
    derniereAction: "2025-04-08",
    notes: "Lead chaud depuis story Instagram. Répondu au DM.",
    historique: [
      { id: "h24", type: "note", label: "Lead via story Instagram", date: "2025-04-08", agentId: "agent-2" },
    ],
  },
  {
    id: "lead-12",
    prenom: "Marie",
    nom: "Simon",
    email: "m.simon@wellnesssimon.fr",
    telephone: "+33 6 30 40 50 60",
    entreprise: "Wellness Simon",
    secteur: "Santé",
    source: "SEO",
    status: "contacte",
    agentId: "agent-3",
    scoreIA: 7.0,
    caPotentiel: 5500,
    dateEntree: "2025-04-01",
    derniereAction: "2025-04-05",
    notes: "Contactée. Intéressée par le suivi mensuel.",
    historique: [
      { id: "h25", type: "appel", label: "Premier appel — bonne accroche", date: "2025-04-05", agentId: "agent-3" },
    ],
  },
  {
    id: "lead-13",
    prenom: "François",
    nom: "Blanc",
    email: "f.blanc@restaurant-blanc.fr",
    telephone: "+33 6 40 50 60 70",
    entreprise: "Restaurant Blanc",
    secteur: "Restauration",
    source: "Ads Google",
    status: "perdu",
    agentId: "agent-1",
    scoreIA: 3.5,
    caPotentiel: 2000,
    dateEntree: "2025-03-05",
    derniereAction: "2025-03-20",
    notes: "Choisi un concurrent. Prix trop élevé selon lui.",
    historique: [
      { id: "h26", type: "appel", label: "Appel de qualification", date: "2025-03-07", agentId: "agent-1" },
      { id: "h27", type: "statut", label: "Perdu — concurrent choisi", date: "2025-03-20", agentId: "agent-1" },
    ],
  },
  {
    id: "lead-14",
    prenom: "Hélène",
    nom: "Morin",
    email: "h.morins@cabinetmorins.fr",
    telephone: "+33 6 50 60 70 80",
    entreprise: "Cabinet Morins",
    secteur: "Juridique",
    source: "Referral",
    status: "a_contacter",
    agentId: "agent-2",
    scoreIA: 8.3,
    caPotentiel: 6500,
    dateEntree: "2025-04-07",
    derniereAction: "2025-04-07",
    notes: "Référée par Philippe Rousseau. Très qualifiée.",
    historique: [
      { id: "h28", type: "note", label: "Référée — qualité lead élevée", date: "2025-04-07", agentId: "agent-2" },
    ],
  },
  {
    id: "lead-15",
    prenom: "Pierre",
    nom: "Gaudin",
    email: "p.gaudin@coachgaudin.fr",
    telephone: "+33 6 60 70 80 90",
    entreprise: "Coach Gaudin",
    secteur: "Coaching",
    source: "LinkedIn",
    status: "nouveau",
    agentId: "agent-3",
    scoreIA: 6.8,
    caPotentiel: 3000,
    dateEntree: "2025-04-09",
    derniereAction: "2025-04-09",
    notes: "Nouveau lead LinkedIn ce matin.",
    historique: [
      { id: "h29", type: "note", label: "Lead LinkedIn — profil coach business", date: "2025-04-09", agentId: "agent-3" },
    ],
  },
];

// ─── Rendez-vous ──────────────────────────────────────────────────────────────

export const rendezVous: RendezVous[] = [
  {
    id: "rdv-1",
    leadId: "lead-1",
    agentId: "agent-1",
    date: "2025-04-10",
    heure: "14:00",
    duree: 60,
    status: "prevu",
    notes: "Démo produit complète",
    lienVisio: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "rdv-2",
    leadId: "lead-5",
    agentId: "agent-2",
    date: "2025-04-09",
    heure: "10:30",
    duree: 45,
    status: "fait",
    notes: "Proposition envoyée suite RDV",
  },
  {
    id: "rdv-3",
    leadId: "lead-2",
    agentId: "agent-2",
    date: "2025-04-08",
    heure: "15:00",
    duree: 60,
    status: "fait",
    notes: "Closing réussi — signé",
  },
  {
    id: "rdv-4",
    leadId: "lead-8",
    agentId: "agent-2",
    date: "2025-04-11",
    heure: "11:00",
    duree: 45,
    status: "prevu",
    notes: "Suivi proposition 10k€",
  },
  {
    id: "rdv-5",
    leadId: "lead-4",
    agentId: "agent-1",
    date: "2025-04-07",
    heure: "16:00",
    duree: 30,
    status: "no_show",
    notes: "Client absent. Relance planifiée.",
  },
];

// ─── Factures ─────────────────────────────────────────────────────────────────

export const invoices: Invoice[] = [
  {
    id: "inv-1",
    leadId: "lead-2",
    numero: "SWM-2025-001",
    montant: 12000,
    plan: "Offre Premium Annuelle",
    paymentType: "mensualites_3",
    status: "paye",
    dateEmission: "2025-03-28",
    dateEcheance: "2025-04-28",
  },
  {
    id: "inv-2",
    leadId: "lead-4",
    numero: "SWM-2025-002",
    montant: 8000,
    plan: "Pack Croissance",
    paymentType: "integral",
    status: "en_attente",
    dateEmission: "2025-04-05",
    dateEcheance: "2025-04-20",
  },
  {
    id: "inv-3",
    leadId: "lead-8",
    numero: "SWM-2025-003",
    montant: 10000,
    plan: "Offre Premium Annuelle",
    paymentType: "mensualites_3",
    status: "non_envoye",
    dateEmission: "2025-04-03",
    dateEcheance: "2025-04-18",
  },
  {
    id: "inv-4",
    leadId: "lead-3",
    numero: "SWM-2025-004",
    montant: 3500,
    plan: "Pack Starter",
    paymentType: "integral",
    status: "echoue",
    dateEmission: "2025-03-20",
    dateEcheance: "2025-04-05",
  },
  {
    id: "inv-5",
    leadId: "lead-5",
    numero: "SWM-2025-005",
    montant: 4500,
    plan: "Pack Croissance",
    paymentType: "integral",
    status: "en_attente",
    dateEmission: "2025-04-07",
    dateEcheance: "2025-04-22",
  },
];

// ─── Articles SEO ─────────────────────────────────────────────────────────────

export const articles: Article[] = [
  {
    id: "art-1",
    titre: "Comment générer 50 leads qualifiés par mois en B2B",
    cluster: "Génération de leads",
    status: "publie",
    scoreGlobal: 9.1,
    scores: { unicite: 9, specificite: 9.5, voix: 9, seo: 9.2, actionabilite: 8.8 },
    mots: 2340,
    date: "2025-03-01",
    metaDescription: "Découvrez les 7 techniques éprouvées pour générer 50 leads B2B qualifiés par mois sans exploser votre budget.",
    extrait: "La génération de leads en B2B est l'un des défis les plus complexes pour les entreprises...",
    contenu: "# Comment générer 50 leads qualifiés par mois en B2B\n\nLa génération de leads est cruciale...",
  },
  {
    id: "art-2",
    titre: "Les 5 erreurs fatales du closing en vente B2B",
    cluster: "Closing & Vente",
    status: "publie",
    scoreGlobal: 8.7,
    scores: { unicite: 8.5, specificite: 9, voix: 9, seo: 8.5, actionabilite: 8.5 },
    mots: 1890,
    date: "2025-03-08",
    metaDescription: "Évitez les 5 erreurs qui font rater vos closes en B2B. Guide pratique avec scripts de vente.",
    extrait: "Le closing est l'étape la plus redoutée des commerciaux. Pourtant, avec les bonnes techniques...",
    contenu: "# Les 5 erreurs fatales du closing\n\nAprès avoir analysé plus de 500 appels de vente...",
  },
  {
    id: "art-3",
    titre: "CRM vs Excel : pourquoi migrer en 2025",
    cluster: "Outils & Productivité",
    status: "review",
    scoreGlobal: 7.8,
    scores: { unicite: 8, specificite: 7.5, voix: 8, seo: 7.5, actionabilite: 8 },
    mots: 1560,
    date: "2025-03-20",
    metaDescription: "Excel ou CRM : quel outil choisir pour gérer vos leads ? Comparatif complet 2025.",
    extrait: "Beaucoup d'entreprises gèrent encore leurs leads sur Excel...",
    contenu: "# CRM vs Excel : le grand débat\n\nEn 2025, utiliser Excel pour gérer vos leads...",
  },
  {
    id: "art-4",
    titre: "Comment créer un call center performant en 30 jours",
    cluster: "Call Center",
    status: "review",
    scoreGlobal: 8.4,
    scores: { unicite: 8.5, specificite: 9, voix: 8, seo: 8, actionabilite: 8.5 },
    mots: 2100,
    date: "2025-03-28",
    metaDescription: "Guide complet pour créer un call center B2B performant en 30 jours avec les bons scripts.",
    extrait: "Un call center efficace peut multiplier votre taux de conversion par 3...",
    contenu: "# Créer un call center performant\n\nUn call center n'est pas juste un groupe de personnes...",
  },
  {
    id: "art-5",
    titre: "Script de prospection téléphonique : 3 templates qui convertissent",
    cluster: "Call Center",
    status: "publie",
    scoreGlobal: 9.3,
    scores: { unicite: 9.5, specificite: 9.5, voix: 9, seo: 9, actionabilite: 9.5 },
    mots: 1780,
    date: "2025-02-15",
    metaDescription: "3 scripts de prospection téléphonique testés et approuvés avec taux de conversion réels.",
    extrait: "Un bon script de prospection, c'est la différence entre 5% et 25% de taux de conversion...",
    contenu: "# 3 scripts qui convertissent\n\nVoici les scripts que nous utilisons chez ScaleWithMike...",
  },
  {
    id: "art-6",
    titre: "Lead scoring IA : comment qualifier vos leads automatiquement",
    cluster: "Intelligence Artificielle",
    status: "brouillon",
    scoreGlobal: 7.2,
    scores: { unicite: 7, specificite: 7.5, voix: 7, seo: 7, actionabilite: 7.5 },
    mots: 1200,
    date: "2025-04-05",
    metaDescription: "Comment l'IA peut qualifier vos leads automatiquement et booster votre taux de conversion.",
    extrait: "Le lead scoring par IA permet de prioriser automatiquement vos leads...",
    contenu: "# Lead scoring IA\n\nLe scoring manuel des leads prend du temps et est subjectif...",
  },
  {
    id: "art-7",
    titre: "Acquisition via LinkedIn : 10 techniques avancées en 2025",
    cluster: "Acquisition",
    status: "publie",
    scoreGlobal: 8.9,
    scores: { unicite: 9, specificite: 9, voix: 9, seo: 8.5, actionabilite: 9 },
    mots: 2450,
    date: "2025-02-28",
    metaDescription: "10 techniques LinkedIn avancées pour générer des leads B2B qualifiés en 2025.",
    extrait: "LinkedIn est devenu le réseau B2B par excellence pour la génération de leads...",
    contenu: "# 10 techniques LinkedIn avancées\n\nAvec 900 millions d'utilisateurs...",
  },
  {
    id: "art-8",
    titre: "Funnel de vente B2B : construire un entonnoir qui convertit",
    cluster: "Stratégie Commerciale",
    status: "brouillon",
    scoreGlobal: 6.8,
    scores: { unicite: 7, specificite: 7, voix: 7, seo: 6.5, actionabilite: 6.5 },
    mots: 980,
    date: "2025-04-08",
    metaDescription: "Comment construire un funnel de vente B2B optimisé qui convertit à chaque étape.",
    extrait: "Un funnel de vente bien construit est la colonne vertébrale de tout business B2B...",
    contenu: "# Construire un funnel B2B\n\nLe funnel de vente...",
  },
];

// ─── Templates Communication ──────────────────────────────────────────────────

export const templates: Template[] = [
  {
    id: "tpl-1",
    nom: "Premier contact WhatsApp",
    type: "whatsapp",
    contenu: "Bonjour {prénom} 👋\n\nJe suis {agent} de ScaleWithMike.\n\nJ'ai vu que vous avez téléchargé notre guide sur la génération de leads. Est-ce que vous avez 5 minutes pour qu'on en discute ?\n\nBien cordialement",
    variables: ["{prénom}", "{agent}"],
  },
  {
    id: "tpl-2",
    nom: "Relance J+2",
    type: "whatsapp",
    contenu: "Bonjour {prénom},\n\nJe fais suite à mon message de l'autre jour. Avez-vous eu l'occasion d'y jeter un œil ?\n\nJe serais ravi d'échanger 15 minutes avec vous sur vos objectifs en {secteur}.\n\nDisponible cette semaine ?",
    variables: ["{prénom}", "{secteur}"],
  },
  {
    id: "tpl-3",
    nom: "Email de qualification",
    type: "email",
    sujet: "Votre projet {secteur} — ScaleWithMike",
    contenu: "Bonjour {prénom},\n\nMerci de votre intérêt pour ScaleWithMike.\n\nNous aidons les entreprises du secteur {secteur} à générer plus de leads qualifiés et à optimiser leur taux de conversion.\n\nJe vous propose un appel découverte de 30 minutes pour comprendre vos enjeux actuels.\n\n👉 Réservez ici : {lien_rdv}\n\nCordialement,\n{agent}\nScaleWithMike",
    variables: ["{prénom}", "{secteur}", "{lien_rdv}", "{agent}"],
  },
  {
    id: "tpl-4",
    nom: "Confirmation RDV",
    type: "email",
    sujet: "Confirmation de votre RDV — ScaleWithMike",
    contenu: "Bonjour {prénom},\n\nJe confirme notre rendez-vous {lien_rdv}.\n\nJe vous enverrai le lien de connexion 1h avant.\n\nN'hésitez pas à me contacter si vous avez des questions.\n\nÀ bientôt,\n{agent}",
    variables: ["{prénom}", "{lien_rdv}", "{agent}"],
  },
  {
    id: "tpl-5",
    nom: "Relance no-show",
    type: "sms",
    contenu: "Bonjour {prénom}, nous avions RDV aujourd'hui. Pas de souci ! Pouvez-vous me proposer un autre créneau cette semaine ? — {agent}",
    variables: ["{prénom}", "{agent}"],
  },
];

// ─── Historique messages ──────────────────────────────────────────────────────

export const messageHistory: MessageHistory[] = [
  {
    id: "msg-1",
    leadId: "lead-1",
    agentId: "agent-1",
    type: "whatsapp",
    contenu: "Bonjour Jean-Pierre 👋 Je suis Mickael de ScaleWithMike...",
    date: "2025-03-12",
    status: "repondu",
  },
  {
    id: "msg-2",
    leadId: "lead-10",
    agentId: "agent-1",
    type: "whatsapp",
    contenu: "Bonjour Emilie, je fais suite à mon message...",
    date: "2025-04-04",
    status: "envoye",
  },
  {
    id: "msg-3",
    leadId: "lead-4",
    agentId: "agent-1",
    type: "email",
    contenu: "Bonjour Sophie, votre projet e-commerce...",
    date: "2025-04-02",
    status: "lu",
  },
];

// ─── Landing Pages ────────────────────────────────────────────────────────────

export const landingPages: LandingPage[] = [
  {
    id: "lp-1",
    nom: "Guide Génération Leads BTP",
    url: "scalewithmike.fr/guide-btp",
    vues: 3240,
    formulaires: 287,
    leadsQualifies: 42,
    tauxConversion: 14.6,
  },
  {
    id: "lp-2",
    nom: "Webinaire Closing B2B",
    url: "scalewithmike.fr/webinaire-closing",
    vues: 1890,
    formulaires: 312,
    leadsQualifies: 68,
    tauxConversion: 21.8,
  },
  {
    id: "lp-3",
    nom: "Audit Gratuit 30 min",
    url: "scalewithmike.fr/audit-gratuit",
    vues: 5640,
    formulaires: 534,
    leadsQualifies: 127,
    tauxConversion: 23.8,
  },
  {
    id: "lp-4",
    nom: "Pack Starter Immobilier",
    url: "scalewithmike.fr/pack-immo",
    vues: 1120,
    formulaires: 89,
    leadsQualifies: 18,
    tauxConversion: 20.2,
  },
];

// ─── Historique 30 jours ──────────────────────────────────────────────────────

function generateDailyStats(): DailyStats[] {
  const stats: DailyStats[] = [];
  const now = new Date("2025-04-09");
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const day = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
    const weekday = d.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    stats.push({
      date: day,
      leads: isWeekend ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 5) + 2,
      rdv: isWeekend ? 0 : Math.floor(Math.random() * 3),
      signes: Math.random() > 0.85 ? 1 : 0,
    });
  }
  return stats;
}

export const dailyStats: DailyStats[] = generateDailyStats();

// ─── Stats par source ─────────────────────────────────────────────────────────

export const sourceStats: SourceStats[] = [
  { source: "SEO", leads: 38, contactes: 32, rdv: 14, signes: 5, tauxAcceptation: 35.7 },
  { source: "Ads Google", leads: 27, contactes: 19, rdv: 8, signes: 2, tauxAcceptation: 25.0 },
  { source: "Instagram", leads: 22, contactes: 17, rdv: 9, signes: 3, tauxAcceptation: 33.3 },
  { source: "Facebook", leads: 18, contactes: 12, rdv: 4, signes: 1, tauxAcceptation: 25.0 },
  { source: "LinkedIn", leads: 15, contactes: 13, rdv: 7, signes: 3, tauxAcceptation: 42.9 },
  { source: "Referral", leads: 8, contactes: 8, rdv: 6, signes: 4, tauxAcceptation: 66.7 },
  { source: "Manuel", leads: 5, contactes: 4, rdv: 2, signes: 1, tauxAcceptation: 50.0 },
];

// ─── Stats par agent ──────────────────────────────────────────────────────────

export const agentStats: AgentStats[] = [
  { agentId: "agent-1", appels: 48, contacts: 38, rdv: 18, signes: 7, tauxConversion: 38.9, caGenere: 54000 },
  { agentId: "agent-2", appels: 42, contacts: 31, rdv: 15, signes: 8, tauxConversion: 53.3, caGenere: 61500 },
  { agentId: "agent-3", appels: 35, contacts: 24, rdv: 9, signes: 4, tauxConversion: 44.4, caGenere: 27000 },
];

// ─── Évolution mensuelle ──────────────────────────────────────────────────────

export const monthlyStats: MonthlyStats[] = [
  { mois: "Avr 2024", leads: 28, signes: 3, ca: 18000 },
  { mois: "Mai 2024", leads: 34, signes: 4, ca: 24500 },
  { mois: "Juin 2024", leads: 31, signes: 4, ca: 22000 },
  { mois: "Juil 2024", leads: 22, signes: 2, ca: 12000 },
  { mois: "Août 2024", leads: 18, signes: 2, ca: 9500 },
  { mois: "Sep 2024", leads: 38, signes: 5, ca: 31000 },
  { mois: "Oct 2024", leads: 45, signes: 6, ca: 38500 },
  { mois: "Nov 2024", leads: 52, signes: 7, ca: 47000 },
  { mois: "Déc 2024", leads: 48, signes: 6, ca: 42000 },
  { mois: "Jan 2025", leads: 58, signes: 8, ca: 56000 },
  { mois: "Fév 2025", leads: 63, signes: 9, ca: 67500 },
  { mois: "Mar 2025", leads: 71, signes: 11, ca: 82500 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}

export function getLead(id: string): Lead | undefined {
  return leads.find((l) => l.id === id);
}

export function getLeadsByStatus(status: string) {
  return leads.filter((l) => l.status === status);
}

export function getLeadsByAgent(agentId: string) {
  return leads.filter((l) => l.agentId === agentId);
}

export const CURRENT_AGENT_ID = "agent-1"; // Mickael = connecté

export function getKPIs() {
  const total = leads.length;
  const nouveaux = leads.filter((l) => ["nouveau", "a_contacter"].includes(l.status)).length;
  const enPipeline = leads.filter((l) => !["signe", "perdu"].includes(l.status)).length;
  const contactes = leads.filter((l) => !["nouveau", "signe", "perdu"].includes(l.status)).length;
  const rdvPlanifies = leads.filter((l) => ["rdv_pris"].includes(l.status)).length;
  const signes = leads.filter((l) => l.status === "signe").length;
  const perdus = leads.filter((l) => l.status === "perdu").length;
  const caTotal = invoices.filter((i) => i.status === "paye").reduce((s, i) => s + i.montant, 0);
  const caObjectif = 150000;
  const scoreIA = leads.reduce((s, l) => s + l.scoreIA, 0) / leads.length;

  const tauxContact = Math.round((contactes / total) * 100);
  const tauxRDV = contactes > 0 ? Math.round((rdvPlanifies / contactes) * 100) : 0;
  const rdvFaits = rendezVous.filter((r) => r.status === "fait").length;
  const tauxClose = rdvFaits > 0 ? Math.round((signes / rdvFaits) * 100) : 0;

  // Nouveaux leads aujourd'hui
  const today = "2025-04-09";
  const leadsAujourdhui = leads.filter((l) => l.dateEntree === today).length;

  // CA cette semaine
  const caWeek = 14500; // jean-pierre potentiel signé ce soir

  return {
    total,
    nouveaux,
    enPipeline,
    contactes,
    rdvPlanifies,
    signes,
    perdus,
    caTotal,
    caObjectif,
    scoreIA: Math.round(scoreIA * 10) / 10,
    tauxContact,
    tauxRDV,
    tauxClose,
    leadsAujourdhui,
    caWeek,
  };
}

export function getCallbacksEnAttente() {
  return leads.filter((l) =>
    ["pas_de_reponse", "relance_envoyee"].includes(l.status)
  );
}

export function getPriorityLeads() {
  return [...leads]
    .filter((l) => !["signe", "perdu"].includes(l.status))
    .sort((a, b) => b.scoreIA - a.scoreIA)
    .slice(0, 5);
}

export function getScoreJournalier() {
  // Score calculé sur 5 dimensions
  const kpis = getKPIs();
  const leadsScore = Math.min(100, (kpis.leadsAujourdhui / 5) * 100);
  const pipelineScore = Math.min(100, (kpis.enPipeline / 10) * 100);
  const callbacksScore = Math.max(0, 100 - getCallbacksEnAttente().length * 15);
  const bounceScore = Math.max(0, 100 - (kpis.perdus / kpis.total) * 100);
  const revenueScore = Math.min(100, (kpis.caTotal / kpis.caObjectif) * 100);

  const global = Math.round(
    leadsScore * 0.2 +
    pipelineScore * 0.2 +
    callbacksScore * 0.2 +
    bounceScore * 0.2 +
    revenueScore * 0.2
  );

  return {
    global,
    details: [
      { label: "Leads", score: Math.round(leadsScore), color: "#2563EB" },
      { label: "Pipeline", score: Math.round(pipelineScore), color: "#7C3AED" },
      { label: "Callbacks", score: Math.round(callbacksScore), color: "#F59E0B" },
      { label: "Bounce", score: Math.round(bounceScore), color: "#EF4444" },
      { label: "Revenue", score: Math.round(revenueScore), color: "#10B981" },
    ],
  };
}
