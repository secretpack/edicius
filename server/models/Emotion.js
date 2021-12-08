const config = require("../configuration/config");

const { PostgreSQL } = require("fxsql");
const utils = require("../utils/utils");
const { CONNECT } = PostgreSQL;

const POOL = CONNECT(config.db_config);

const { QUERY, VALUES, TABLE, EQ, SET, ROLLBACK } = POOL;

const TABLE_NAME = "user_emotion_table";

module.exports.initializer = async () => {
  await createEmotionTable();
};

async function createEmotionTable() {
  try {
    await QUERY`
      CREATE TABLE ${TABLE(TABLE_NAME)} (
        emotion_id int NOT NULL primary key,
        create_time timestamptz not null default now(),
        userid text not null,
        current_emotion int not null
      );
    `;
    console.log("[DB Info] createEmotionTable() Done");
  } catch (err) {
    if (err.code === "42P07") {
      console.log(`${TABLE_NAME} is already exists`);
    } else {
      console.log("createEmotionTable() error");
    }
    return false;
  }
  return true;
}

async function deleteEmotionTable() {
  try {
    await QUERY`
      DROP TABLE ${TABLE(TABLE_NAME)}
    `;
    console.log("[DB Info] deleteEmotionTable() Done");
  } catch (err) {}
}

async function insertOne(object) {
  const { emotion_id, ...remains } = object;
  try {
    await QUERY`
        INSERT INTO ${TABLE(TABLE_NAME)} ${VALUES(remains)};
      `;
  } catch (err) {
    console.log("insertOne error");
    console.log(err);
    return false;
  }
  return true;
}

async function deleteOne(object) {
  try {
    await QUERY`
      DELETE FROM ${TABLE(TABLE_NAME)} WHERE ${EQ(object)}
      `;
  } catch (err) {
    console.log("deleteOne error");
    console.log(err);
    return false;
  }
  return true;
}

async function getRows(object, rows = 10) {
  try {
    var fetched = await QUERY`
    SELECT * FROM ${TABLE(TABLE_NAME)} WHERE ${EQ(object)} LIMIT ${rows}`;
  } catch (err) {
    console.log("getRows() error");
    console.log(err);
    return undefined;
  }
  return fetched || [];
}

async function checkEmotionbyId(userid) {
  try {
    var fetched = await QUERY`
          SELECT count(*) FROM ${TABLE(TABLE_NAME)} WHERE userid=${userid}`;
  } catch (err) {}
  if (fetched !== undefined && fetched != null) {
    if (fetched.length === 0) return false;
    return true;
  } else {
    return false;
  }
}

module.exports.getUserEmotion = async (userid, rows = 10) => {
  const obj = {
    userid: userid,
  };
  const fetched = await getRows(obj, 10);
  if (fetched === undefined) {
    console.log("Something errors in getRows()");
    return [];
  }
  return fetched;
};

module.exports.saveUserEmotion = async (userid, current_emotion) => {
  const obj = {
    userid: userid,
    current_emotion: current_emotion,
  };
  const status = await insertOne(obj);
  if (stauts === false) return false;
  return true;
};

module.exports.createStatistics = async (userid, option = 0) => {
  switch (option) {
    case 0:
      // All statistics
      break;
    case 1:
      // Default emotion statistics
      break;
    case 2:
      // Happy emotion statistics
      break;
    case 3:
      // Sad emotion statistics
      break;
    case 4:
      // Angry emotion statistics
      break;
    default:
      break;
  }
};

module.exports.saveToFile = async (userid, file_type = "csv") => {};
