import { Provider, TProviderReply } from '@dubbo.ts/provider';
import { app } from './application';
import { interfaceExports } from './code';
import { createRegistry } from './registry';
createRegistry();

const provider = new Provider(app);

provider.on('connect', () => console.log(' - client connected'));
provider.on('disconnect', () => console.log(' - client disconnect'));
provider.on('listening', () => console.log(' - Tcp connection is listening'));
provider.on('error', (e) => console.error(e));
provider.on('close', () => console.log('\n - Tcp closed'));

provider.on('data', (reply: TProviderReply) => {
  reply(async (schema, status) => {
    const isTwoWay = schema.isTwoWay;
    const name = schema.interface;
    const method = schema.method;
    const parameters = schema.parameters;
    if (!isTwoWay) return;
    const interfaceChunk = interfaceExports[name as keyof typeof interfaceExports];
    if (interfaceChunk) {
      const functional = interfaceChunk[method as keyof typeof interfaceChunk];
      if (typeof functional === 'function' && functional.length === parameters.length) {
        return {
          status: status.OK,
          // @ts-ignore
          data: functional(...parameters),
        }
      } else {
        throw new Error('找不到方法名或者方法参数个数不正确：' + name + '(' + functional.length +  ' vs ' + parameters.length + ')');
      }
    } else {
      throw new Error('找不到interface：' + name);
    }
  })
});

provider.listen().then(tcp => {
  console.log(' - Tcp server on', 'port:', app.port, 'status:', tcp.listening);
});