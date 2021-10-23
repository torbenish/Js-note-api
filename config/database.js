const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/javascriptNote", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection successful"))
  .catch((err) => console.log(err));
