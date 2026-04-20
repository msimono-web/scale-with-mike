// ─── Lead ─────────────────────────────────────────────────────────────────────

export type LeadStatus =
  | "nouveau"
  | "a_contacter"
  | "contacte"
  | "pas_de_reponse"
  | "relance_envoyee"
  | "rdv_pris"
  | "rdv_fait"
  | "proposition_envoyee"
  | "negociation"
  | "signe"
  | "perdu";

export type LeadSource =
  | "SEO"
  | "Ads Google"
  | "Instagram"
  | "Facebook"
  | "LinkedIn"
  | "Referral"
  | "Manuel";

export type LeadSector =
  | "BTP"
  | "Immobilier"
  | "Restauration"
  | "E-commerce"
  | "Coaching"
  | "Santé"
  | "Juridique"
  | "Finance";

export interface LeadAction {
  id: string;
  type: "appel" | "email" | "whatsapp" | "rdv" | "note" | "statut";
  label: string;
  date: string;
  agentId: string;
}

export type ReminderType = "appel" | "email" | "relance" | "rdv" | "autre";

export interface LeadReminder {
  id: string;
  type: ReminderType;
  label: string;
  date: string; // ISO date "2026-04-15"
  heure: string; // "14:30"
  done: boolean;
  agentId: string;
}

export interface Lead {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  entreprise: string;
  secteur: LeadSector;
  source: LeadSource;
  status: LeadStatus;
  agentId: string;
  scoreIA: number; // 0-10
  caPotentiel: number; // EUR
  dateEntree: string; // ISO
  derniereAction: string; // ISO
  notes: string;
  historique: LeadAction[];
  rappels?: LeadReminder[];
}

// ─── Agent ────────────────────────────────────────────────────────────────────

export type AgentRole = "admin" | "agent";
export type AgentStatus = "actif" | "inactif";

export interface Agent {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: AgentRole;
  status: AgentStatus;
  avatar?: string;
  couleur: string; // hex pour badge
}

// ─── Rendez-vous ──────────────────────────────────────────────────────────────

export type RdvStatus = "prevu" | "fait" | "no_show" | "annule";

export interface RendezVous {
  id: string;
  leadId: string;
  agentId: string;
  date: string; // ISO
  heure: string; // "14:30"
  duree: number; // minutes
  status: RdvStatus;
  notes: string;
  lienVisio?: string;
}

// ─── Facture ──────────────────────────────────────────────────────────────────

export type InvoiceStatus = "paye" | "en_attente" | "echoue" | "non_envoye";
export type PaymentType = "integral" | "mensualites_3" | "abonnement";

export interface Invoice {
  id: string;
  leadId: string;
  numero: string;
  montant: number;
  plan: string;
  paymentType: PaymentType;
  status: InvoiceStatus;
  dateEmission: string;
  dateEcheance: string;
  contrat?: string;
}

// ─── Article SEO ──────────────────────────────────────────────────────────────

export type ArticleStatus = "brouillon" | "review" | "publie" | "desactive";

export interface Article {
  id: string;
  titre: string;
  cluster: string;
  status: ArticleStatus;
  scoreGlobal: number; // 0-10
  scores: {
    unicite: number;
    specificite: number;
    voix: number;
    seo: number;
    actionabilite: number;
  };
  mots: number;
  date: string;
  metaDescription: string;
  extrait: string;
  contenu: string;
}

// ─── Template Communication ───────────────────────────────────────────────────

export type TemplateType = "whatsapp" | "email" | "sms";

export interface Template {
  id: string;
  nom: string;
  type: TemplateType;
  sujet?: string; // email only
  contenu: string;
  variables: string[];
}

export interface MessageHistory {
  id: string;
  leadId: string;
  agentId: string;
  type: TemplateType;
  contenu: string;
  date: string;
  status: "envoye" | "lu" | "repondu";
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export interface LandingPage {
  id: string;
  nom: string;
  url: string;
  vues: number;
  formulaires: number;
  leadsQualifies: number;
  tauxConversion: number;
}

// ─── Espace Client (White Label) ──────────────────────────────────────────────

export interface ClientSpace {
  id: string
  slug: string            // URL: /client/[slug]
  companyName: string     // Nom de l'entreprise
  activity: string        // Secteur / activité
  description: string     // Description (min 150 chars)
  primaryColor: string    // Couleur principale hex (#3b82f6)
  secondaryColor: string  // Couleur secondaire hex (#10b981)
  logoUrl: string         // Base64 ou URL du logo
  heroTitle: string       // Titre héro LP
  heroSubtitle: string    // Sous-titre héro LP
  ctaText: string         // Texte du bouton CTA
  calendlyUrl: string     // Lien Calendly
  createdAt: string       // ISO date
  // Accès privé
  passwordHash?: string   // SHA-256 du mot de passe client
  allowedEmails?: string  // Emails autorisés Google (séparés par virgule)
  // Domaine custom
  customDomain?: string   // Ex: crm.techcorp.fr
  vercelDomainId?: string // ID retourné par l'API Vercel
}

// ─── Charts helpers ───────────────────────────────────────────────────────────

export interface DailyStats {
  date: string; // "01/03"
  leads: number;
  rdv: number;
  signes: number;
}

export interface SourceStats {
  source: LeadSource;
  leads: number;
  contactes: number;
  rdv: number;
  signes: number;
  tauxAcceptation: number;
}

export interface AgentStats {
  agentId: string;
  appels: number;
  contacts: number;
  rdv: number;
  signes: number;
  tauxConversion: number;
  caGenere: number;
}

export interface MonthlyStats {
  mois: string;
  leads: number;
  signes: number;
  ca: number;
}
