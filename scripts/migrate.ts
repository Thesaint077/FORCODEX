import {migrate} from '../lib/migrate';
migrate().then(()=>{console.log('Migrations applied');process.exit(0);}).catch(()=>{console.error('Migration failed');process.exit(1);});
