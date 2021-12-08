const DEBUG_MODE = true;

// Database initialize configuration
const database_config = {
  host: "groupcounseling-db.cun0dhxklfbi.us-east-1.rds.amazonaws.com",
  user: "gc_manager",
  password: "groupcounseling2021!",
  database: "postgres",
};

const server_info = {
  host: "localhost:5000",
};

module.exports = {
  DEBUG_MODE: DEBUG_MODE,
  db_config: database_config,
  server_info: `http://${server_info.host}`,
  PARAM_MODE: "get",
  secret: "this_is_admin_secret_key",
};
