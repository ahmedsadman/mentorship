echo "SELECT 'CREATE DATABASE \"mentorship-dev\"' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mentorship-dev')\gexec" | psql
echo "SELECT 'CREATE DATABASE \"mentorship-dev-test\"' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mentorship-dev-test')\gexec" | psql

echo "GRANT ALL PRIVILEGES ON DATABASE \"mentorship-dev\" TO postgres\gexec" | psql
echo "GRANT ALL PRIVILEGES ON DATABASE \"mentorship-dev-test\" TO postgres\gexec" | psql
