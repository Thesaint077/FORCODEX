import {DB} from './db';
export type DirectoryEntry={id:string;name:string;username:string|null;role:string;city:string|null;service:string|null};
export async function searchPublicDirectory(d:DB,query='',kind=''){
 const search=query.trim().replace(/^@/,'').slice(0,120);
 const role=['creator','brand'].includes(kind)?kind:'';
 const pattern='%'+search.replace(/[\\%_]/g,'\\$&')+'%';
 return (await d.query<DirectoryEntry>(`SELECT u.id,u.name,u.username,u.role,p.city,p.service FROM users u LEFT JOIN profiles p ON p.user_id=u.id WHERE ((u.role='creator' AND p.is_public=true) OR (u.role='brand' AND u.directory_visible=true AND u.username IS NOT NULL)) AND ($1='' OR u.role=$1) AND (u.name ILIKE $2 ESCAPE '\\' OR u.username ILIKE $2 ESCAPE '\\') ORDER BY u.name LIMIT 100`,[role,pattern])).rows;
}
