const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('password')) {
    bcrypt.hash(this.password, 10,
      (err, hashedPassword) => {
        if (err)
          next(err)
        else {
          this.password = hashedPassword;
          next();
        }
      }
    )
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// "name": "Torben Ishii",
//   "email": "torben.ishii@gmail.com",
//   "password": "$2b$10$23jOLDyzl1jagLe9BrAWg.Pp782xfVkSHNubB7llJ15xzeuA7bfAW",
//   "_id": "617746a7622daaf08e44d032",
//   "created_at": "2021-10-26T00:07:03.987Z",
//   "updated_at": "2021-10-26T00:07:03.987Z",
//   "__v": 0