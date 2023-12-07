const EVENT_CONNECTION = 'connection';
const EVENT_CALL = 'call';
const EVENT_OFFER = 'offer';
const EVENT_ANSWER = 'answer';
const EVENT_CANDIDATE = 'candidate';
const EVENT_DISCONNECT_USER = 'disconnect-user';
const EVENT_DISCONNECT = 'disconnect';

class SocketService {
  constructor(server) {
    this.init(server);
  }

  init(server) {
    this.io = require('socket.io')(server, {
      cors: {
        origin: '*',
      },
    });

    this.io.on(EVENT_CONNECTION, (socket) => {
      const room = socket.handshake.query.room;
      if (!room) {
        socket.disconnect();
      } else {
        console.log(`new user enter in room ${room}`);
        socket.join(room);
        console.log('requesting offers');
        socket.to(room).emit(EVENT_CALL, { id: socket.id });

        socket.on(EVENT_OFFER, (data) => {
          console.log(`${socket.id} offering ${data.id}`);
          socket.to(data.id).emit(EVENT_OFFER, {
            id: socket.id,
            offer: data.offer
          });
        });

        socket.on(EVENT_ANSWER, (data) => {
          console.log(`${socket.id} answering ${data.id}`);
          socket.to(data.id).emit(EVENT_ANSWER, {
            id: socket.id,
            answer: data.answer
          });
        });

        socket.on(EVENT_CANDIDATE, (data) => {
          console.log(`${socket.id} sending a candidate to ${data.id}`);
          socket.to(data.id).emit(EVENT_CANDIDATE, {
            id: socket.id,
            candidate: data.candidate
          });
        });

        socket.on(EVENT_DISCONNECT, () => {
          console.log(`${socket.id} disconnected`);
          this.io.emit(EVENT_DISCONNECT_USER, {
            id: socket.id
          });
        });
      }
    });
  }
}

module.exports = SocketService;
