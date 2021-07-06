CREATE TABLE credit_cards (
  id uuid NOT NULL,
  name VARCHAR NOT NULL,
  number VARCHAR NOT NULL,
  expiration_month VARCHAR NOT NULL,
  expiration_year VARCHAR,
  CVV VARCHAR NOT NULL,
  balance float NOT NULL,
  balance_limit float NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE transactions (
  id uuid NOT NULL,
  credit_card_id uuid NOT NULL REFERENCES credit_cards(id),
  amount float NOT NULL,
  STATUS VARCHAR NOT NULL,
  description VARCHAR,
  store VARCHAR NOT NULL,
  created_at timestamp NOT NULL,
  PRIMARY KEY (id)
);