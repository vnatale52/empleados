-- Crea la tabla de empleados
CREATE TABLE empleados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    edad INTEGER,
    salario REAL
);

-- Insertar algunos datos de ejemplo
INSERT INTO empleados (nombre, edad, salario) VALUES ('Juan', 30, 3000.50);
INSERT INTO empleados (nombre, edad, salario) VALUES ('Ana', 25, 2500.75);
INSERT INTO empleados (nombre, edad, salario) VALUES ('Carlos', 40, 3500.00);
