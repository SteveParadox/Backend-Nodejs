const app = require("./app");
const config = require("./config/config");
require("./models/categoryModel")
require("./database");


let server = app.listen(config.PORT, () => console.log(`Server listening to http://localhost:${config.PORT}`));

// exit handler func
function exitHandler() {
  if (server) {
    server.close(() => {
      console.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// unexpected handler func
function unexpectedErrorHandler(error) {
  console.error(error);
  exitHandler();
};
// node process runtime errors
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
  console.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
