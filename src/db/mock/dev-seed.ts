import "../../config/env";
import * as data from "./data/dev";
import seed from "./seed";
import db from "../dbConnection";

const seedDev = () => seed(data).then(() => db.end());
module.exports = seedDev();
