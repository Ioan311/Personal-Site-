DROP TYPE IF EXISTS big_category;
DROP TYPE IF EXISTS color1;

CREATE TYPE big_category AS ENUM( 'alloy wheels', 'steel wheels');
CREATE TYPE color1 AS ENUM('black', 'white', 'custom');


CREATE TABLE IF NOT EXISTS wheels (
   id serial PRIMARY KEY,
   name VARCHAR(50) UNIQUE NOT NULL,
   description TEXT,
   image VARCHAR(300), 
   material big_category DEFAULT 'alloy wheels', 
   continent VARCHAR(50) NOT NULL,
   price NUMERIC(8,5) NOT NULL,
   load INT NOT NULL,
   date TIMESTAMP DEFAULT current_timestamp,
   color color1 DEFAULT 'black',
   size VARCHAR [],
   apply_voucher BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT into wheels (name, description, image, material, continent, price, load, color, size, apply_voucher) VALUES 
('Axxion AX7 Black Polished Wider Rear', '20 Inch Set of 4 alloy wheels', product-443941_80088_900.jpg, 'alloy wheels', 'Europe', 1000.00, 1200, 'black', '{"Width:10.5", "Diameter:20", "Weight:13.12"}', False),

('Bola XTR Matt Black Wider Rear', '20 Inch Set of 4 alloy wheels', product-386349_18078_900.jpg, 'alloy wheels', 'Europe', 1100.00, 1200, 'black', '{"Width:11.5", "Diameter:20", "Weight:12.12"}', False),

('Bola B11 Matt Black Wider Rear', '20 Inch Set of 4 alloy wheels', product-294193_54442_900.jpg, 'alloy wheels', 'Europe', 2100.90, 1200, 'black', '{"Width:13.5", "Diameter:20", "Weight:13.52"}', False),

('Bola B11 Gloss Black Wider Rear', '20 Inch Set of 4 alloy wheels', product-449803_54484_900.jpg, 'alloy wheels', 'Europe', 3100.20, 1200, 'black', '{"Width:10.5", "Diameter:20", "Weight:13.12"}', False),

('Bola FLE Gloss Gunmetal Wider Rear', '20 Inch Set of 4 alloy wheels', product-286548_118120_900.jpg, 'alloy wheels', 'Europe', 2200.80, 1200, 'black', '{"Width:11.7", "Diameter:20", "Weight:10.12"}', False),

('Japan Racing JR34 () (Custom Fitment) Gloss Black Wider Rear', '20 Inch Set of 4 alloy wheels', product-412593_109719_900.jpg, 'alloy wheels', 'Europe', 2000.00, 1200, 'black', '{"Width:10.5", "Diameter:20", "Weight:11.12"}', False),

('VEEMANN VC520 Gloss Black Wider Rear', '20 Inch Set of 4 alloy wheels', product-76774_10860_600.jpg, 'alloy wheels', 'Europe', 3800.00, 1200, 'black', '{"Width:11.5", "Diameter:20", "Weight:12.12"}', False),

('2FORGE ZF2  Matt Black Wider Rear', '20 Inch Set of 4 alloy wheels', product-570716_28982_900.jpg, 'alloy wheels', 'Europe', 1700.99, 1200, 'black', '{"Width:10.5", "Diameter:20", "Weight:13.12"}', False),

('Vossen CV3R  Custom Colour Wider Rear', '20 Inch Set of 4 alloy wheels', product-890698_41838_900.jpg, 'alloy wheels', 'Europe', 3600.50, 1200, 'black', '{"Width:15.5", "Diameter:22", "Weight:14.12"}', False),

('Vossen CV10  Custom Colour Wider Rear', '20 Inch Set of 4 alloy wheels', product-238854_66564_900.jpg, 'alloy wheels', 'Europe', 5000.00, 1200, 'black', '{"Width:11.5", "Diameter:21", "Weight:11.12"}', False),

('HRE FlowForm FF11 Silver Wider Rear', '20 Inch Set of 4 alloy wheels', product-436928_70966_900.jpg, 'alloy wheels', 'Europe', 6200.00, 1200, 'black', '{"Width:11.5", "Diameter:20", "Weight:11.12"}', False),

('OZ Racing Superforgiata Black Wider Rear', '20 Inch Set of 4 alloy wheels', product-261091_7761_900.jpg, 'alloy wheels', 'Europe', 4800.90, 1200, 'black', '{"Width:11.0", "Diameter:22", "Weight:10.12"}', False),

('Vossen Forged CG-203 Custom Colour Wider Rear', '20 Inch Set of 4 alloy wheels', product-376040_34015_900.jpg, 'alloy wheels', 'Europe', 2800.99, 1200, 'black', '{"Width:11.5", "Diameter:20", "Weight:11.12"}', False),

('Vossen Forged ERA-1 (3 Piece) Custom Colour Wider Rear', '20 Inch Set of 4 alloy wheels', product-446392_46428_900.jpg, 'alloy wheels', 'Europe', 8100.90, 1200, 'black', '{"Width:14.5", "Diameter:22", "Weight:13.12"}', False),

('Vossen Forged S17-07 (3 Piece) Custom Colour Wider Rear', '20 Inch Set of 4 alloy wheels', product-557260_45732_900.jpg, 'alloy wheels', 'Europe', 4130.00, 1200, 'black', '{"Width:10.5", "Diameter:22", "Weight:10.12"}', False),

('GMP Italia Stellar Black Polished', '20 Inch Set of 4 alloy wheels', product-340553_29072_900.jpg, 'alloy wheels', 'Europe', 1210.00, 1200, 'black', '{"Width:11.5", "Diameter:20", "Weight:11.12"}', False),

('RC Design RC34 Gloss Black', '20 Inch Set of 4 alloy wheels', product-851164_82001_900.jpg, 'alloy wheels', 'Europe', 5100.00, 1200, 'black', '{"Width:12.5", "Diameter:20", "Weight:13.12"}', False),

('Romac Pulse Gloss Black', '20 Inch Set of 4 alloy wheels', product-109940_82331_900.jpg, 'alloy wheels', 'Europe', 2000.00, 1200, 'black', '{"Width:11.5", "Diameter:20", "Weight:13.12"}', False),

('Romac Venom Black Polished', '20 Inch Set of 4 alloy wheels', product-408784_61230_900.jpg, 'alloy wheels', 'Europe', 4000.00, 1200, 'black', '{"Width:13.5", "Diameter:20", "Weight:13.12"}', False),

('OZ Racing Ultraleggera Matt Black', '20 Inch Set of 4 alloy wheels', product-430188_2782_900.jpg, 'alloy wheels', 'Europe', 3200.00, 1200, 'black', '{"Width:10.5", "Diameter:20", "Weight:13.12"}', False),

('GMP Italia Rebel Gloss Black', '20 Inch Set of 4 alloy wheels', product-17991_90625_900.jpg, 'alloy wheels', 'Europe', 9130.90, 1200, 'black', '{"Width:11.5", "Diameter:22", "Weight:11.12"}', False),
