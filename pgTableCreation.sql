create table if not exists userprofile (
id serial primary key,
auth0_id varchar(255) unique,
email varchar(255) unique not null,
password_hash text,
username varchar(50) unique,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp
);

-- Notepad: 1 for each user
create table if not exists notepad (
  id serial primary key,
  user_id integer not null unique REFERENCES userprofile(id) on delete cascade,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

-- Notepad pages (50 pages max by default)
drop table if exists notepad_page cascade;
create table notepad_page(
  id serial primary key,
  notepad_id integer not null REFERENCES notepad(id) on delete cascade,
  page_number integer not null check (page_number >= 1 and page_number <= 50),
  title varchar(100) default 'Untitled',
  content text default '',
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  unique (notepad_id, page_number)
);

-- create index for faster page lookup
create index if not exists idx_notepad_page_notepad_id on notepad_page(notepad_id);

-- function to auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$ language 'plpgsql';

-- trigger for auto-update updated_at timestamp
drop trigger if exists update_notepad_updated_at on notepad;
create trigger update_notepad_updated_at
  before update on notepad
  for each row execute function update_updated_at_column();

drop trigger if exists update_notepad_page_updated_at on notepad_page;
create trigger update_notepad_page_updated_at
  before update on notepad_page
  for each row execute function update_updated_at_column();


delete from userprofile;
