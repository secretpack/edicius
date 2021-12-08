const config = require("../configuration/config");

const { PostgreSQL } = require("fxsql");
const utils = require("../utils/utils");
const { CONNECT } = PostgreSQL;

const POOL = CONNECT(config.db_config);

const { QUERY, VALUES, TABLE, EQ } = POOL;

const TABLE_NAME = "room_list";

module.exports.initializer = async () => {
  await deleteRoomTable();
  await createRoomTable();
};

async function createRoomTable() {
  try {
    await QUERY`
      CREATE TABLE ${TABLE(TABLE_NAME)} (
        room_id SERIAL primary key,
        room_title text,
        room_description text,
        create_time timestamptz not null default now(),
        joined_users text[]
      );
    `;
    console.log("[DB Info] createRoomTable() Done");
  } catch (err) {
    if (err.code === "42P07") {
      console.log("Room Database Already Exists");
    } else {
      console.log(err);
    }
  }
}

async function deleteRoomTable() {
  try {
    await QUERY`
      DROP TABLE ${TABLE(TABLE_NAME)}
    `;
    console.log("[DB Info] deleteRoomTable() Done");
  } catch (err) {
    console.log(err);
  }
}

async function insertOne(object) {
  try {
    await QUERY`
        INSERT INTO ${TABLE(TABLE_NAME)} ${VALUES(object)};
      `;
  } catch (err) {
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
    console.log(err);
    return false;
  }
  return true;
}

async function findRoomByInfo_internal(informations) {
  try {
    var fetched = await QUERY`
    SELECT * FROM ${TABLE(TABLE_NAME)} WHERE ${EQ(informations)} LIMIT 1`;
  } catch (err) {
    console.log(err);
    return undefined;
  }
  return fetched || [];
}

async function findRoomsByPage_internal(page) {
  try {
    const page_index = (page - 1) * 5;
    var fetched = await QUERY`
    SELECT * FROM ${TABLE(TABLE_NAME)} LIMIT 5 OFFSET ${page_index}`;
  } catch (err) {
    console.log(err);
    return undefined;
  }
  return fetched || [];
}

async function checkRoombyId(room_id) {
  try {
    var fetched = await QUERY`
    SELECT count(*) FROM ${TABLE(TABLE_NAME)} WHERE room_id=${room_id}`;
  } catch (err) {
    console.log(err);
    return false;
  }
  if (fetched !== undefined && fetched !== null) {
    if (parseInt(fetched[0].count) === 0) return false;
    return true;
  } else {
    return false;
  }
}

async function updateRoomInfo(room_id, new_user) {
  try {
    await QUERY`
    UPDATE room_list SET joined_users = array_append(joined_users, ${new_user}) WHERE room_id=${room_id}`;
    console.log("ok");
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

async function removeUserFromRoom_internal(room_id, userid) {
  try {
    await QUERY`
    UPDATE room_list SET joined_users = array_remove(joined_users, ${userid}) WHERE room_id=${room_id}`;
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

module.exports.isUserJoined = async ({ room_id, userid }) => {
  try {
    var fetched = await QUERY`
    SELECT * FROM ${TABLE(TABLE_NAME)} WHERE room_id=${room_id}`;
  } catch (err) {
    console.log(err);
    return undefined;
  }
  if (fetched.length <= 0) {
    return undefined;
  }
  const user_list = fetched[0].joined_users;

  if (user_list !== null && user_list.indexOf(userid) !== -1) {
    return true;
  } else {
    return false;
  }
};

module.exports.createNewRoom = async (newroom_info) => {
  try {
    return await insertOne(newroom_info);
  } catch (err) {
    console.log(err);
  }
  return false;
};

module.exports.deleteRoomById = async (room_id) => {
  try {
    if (await checkRoombyId(room_id)) {
      return await deleteOne({ room_id: room_id });
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports.appendUserToRoom = async ({ room_id, userid }) => {
  try {
    // console.log("room_id : " + room_id);
    if (await checkRoombyId(room_id)) {
      await updateRoomInfo(room_id, userid);
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  return false;
};

module.exports.removeUserFromRoom = async (room_id, userid) => {
  try {
    if (await checkRoombyId(room_id)) {
      await removeUserFromRoom_internal(room_id, userid);
      return true;
    }
  } catch (err) {
    console.log(err);
  }
  return false;
};

module.exports.getChatRoomsByPage = async (page) => {
  try {
    const room_list = await findRoomsByPage_internal(page);
    if (room_list === undefined) {
      return undefined;
    }
    return room_list;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

module.exports.modifyRoomInfo = async ({ room_id, changedObject }) => {};

module.exports.findRoomByInfo = async (elements) => {
  try {
    const fetched = await findRoomByInfo_internal(elements);
    if (fetched === undefined) {
      console.log("something exceptions in internal function");
      return false;
    }
    return fetched;
  } catch (err) {
    console.log(err);
  }
  return false;
};
