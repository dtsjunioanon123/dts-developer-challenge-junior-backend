CREATE USER hmtm WITH PASSWORD 'securepassword';

DROP DATABASE IF EXISTS task_manager_db_dev;
CREATE DATABASE task_manager_db_dev OWNER hmtm;;

DROP DATABASE IF EXISTS task_manager_db_dev_test;
CREATE DATABASE task_manager_db_dev_test OWNER hmtm;;