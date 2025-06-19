export default {
  PORT: 1337,
  mongoUrl:
    "mongodb+srv://sahsanjeev42:jdzvwLNfiIbxSmiA@uchat-cluster.zdx5bcp.mongodb.net/?retryWrites=true&w=majority&appName=uchat-cluster",
  corsOptions: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  saltFactor: 10,
};
