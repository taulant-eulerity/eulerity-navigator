const Users = require("./users");
const Presentations = require("./presentations");
const UsersLeft = require('./usersLeft')
const Jokes = require("./jokes");
const ChoreUsers = require('./choreUsers')
const Chores = require('./chores')
const WeeklyChores = require('./weeklyChores')
const db = require("../db");

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  Users,
  Presentations,
  UsersLeft,
  Jokes,
  ChoreUsers,
  Chores,
  WeeklyChores,
  db
};