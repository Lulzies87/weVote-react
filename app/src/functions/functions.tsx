import { Poll } from "@/types/poll";
import { Tenant } from "@/types/tenant";

export function getPollStatus(poll: Poll, tenant: Tenant | null) {
  if (!tenant || !poll.votes)
    return { status: "Unknown", color: "bg-gray-100" };

  if (!poll.isActive) {
    return { status: "Cancelled", color: "bg-red-100" };
  }

  const pollDeadline = new Date(poll.deadline).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);

  if (pollDeadline < today) {
    return { status: "Closed", color: "bg-gray-100" };
  }

  if (poll.votes.some((vote) => vote.apartment === tenant.apartment)) {
    return { status: "Voted", color: "bg-green-100" };
  }

  return { status: "Open", color: "bg-yellow-100" };
}

export function getTenantVote(poll: Poll, tenantApartment: number) {
  return poll.votes?.find((vote) => vote.apartment === tenantApartment)?.vote;
}
