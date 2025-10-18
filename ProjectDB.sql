CREATE DATABASE IF NOT EXISTS world_data;
USE world_data;

DROP TABLE IF EXISTS countries;
CREATE TABLE countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  capital VARCHAR(100),
  region VARCHAR(50),
  population BIGINT,
  area DOUBLE,
  language VARCHAR(50),
  currency VARCHAR(50),
  gdp BIGINT,
  description TEXT,
  flag_url VARCHAR(255)
);

INSERT INTO countries (name, capital, region, population, area, language, currency, gdp, description, flag_url) VALUES
('Japan', 'Tokyo', 'Asia', 125000000, 377975, 'Japanese', 'Yen', 5065000000000,
 'Japan is an island nation in East Asia known for its culture, advanced technology, and cuisine.',
 'https://flagcdn.com/jp.svg'),
('France', 'Paris', 'Europe', 67000000, 551695, 'French', 'Euro', 2930000000000,
 'France is known for its art, fashion, gastronomy, and landmarks like the Eiffel Tower and the Louvre.',
 'https://flagcdn.com/fr.svg'),
('Brazil', 'Brasília', 'South America', 214000000, 8515767, 'Portuguese', 'Real', 1847000000000,
 'Brazil is the largest country in South America, famous for the Amazon rainforest, football, and Carnival.',
 'https://flagcdn.com/br.svg'),
('Canada', 'Ottawa', 'North America', 38250000, 9984670, 'English/French', 'Canadian Dollar', 2260000000000,
 'Canada is known for its vast natural landscapes, multicultural cities, and friendly people.',
 'https://flagcdn.com/ca.svg'),
('Australia', 'Canberra', 'Oceania', 25900000, 7692024, 'English', 'Australian Dollar', 1618000000000,
 'Australia is famous for its beaches, unique wildlife, and the Sydney Opera House.',
 'https://flagcdn.com/au.svg'),
('Ireland', 'Dublin', 'Europe', 5200000, 70273, 'Irish/English', 'Euro', 500000000000,
 'Ireland is known for its green landscapes, Celtic heritage, and friendly culture.',
 'https://flagcdn.com/ie.svg'),
('India', 'New Delhi', 'Asia', 1400000000, 3287263, 'Hindi/English', 'Rupee', 3370000000000,
 'India is a diverse country with rich culture, traditions, and rapid economic growth.',
 'https://flagcdn.com/in.svg'),
('United States', 'Washington D.C.', 'North America', 333000000, 9833517, 'English', 'US Dollar', 25400000000000,
 'The United States is a global leader in innovation, economy, and culture.',
 'https://flagcdn.com/us.svg'),
('Germany', 'Berlin', 'Europe', 83200000, 357588, 'German', 'Euro', 4220000000000,
 'Germany is an industrial powerhouse known for engineering, efficiency, and cultural heritage.',
 'https://flagcdn.com/de.svg'),
('Egypt', 'Cairo', 'Africa', 111000000, 1002450, 'Arabic', 'Egyptian Pound', 470000000000,
 'Egypt is home to one of the world’s oldest civilizations and landmarks like the Pyramids of Giza.',
 'https://flagcdn.com/eg.svg');


SELECT * FROM countries;