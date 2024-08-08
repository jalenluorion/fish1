import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on('joinroom', (game) => {
        socket.join(game.game);
        game.id = socket.id;
        io.to(game.game).emit('joinroom', game);
        console.log(game.id + ' joined room: ' + game.game);
    });

    socket.on('cardtap', (card) => {
        io.to(card.game).emit('cardtap', card);
        console.log(card.id + ' tapped card: ' + card.card);
    });

    socket.on('receiveDeck', (deck) => {
        io.to(deck.game).emit('receiveDeck', deck);
        console.log(deck.id + ' received deck');
    });

    socket.on('updateDeck', (deck) => {
        io.to(deck.game).emit('updateDeck', deck);
        console.log(deck.id + ' updated deck');
    });

    socket.on('declare', (game) => {
        io.to(game.game).emit('declare', game);
        console.log(game.id + ' declared');
    });

    socket.on('startgame', (game) => {
        io.to(game.game).emit('startgame', game);
        console.log(game.game + ' started game');
    });

    socket.on('disconnecting', () => {
        var room = Array.from(socket.rooms)[1];
        io.to(room).emit('leaveroom', socket.id);
        console.log(socket.id + ' left room: ' + room);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});