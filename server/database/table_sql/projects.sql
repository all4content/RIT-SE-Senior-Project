CREATE TABLE projects (
    project_id              INTEGER primary key autoincrement,
    status                  text,   -- Submitted, Needs Revision, Future Project, Candidate, In Progress, Complete
    display_name            text unique,
    title                   text unique,
    organization            text,
    primary_contact         text,
    contact_email           text,
    contact_phone           text,
    attachments             text,
    background_info         text,
    project_description     text,
    project_scope           text,
    project_challenges      text,
    constraints_assumptions text,
    sponsor_provided_resources  text,
    project_search_keywords text,
    sponsor_deliverables    text,
    proprietary_info        text,
    sponsor_avail_checked   int,
    sponsor_alternate_time  text,
    project_agreements_checked  int,
    assignment_of_rights    text,
    team_name               text,
    FOREIGN KEY (sponsor) REFERENCES sponsors(sponsor_id),
    FOREIGN KEY (coach1) REFERENCES users(system_id),
    FOREIGN KEY (coach2) REFERENCES users(system_id),
    poster                  text,
    video                   text,
    website                 text,
    synopsis                text
);