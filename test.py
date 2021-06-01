import psycopg2 as db
conn = db.connect("postgresql://doadmin:Root1234@34.72.193.228:25060/cobas?sslmode=require")
print(conn.get_backend_pid())
conn.close()