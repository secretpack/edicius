const config = require("../configuration/config");

const { PostgreSQL } = require("fxsql");
const { CONNECT } = PostgreSQL;

const POOL = CONNECT(config.db_config);

const { QUERY, VALUES, TABLE, EQ, SET } = POOL;

const TABLE_NAME = "user_info";

/*
 * createUserTable()
 * development comment
 ** 사실 매 실행마다 createUserTable()을 부르는식으로 접근하면
 ** PostgreSQL에서는 에러를 반환하더라도 실행에 문제가 없기 때문에 내버려두지만
 ** 만일 코드의 리팩토링을 하게 된다면 테이블이 존재하는지 확인한 뒤에
 ** 실행하도록 코드를 변경하는 것도 필요할 것
 */

module.exports.initialize = async () => {
  await deleteUserTable();
  await createUserTable();
};

async function createUserTable() {
  try {
    await QUERY`
      CREATE TABLE ${TABLE(TABLE_NAME)} (
        id SERIAL primary key,
        userid text NOT NULL,
        userpw text NOT NULL,
        email text NOT NULL,
        nickname text,
        entranceyear timestamptz not null default now(),
        gubun int NOT NULL default 0
      );
    `;
    console.log("[DB Info] createUserTable() Done");
  } catch (err) {
    console.log(err);
  }
}

async function deleteUserTable() {
  try {
    await QUERY`
      DROP TABLE ${TABLE(TABLE_NAME)}
    `;
    console.log("[DB Info] deleteUserTable() Done");
  } catch (err) {
    console.log(err);
  }
}

/*
 * insertOne()
 * development comment
 ** 패스워드 저장시에 해싱을 어떤 알고리즘으로 할지 정해야함
 */
async function insertOne(object) {
  try {
    await QUERY`
      INSERT INTO ${TABLE(TABLE_NAME)} ${VALUES(object)};
    `;
  } catch (err) {
    console.log(err);
  }
}

async function getRowCounts(object) {
  try {
    var _fetched = await QUERY`
    SELECT count(*) FROM ${TABLE(TABLE_NAME)} WHERE ${EQ(object)}`;
  } catch (err) {
    console.log(err);
  }
  return _fetched || [];
}

async function findOne(object) {
  console.log(object);
  try {
    var _fetched = await QUERY`
    SELECT * FROM ${TABLE(TABLE_NAME)} WHERE ${EQ(object)} LIMIT 1
    `;
    console.log(_fetched);
  } catch (err) {
    console.log(err);
  }
  return _fetched || [];
}

async function updateUserNickname(userid, object) {
  try {
    await QUERY`
    UPDATE ${TABLE(TABLE_NAME)} ${SET(object)} WHERE ${EQ({ userid: userid })}
    `;
  } catch (err) {
    return false;
  }
  return true;
}

//
async function deleteOne(object) {
  try {
    await QUERY`
    DELETE FROM ${TABLE(TABLE_NAME)} WHERE ${EQ(object)}
    `;
  } catch (err) {
    console.log(err);
  }
  return;
}

if (config.DEBUG_MODE) {
  module.exports.insertOne = insertOne;
  module.exports.findOne = findOne;
  module.exports.createUserTable = createUserTable;
  module.exports.deleteUserTable = deleteUserTable;
}

module.exports.changeNickname = async (userid, nickname) => {
  try {
    const _fetched = await findOne({ userid: userid });
    if (_fetched.length !== 1) {
      return false;
    }
    return await updateUserNickname(userid, { nickname: nickname });
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports.insertNewUser = async (object) => {
  try {
    const _fetched = await findOne(object);
    console.log(_fetched);
    if (_fetched.length >= 1) {
      return false;
    }
    await insertOne(object);
  } catch (err) {
    console.log(err);
  }
  return true;
};

module.exports.deleteUser = async (object) => {
  try {
    const _fetched = await findOne(object);
    if (_fetched.length < 1) {
      return false;
    }
    await deleteOne(object);
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};

module.exports.deleteById = async (id) => {
  try {
    const _fetched = await findOne({ id: id });
    if (_fetched.length < 1) {
      return false;
    }
    await deleteOne({ id: id });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};

module.exports.findUserRecords = async (object) => {
  try {
    var _fetched = await findOne(object);
  } catch (err) {
    console.log(err);
  }
  return _fetched || [];
};
