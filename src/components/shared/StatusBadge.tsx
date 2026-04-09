import type { LeadStatus } from "@/lib/types";

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> = {
  nouveau: { label: "Nouveau", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  a_contacter: { label: "À contacter", color: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  contacte: { label: "Contacté", color: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
  pas_de_reponse: { label: "Pas de réponse", color: "bg-gray-500/15 text-gray-400 border-gray-500/30" },
  relance_envoyee: { label: "Relance envoyée", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  rdv_pris: { label: "RDV pris", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  rdv_fait: { label: "RDV fait", color: "bg-teal-500/15 text-teal-400 border-teal-500/30" },
  proposition_envoyee: { label: "Proposition", color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
  negociation: { label: "Négociation", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  signe: { label: "Signé ✅", color: "bg-green-500/15 text-green-400 border-green-500/30" },
  perdu: { label: "Perdu ❌", color: "bg-red-500/15 text-red-400 border-red-500/30" },
};

export function getStatusConfig(status: LeadStatus) {
  return STATUS_CONFIG[status];
}

export default function StatusBadge({ status }: { status: LeadStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
}
