export type Role='brand'|'creator'|'operations';
export type User={id:string;email:string;name:string;role:Role;email_verified:boolean};
export type Org={id:string;name:string;role:string;verification:string};
export type Profile={user_id:string;name:string;category:string;service:string;city:string;languages:string;bio:string;rate_kobo:number;availability:string;portfolio:string;verification:string;is_public:boolean};
export type Brief={id:string;org_id:string;created_by:string;title:string;category:string;service:string;budget_kobo:number;status:string;data:Record<string,string>;created_at:string;org_name?:string};
export type Proposal={id:string;brief_id:string;creator_id:string;name?:string;amount_kobo:number;data:Record<string,string|number>;status:string;expires_at:string;created_at:string};
export type Booking={id:string;brief_id:string;proposal_id:string;org_id:string;creator_id:string;title:string;amount_kobo:number;fee_kobo:number;fee_version:string;contract:Record<string,unknown>;contract_hash:string;brand_signed_at:string|null;creator_signed_at:string|null;funding:string;delivery:string;compliance:string;payout:string;revision_count:number;approved_submission:string|null;disputed:boolean;created_at:string};
