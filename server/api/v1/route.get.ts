import https from 'node:https';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const user = query.user as string;
  const dest = query.dest as string;

  if (!user || !dest) {
    throw createError({ statusCode: 400, statusMessage: 'Missing coordinates' });
  }

  // Use node:https natively to force ipv4 (family: 4) to avoid OSRM timeout bug
  return new Promise((resolve, reject) => {
    https.get({
      host: 'router.project-osrm.org',
      path: `/route/v1/driving/${user};${dest}?geometries=geojson&overview=full`,
      family: 4,
      headers: {
        'User-Agent': 'Hemocione-App/1.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => reject(err));
  });
});
