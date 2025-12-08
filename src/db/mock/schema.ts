export const taskStatusType = `CREATE TYPE task_status AS ENUM (
    'pending', 'in_progress', 'completed'
);`;

export const tasksTable = `CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE CHECK (TRIM(title) <> ''),
    description TEXT,
    status task_status NOT NULL,
    due_datetime TIMESTAMPTZ NOT NULL
);`;
