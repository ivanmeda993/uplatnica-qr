import { app } from '@/server/api';

const handler = app.fetch;

export { handler as DELETE, handler as GET, handler as PATCH, handler as POST, handler as PUT };
