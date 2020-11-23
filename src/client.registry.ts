import { createServer } from 'http';
import { parse } from 'url';
import { Consumer } from '@dubbo.ts/consumer';
import { app } from './application';
import { interfaceExports } from './code';
import { int } from 'js-to-java';
import { createRegistry } from './registry';
createRegistry();
const consumer = new Consumer(app);
consumer.launch();

consumer.on('connect', () => console.log(' - server connected'));
consumer.on('disconnect', () => console.log(' - server disconnected'));
consumer.on('error', (e) => console.error(e));
consumer.on('channels', result => console.log(' - get channels:', result.map((res: any) => res.host)));

createServer((req, res) => {
  const url = parse(req.url, true);
  if (!url.query.a || !url.query.b || isNaN(Number(url.query.a)) || isNaN(Number(url.query.b))) {
    res.statusCode = 400;
    return res.end('missing a or b, or none is a number');
  }
  const keys = Object.keys(interfaceExports);
  const name = keys[0];
  const methods = Object.keys(interfaceExports[name as keyof typeof interfaceExports]);
  const method = methods[0];

  consumer.invoke(name).then(client => {
    return client.execute(name, method, [
      int(Number(url.query.a)), 
      int(Number(url.query.b))
    ]);
  }).then((c: number) => {
    res.statusCode = 200;
    res.end('a + b = ' + c);
  }).catch(e => {
    res.statusCode = 500;
    res.end(e.message);
  });
}).listen(8000, () => console.log(' + Client start HTTP server at port', 8000));