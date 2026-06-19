-- Create a table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    grade VARCHAR(5)
);

-- Insert some data
INSERT INTO students (name, age, grade) VALUES
('Alice', 20, 'A'),
('Bob', 22, 'B'),
('Carol', 21, 'A'),
('David', 23, 'C');

-- Print / SELECT all students
SELECT * FROM students;

-- Print with a custom message using RAISE NOTICE (inside a function/block)
DO $$
BEGIN
    RAISE NOTICE 'Total students: %', (SELECT COUNT(*) FROM students);
    RAISE NOTICE 'Highest grade students:';
END;
$$;

-- Print only A-grade students
SELECT name, age, grade
FROM students
WHERE grade = 'A';

SELECT name
FROM students
WHERE grade = 'B'