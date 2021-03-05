CREATE TABLE actions (
    action_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    semester        INTEGER NOT NULL, 
    action_title    TEXT,   -- The title of the action
    action_target   TEXT,   -- individual, coach, team, admin
    date_deleted    TEXT,   --  (Old comment from when this field was called date_deleted) 1 for true, used for calendar events, no-op events, etc
    short_desc      TEXT,
    start_date      TEXT,
    due_date        TEXT,
    page_html       TEXT,   -- HTML for the page of
    file_types       TEXT,   -- Value of filetypes to accept - If blank, no filetypes required
    FOREIGN KEY (semester) REFERENCES semester_group(semester_id)
);
