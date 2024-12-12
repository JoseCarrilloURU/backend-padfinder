import genreRouter from './api/genre.js';
import courtRouter from './api/court.js';
import personCourtRouter from './api/person_court.js';
import userRouter from './api/user.js';
import personRouter from './api/person.js';
import messageRouter from './api/message.js';
import fileRouter from './api/file.js';
import chatRouter from './api/chat.js';
import matchRouter from './api/match.js';

export const routers = [
  genreRouter(),
  courtRouter(),
  personCourtRouter(),
  userRouter(),
  personRouter(),
  messageRouter(),
  fileRouter(),
  chatRouter(),
  matchRouter(),
];
