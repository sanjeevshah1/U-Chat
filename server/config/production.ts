export default {
  PORT: 1337,
  mongoUrl:
    "mongodb+srv://sahsanjeev42:jdzvwLNfiIbxSmiA@uchat-cluster.zdx5bcp.mongodb.net/?retryWrites=true&w=majority&appName=uchat-cluster",
  corsOptions: {
    origin: "https://u-chat-project.vercel.app/",
    credentials: true,
  },
  saltFactor: 10,
};
