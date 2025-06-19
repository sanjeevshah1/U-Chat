export default {
  PORT: 1337,
  mongoUrl: "mongodb://localhost:27017/u-chat",
  corsOptions: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  saltFactor: 10,
};
