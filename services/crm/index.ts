/**
 * CRM integration (HubSpot, Pipedrive). Repository uses `CrmType`; sync jobs will call into this module later.
 */

export type { CrmType } from "../../types/crm";

export interface CrmNotePayload {
  contactExternalId: string;
  body: string;
}
