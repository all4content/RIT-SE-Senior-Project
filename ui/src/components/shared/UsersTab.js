import React, { useEffect, useState } from "react";
import { Accordion, Button, Icon } from "semantic-ui-react";
import { config } from "../util/constants";
import StudentTeamTable from "./StudentTeamTable";
import StudentRow from "./StudentRow";
/**
 * I think this is better than an accordion on the admin tab 
 * it reuses the Students/Coaches style which works
 * I think both the Students and Coaches tabs should be removed 
 * and this tab should do it all
 * 
 */
export default function UsersTab() {
    const [students, setStudentsData] = useState([]);
    const [semesters, setSemestersData] = useState([]);
    const [projects, setProjectsData] = useState([]);
    const [users, setUserData] = useState([]);

    const unassignedStudentsStr = "Unassigned students";
    const coaches = "Coaches";
    const admins = "Admins";

    useEffect(() => {
        fetch(config.url.API_GET_STUDENT_INFO)
            .then((response) => response.json())
            .then((studentsData) => {
                setStudentsData(studentsData);
            })
            .catch((error) => {
                alert("Failed to get students data" + error);
            });
        fetch(config.url.API_GET_USERS)
            .then((response) => response.json())
            .then((userData) => {
                setUserData(userData);
            })
            .catch((error) => {
                alert("Failed to get user data" + error);
            });
        fetch(config.url.API_GET_ACTIVE_SEMESTERS)
            .then((response) => response.json())
            .then((semestersData) => {
                setSemestersData(semestersData);
            })
            .catch((error) => {
                alert("Failed to get semestersData data" + error);
            });
        fetch(config.url.API_GET_ACTIVE_PROJECTS)
            .then((response) => response.json())
            .then((projectsData) => {
                setProjectsData(projectsData);
            })
            .catch((error) => {
                alert("Failed to get projectsData" + error);
            });
    }, []);

    let semesterPanels = [];

    function fillInSemesterMap(semesterMap, studentData, semesterData, projectData, userData) {
        for (let i = 0; i < semesterData.length; i++) {
            let semester = semesterData[i];
            if (!semesterMap[semester.name]) {
                semesterMap[semester.name] = {};
            }
        }
        for (let i = 0; i < projectData.length; i++) {
            let project = projectData[i];
            if (!semesterMap[project.name]) {
                semesterMap[project.name] = {};
            }
            if (!semesterMap[project.name][project.project_id]) {
                semesterMap[project.name][project.project_id] = [];
            }
        }

        for(let i = 0; i < users.length; i++) {
            let user = userData[i];
            if(user.type === "coach") {
                if (!semesterMap[coaches]) {
                    semesterMap[coaches] = [];
                }
                semesterMap[coaches].push(<StudentRow student = {user} semesterData = {semesters} />);
            }
        }

        for(let i = 0; i < users.length; i++) {
            let user = userData[i];
            if(user.type === "admin") {
                if (!semesterMap[admins]) {
                    semesterMap[admins] = [];
                }
                semesterMap[admins].push(<StudentRow student = {user} semesterData = {semesters} />);
            }
        }

        for (let i = 0; i < studentData.length; i++) {
            let student = studentData[i];
            if (student.semester_group) {
                if (!semesterMap[student.name]) {
                    semesterMap[student.name] = {};
                }

                if (student.project) {
                    if (!semesterMap[student.name][student.project]) {
                        semesterMap[student.name][student.project] = [];
                    }
                    semesterMap[student.name][student.project].push(
                        <StudentRow student={student} semesterData={semesters} />
                    );
                } else {
                    // if a student hasn't been assigned a project yet
                    if (!semesterMap[student.name][unassignedStudentsStr]) {
                        semesterMap[student.name][unassignedStudentsStr] = [];
                    }
                    semesterMap[student.name][unassignedStudentsStr].push(
                        <StudentRow student={student} semesterData={semesters} />
                    );
                }
            } else {
                //if a student doesn't have an assigned semester group yet
                if (!semesterMap[unassignedStudentsStr]) {
                    semesterMap[unassignedStudentsStr] = [];
                }
                semesterMap[unassignedStudentsStr].push(<StudentRow student={student} semesterData={semesters} />);
            }
        }
        return semesterMap;
    }

    if (students && semesters && projects) {
        let semesterMap = {};
        let projectMap = new Map();

        semesterMap = fillInSemesterMap(semesterMap, students, semesters, projects, users);

        for (let i = 0; i < projects.length; i++) {
            projectMap[projects[i]["project_id"]] = projects[i]["team_name"];
        }
        for (const [semesterName, projects] of Object.entries(semesterMap)) {
            if (semesterName) {
                let projectPanels = [];

                let val = projects || {};

                for (const [projectId, studentPanels] of Object.entries(val)) {
                    if (semesterName === unassignedStudentsStr) {
                        let key = "StudentsTab-project-selector-" + unassignedStudentsStr;
                        projectPanels.push(
                            <StudentTeamTable
                                key={key}
                                title={`Semester-unassigned Students (${studentPanels.length})`}
                                content={studentPanels}
                                unassignedSemester={true}
                            />
                        );
                    } else if (semesterName === "Coaches") {
                        let key = "StudentsTab-project-selector-" + coaches;
                        projectPanels.push(
                            <StudentTeamTable
                                key={key}
                                title={`Semester-Coaches (${studentPanels.length})`}
                                content={studentPanels}
                                unassignedSemester={true}
                            />
                        );
                    } else if (semesterName === "Admins") {
                        let key = "StudentsTab-project-selector-" + admins;
                        projectPanels.push(
                            <StudentTeamTable
                                key={key}
                                title={`Semester-Coaches (${studentPanels.length})`}
                                content={studentPanels}
                                unassignedSemester={true}
                            />
                        );
                    } else if (projectId !== unassignedStudentsStr) {
                        let key = "StudentsTab-project-selector-" + projectMap[projectId];
                        projectPanels.push(
                            <StudentTeamTable
                                key={key}
                                title={`${projectMap[projectId]} (${studentPanels.length})`}
                                content={studentPanels}
                            />
                        );
                    } else {
                        let key = "StudentsTab-project-selector-" + unassignedStudentsStr;
                        projectPanels.push(
                            <StudentTeamTable
                                key={key}
                                title={`Team-unassigned Students (${studentPanels.length})`}
                                content={studentPanels}
                            />
                        );
                    }
                }

                semesterPanels.push(
                    <Accordion
                        fluid
                        styled
                        panels={[
                            {
                                key: "StudentsTab-semester-selector-" + semesterName,
                                title: `${semesterName} (${projectPanels.length})`,
                                content: { content: projectPanels },
                            },
                        ]}
                    />
                );
            }
        }
    }

    const onAdd = () => {
        // return <ActionModal />;
        //todo
        alert("Blank Students Modal");
    };

    return (
        <div>
            {semesterPanels.reverse()}
        </div>
    );
}