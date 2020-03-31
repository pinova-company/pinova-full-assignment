const jsonServer = require("json-server");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
server.use(jsonServer.bodyParser);

const users = [
  {
    id: 0,
    username: "user1",
    password: "secret",
    showEmailPhoneScreen: true,
    showTermsAndCondition: false,
    showWelcomeScreen: true
  },
  {
    id: 1,
    username: "user2",
    password: "secret",
    showEmailPhoneScreen: false,
    email: "john.doe@comeon.com",
    phone: "46-700111000",
    acceptMarketing: false,
    showTermsAndCondition: true,
    showWelcomeScreen: false
  },
  {
    id: 2,
    username: "user3",
    password: "secret",
    showEmailPhoneScreen: false,
    email: "john.doe@comeon.com",
    phone: "46-700111000",
    showTermsAndCondition: false,
    acceptMarketing: true,
    acceptTerms: true,
    showWelcomeScreen: false
  },
  {
    id: 3,
    username: "user4",
    password: "secret",
    showEmailPhoneScreen: false,
    email: "john.doe@comeon.com",
    phone: "46-700111000",
    showTermsAndCondition: false,
    acceptMarketing: true,
    acceptTerms: true,
    showWelcomeScreen: true
  }
];

const authenticate = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = users.find(user => user.username === username);
  if (user && user.password === password) {
    const response = { ...user };
    delete response.password;
    res.status(200).json({
      status: "SUCCESS",
      response
    });
  } else if (!user) {
    const newUser = {
      id: users.length,
      username,
      password,
      showEmailPhoneScreen: true,
      showTermsAndCondition: false,
      showWelcomeScreen: false
    };
    users.push(newUser);
    const response = { ...newUser };
    delete response.password;
    res.status(200).json({
      status: "SUCCESS",
      response
    });
  } else {
    res.status(401).json({
      status: "FAILURE",
      response: {
        errorKey: "INVALID_CREDENTIALS",
        errorDescription: "Invalid username and password"
      }
    });
  }
};

const updateUser = (req, res) => {
  const id = req.body.id;
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex > -1) {
    const newUser = { ...users[userIndex], ...req.body };
    users[userIndex] = newUser;
    const response = { ...newUser };
    delete response.password;
    res.status(200).json({
      status: "SUCCESS",
      response
    });
  } else {
    res.status(200).json({
      status: "FAILURE",
      response: {
        errorKey: "USER_NOT_FOUND",
        errorDescription: "User not found"
      }
    });
  }
};

server.use((req, res, next) => {
  if (req.method === "POST") {
    if (req.path === "/authenticate") {
      return authenticate(req, res);
    } else if (req.path === "/logout") {
      var username = req.body.username;
      if (username in users) {
        res.status(200).json({
          status: "SUCCESS"
        });
      } else {
        res.status(400).json({
          status: "FAILURE",
          error: "Username do not match!"
        });
      }
    }
  }
  if (req.method === "PUT") {
    if (req.path === "/user") {
      return updateUser(req, res);
    }
  }
  // Continue to JSON Server router
  next();
});

server.listen(3000, () => {
  console.log("JSON Server is running");
});
