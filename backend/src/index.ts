import express from "express";
import { changeUser, deleteUser, getUser, newCups, newUser, removeMistakes, Response, restoreCups, User } from "./methods";

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

app.get('/api/getUser?:phoneNumber', (req, res) => {
    const phoneNumber = req.query.phoneNumber.toString();

    const recievedUser = new User(phoneNumber, '');
    const response: Response = getUser(recievedUser);

    return res.status(response.statusCode).send(response);
});

app.put('/api/changeUser', (req, res) => {
    const recievedUser = new User(req.body.phoneNumber, '', req.body.oldPhoneNumber);
    const response: Response = changeUser(recievedUser);

    return res.status(response.statusCode).send(response);
});

app.put('/api/newCups', (req, res) => {
    const recievedUser = new User(req.body.phoneNumber, '', '', +req.body.cupsQuantity);
    const response: Response = newCups(recievedUser);

    return res.status(response.statusCode).send(response);
});

app.put('/api/restoreCups', (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const response: Response = restoreCups(phoneNumber);

  return res.status(response.statusCode).send(response);
});

app.put('/api/removeMistakes', (req, res) => {
  const {phoneNumber, cupsQuantity} = req.body;
  const response = removeMistakes(cupsQuantity, phoneNumber);

  return res.status(response.statusCode).send(response);
});

app.post('/api/newUser', (req, res) => {
    const recievedUser = new User(req.body.phoneNumber, req.body.name, '', +req.body.cupsQuantity);
    const response: Response = newUser(recievedUser);

    return res.status(response.statusCode).send(response);
});

app.delete('/api/deleteUser', (req, res) => {
  const { phoneNumber } = req.body;
  const response = deleteUser(phoneNumber);

  return res.status(response.statusCode).send(response);
});

app.listen(PORT, () => {
  console.log(`⚡️ server is running on port ${PORT}`);
});
