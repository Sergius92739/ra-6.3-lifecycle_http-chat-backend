const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const Router = require('koa-router');

const app = new Koa();

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(cors({
  origin: '*'
}));

const messages = [
  {
    "id": 1,
    "userId": "mcvUTYNegm6N0h0im17-H",
    "content": "Какая сейчас погода за окном?"
  }
];
let nextId = 3;

const router = new Router();

router.get('/messages', async (ctx, next) => {
  const from = Number(ctx.request.query.from)
  if (ctx.request.query.from === 0) {
    ctx.response.body = messages;
    return;
  }

  const fromIndex = messages.findIndex(o => o.id === from);
  if (fromIndex === -1) {
    ctx.response.body = messages;
    return;
  }

  ctx.response.body = messages.slice(fromIndex + 1);
});

router.post('/messages', async (ctx, next) => {
  messages.push({ ...ctx.request.body, id: nextId++ });
  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log(`The server started on port ${port}`));
console.log(`http://localhost:${port}`)