import express from "express";
import mongoose from "mongoose";
import { changeUser, deleteUser, getUser, newCups, newUser, removeMistakes, Response, restoreCups, User } from "./methods";

const uri = "mongodb+srv://dima_loves_bomb:8903Dmit@dimalovesbomb.mfzkb.mongodb.net/coffee?retryWrites=true&w=majority";

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('error', console.log.bind(console, 'Database connection error'));
mongoose.connection.once('open', () => {
  console.log('Connected to database');
});
mongoose.set('useFindAndModify', false); // Anti-deprecation warning

const app = express();
const PORT = 8080;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());

app.get('/api/getUser?:phoneNumber', async (req, res) => {
    const phoneNumber = req.query.phoneNumber.toString();

    const recievedUser = new User(phoneNumber, '');
    const response: Response = await getUser(recievedUser);

    return res.status(response.statusCode).send(response);
});

app.put('/api/changeUser', async (req, res) => {
    const receivedUser = new User(req.body.phoneNumber, '', req.body.oldPhoneNumber);
    const response: Response = await changeUser(receivedUser);

    return res.status(response.statusCode).send(response);
});

app.put('/api/newCups', async (req, res) => {
    const receivedUser = new User(req.body.phoneNumber, '', '', +req.body.cupsQuantity);
    const response: Response = await newCups(receivedUser);

    return res.status(response.statusCode).send(response);
});

app.put('/api/restoreCups', async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const response: Response = await restoreCups(phoneNumber);

  return res.status(response.statusCode).send(response);
});

app.put('/api/removeMistakes', async (req, res) => {
  const {phoneNumber, cupsQuantity} = req.body;
  const response = await removeMistakes(cupsQuantity, phoneNumber);

  return res.status(response.statusCode).send(response);
});

app.post('/api/newUser', async (req, res) => {
    const receivedUser = new User(req.body.phoneNumber, req.body.name, '', +req.body.cupsQuantity);
    const response: Response = await newUser(receivedUser);

    return res.status(response.statusCode).send(response);
});

app.delete('/api/deleteUser', async (req, res) => {
  const { phoneNumber } = req.body;
  const response = await deleteUser(phoneNumber);

  return res.status(response.statusCode).send(response);
});

app.listen(PORT, () => {
  console.log(`⚡️ server is running on port ${PORT}`);
});
