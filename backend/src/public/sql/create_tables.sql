DROP TABLE IF EXISTS team_card;

DROP TABLE IF EXISTS team_formation;

DROP TABLE IF EXISTS team_record;

DROP TABLE IF EXISTS team_goal_minute;

DROP TABLE IF EXISTS team_goal;

DROP TABLE IF EXISTS team_fixture;

DROP TABLE IF EXISTS team_venue;

DROP TABLE IF EXISTS venue;

DROP TABLE IF EXISTS team;

DROP TABLE IF EXISTS season;

DROP TABLE IF EXISTS league;

DROP TABLE IF EXISTS country;

DROP TABLE IF EXISTS year_num;

CREATE TABLE
  IF NOT EXISTS year_num (
    year_num INT PRIMARY KEY,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE (year_num)
  );

CREATE TABLE
  IF NOT EXISTS country (
    id serial,
    code TEXT,
    name TEXT,
    flag TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE (id),
    UNIQUE (code, name)
  );

CREATE TABLE
  IF NOT EXISTS league (
    id serial,
    api_id INT,
    country_id INT,
    name TEXT,
    type TEXT,
    logo TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (country_id) REFERENCES country (id),
    UNIQUE (api_id)
  );

CREATE TABLE
  IF NOT EXISTS season (
    year_num INT PRIMARY KEY,
    league_id INT,
    start_date DATE,
    end_date DATE,
    current BOOLEAN,
    coverage JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (league_id) REFERENCES league (id),
    FOREIGN KEY (year_num) REFERENCES year_num (year_num),
    UNIQUE (year_num, league_id)
  );

CREATE TABLE
  IF NOT EXISTS team (
    id serial,
    api_id INT,
    name VARCHAR(255),
    code VARCHAR(10),
    country VARCHAR(255),
    founded INT,
    national BOOLEAN,
    logo TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE (api_id)
  );

CREATE TABLE
  IF NOT EXISTS venue (
    id serial,
    api_id INT,
    name VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    capacity INT,
    surface VARCHAR(255),
    image TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE (api_id)
  );

CREATE TABLE
  IF NOT EXISTS team_venue (
    id serial PRIMARY KEY,
    team_id INT,
    venue_id INT,
    year_num INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES team (id),
    FOREIGN KEY (venue_id) REFERENCES venue (id),
    UNIQUE (team_id, venue_id, year_num)
  );

CREATE TABLE
  IF NOT EXISTS team_fixture (
    id serial PRIMARY KEY,
    team_id INT,
    year_num INT,
    home_away VARCHAR(255),
    played INT,
    wins INT,
    draws INT,
    loses INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES team (id),
    UNIQUE (team_id, year_num, home_away)
  );

CREATE TABLE
  IF NOT EXISTS team_record (
    id serial PRIMARY KEY,
    team_id INT,
    year_num INT,
    form VARCHAR(255),
    streak_wins INT,
    streak_draws INT,
    streak_loses INT,
    wins_home VARCHAR(255),
    wins_away VARCHAR(255),
    loses_home VARCHAR(255),
    loses_away VARCHAR(255),
    biggest_for_home INT,
    biggest_for_away INT,
    biggest_against_home INT,
    biggest_against_away INT,
    clean_sheet_home INT,
    clean_sheet_away INT,
    clean_sheet_total INT,
    failed_to_score_home INT,
    failed_to_score_away INT,
    failed_to_score_total INT,
    penalty_total INT,
    penalty_scored_total INT,
    penalty_scored_percentage DECIMAL(5, 2),
    penalty_missed_total INT,
    penalty_missed_percentage DECIMAL(5, 2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES team (id),
    UNIQUE (team_id, year_num)
  );

CREATE TABLE
  IF NOT EXISTS team_goal (
    id serial PRIMARY KEY,
    team_id INT,
    year_num INT,
    for_against VARCHAR(255),
    home_away VARCHAR(255),
    total INT,
    average DECIMAL(5, 2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES team (id),
    UNIQUE (team_id, year_num, for_against, home_away)
  );

CREATE TABLE
  IF NOT EXISTS team_goal_minute (
    id serial PRIMARY KEY,
    team_id INT,
    year_num INT,
    for_against VARCHAR(255),
    minute VARCHAR(255),
    total INT,
    percentage DECIMAL(5, 2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES team (id),
    UNIQUE (team_id, year_num, for_against, minute)
  );

CREATE TABLE
  IF NOT EXISTS team_formation (
    id serial PRIMARY KEY,
    team_id INT,
    year_num INT,
    formation VARCHAR(255),
    played INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES team (id),
    UNIQUE (team_id, year_num, formation)
  );

CREATE TABLE
  IF NOT EXISTS team_card (
    id serial PRIMARY KEY,
    team_id INT,
    year_num INT,
    minute VARCHAR(255),
    yellow_total INT,
    yellow_percentage DECIMAL(5, 2),
    red_total INT,
    red_percentage DECIMAL(5, 2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES team (id),
    UNIQUE (team_id, year_num, minute)
  );