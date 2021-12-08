const config = require("../configuration/config");

const { PostgreSQL } = require("fxsql");
const utils = require("../utils/utils");
const { CONNECT } = PostgreSQL;

const POOL = CONNECT(config.db_config);

const { QUERY, VALUES, TABLE, EQ } = POOL;

const TABLE_NAME = "chat_logs";

/*
 * createUserTable()
 * development comment
 ** 사실 매 실행마다 createUserTable()을 부르는식으로 접근하면
 ** PostgreSQL에서는 에러를 반환하더라도 실행에 문제가 없기 때문에 내버려두지만
 ** 만일 코드의 리팩토링을 하게 된다면 테이블이 존재하는지 확인한 뒤에
 ** 실행하도록 코드를 변경하는 것도 필요할 것
 */

module.exports.initialize = async () => {
  await deleteChatTable();
  await createChatTable();
};

async function createChatTable() {
  try {
    await QUERY`
      CREATE TABLE ${TABLE(TABLE_NAME)} (
        room_id int NOT NULL,
        receive_time timestamp default now(),
        contents text,
        index SERIAL primary key,
        userid text NOT NULL,
        
        is_positive boolean default false,
        is_negative boolean default false,
        is_checked boolean default false
      );
    `;
    console.log("[DB Info] createChatTable() Done");
  } catch (err) {}
}

async function deleteChatTable() {
  try {
    await QUERY`
      DROP TABLE ${TABLE(TABLE_NAME)}
    `;
    console.log("[DB Info] deleteChatTable() Done");
  } catch (err) {}
}

module.exports.receiveMessage = async (object, rowCount = 10) => {
  if (!utils.hasKeys(object, ["room_id"])) {
    return undefined;
  }
  const { room_id } = object;
  try {
    var _fetched = await QUERY`
    SELECT * FROM ${TABLE(
      TABLE_NAME
    )} WHERE room_id=${room_id} LIMIT ${rowCount}`;
  } catch (err) {
    console.log(err);
    return undefined;
  }
  return _fetched || [];
};

module.exports.sendMessage = async (object) => {
  if (!utils.hasKeys(object, ["room_id", "userid"])) {
    return false;
  }
  try {
    await QUERY`
        INSERT INTO ${TABLE(TABLE_NAME)} ${VALUES(object)}`;
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};
