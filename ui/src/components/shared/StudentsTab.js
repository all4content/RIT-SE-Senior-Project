import React, { useEffect, useState, useContext } from "react";
import { Accordion } from "semantic-ui-react";
import { config, USERTYPES } from "../util/constants";
import StudentTeamTable from "./StudentTeamTable";
import _ from "lodash";
import { SecureFetch } from "../util/secureFetch";
import { UserContext } from "../util/UserContext";
import { isSemesterActive } from "../util/utils";

export default function StudentsTab() {
    const [students, setStudentsData] = useState([]);
    const [semesters, setSemestersData] = useState([]);
    const [projects, setProjectsData] = useState([]);
    const [active, setActive] = useState({})
    const userContext = useContext(UserContext);

    const unassignedStudentsStr = "Unassigned students";

    useEffect(() => {
        SecureFetch(config.url.API_GET_MY_STUDENTS)
            .then((response) => response.json())
            .then((studentsData) => {
                setStudentsData(studentsData);
            })
            .catch((error) => {
                alert("Failed to get students data" + error);
            });
        SecureFetch(config.url.API_GET_SEMESTERS)
            .then((response) => response.json())
            .then((semestersData) => {
                setSemestersData(semestersData);
            })
            .catch((error) => {
                alert("Failed to get semestersData data" + error);
            });
        const getProjects = userContext.user.role === USERTYPES.ADMIN ? config.url.API_GET_PROJECTS : config.url.API_GET_MY_PROJECTS;
        SecureFetch(getProjects)
            .then((response) => response.json())
            .then((projectsData) => {
                setProjectsData(projectsData);
            })
            .catch((error) => {
                alert("Failed to get projectsData" + error);
            });
    }, [userContext.user?.role]);

    let semesterPanels = [];

    function generateMappedData(studentData, semesterData, projectData) {

        let projectMap = {};
        projectData.forEach(project => {
            projectMap[project.project_id] = project;
        });

        let semesterMap = {}
        semesterData.forEach(semester => {
            semesterMap[semester.semester_id] = semester;
        });

        let mappedData = { [unassignedStudentsStr]: { students: [], name: unassignedStudentsStr, projects: {} } }

        const initialActive = {};

        studentData.forEach(student => {
            if (student.semester_group) {
                if (!mappedData[student.semester_group]) {
                    mappedData[student.semester_group] = {
                        projects: { "noProject": { students: [], name: "No Project" } },
                        name: semesterMap[student.semester_group]?.name,
                        start_date: semesterMap[student.semester_group]?.start_date,
                        end_date: semesterMap[student.semester_group]?.end_date,
                        semester_id: semesterMap[student.semester_group]?.semester_id,
                    };
                    initialActive[semesterMap[student.semester_group]?.semester_id] = isSemesterActive(semesterMap[student.semester_group]?.start_date, semesterMap[student.semester_group]?.end_date);
                }
                if (student.project) {
                    if (!mappedData[student.semester_group]["projects"][student.project]) {
                        mappedData[student.semester_group]["projects"][student.project] = {
                            students: [],
                            name: projectMap[student.project]?.display_name || projectMap[student.project]?.title,
                        };
                    }
                    mappedData[student.semester_group]["projects"][student.project]['students'].push(student);
                } else {
                    mappedData[student.semester_group]["projects"]["noProject"]["students"].push(student);
                }
            } else {
                mappedData[unassignedStudentsStr]["students"].push(student);
            }
        });

        // Check if active has already been set so that we don't run into issues with infinite re-renders
        if (Object.keys(active).length === 0) {
            setActive(initialActive)
        }
        return mappedData;
    }

    if (students.length > 0 && semesters.length > 0 && projects.length > 0) {

        let semesterMap = generateMappedData(students, semesters, projects);

        semesterMap = _.sortBy(semesterMap, ["end_date", "start_date", "name"]);

        semesterMap.forEach(semester => {
            if (semester.name === unassignedStudentsStr) {
                semesterPanels.push(
                    <Accordion
                        key={unassignedStudentsStr}
                        fluid
                        styled
                        onTitleClick={() => {
                            setActive({ ...active, [semester.semester_id]: !active[semester.semester_id] })
                        }}
                        panels={[{
                            key: unassignedStudentsStr,
                            title: `${semester.name} (${semester.students?.length})`,
                            active: active[semester.semester_id],
                            content: {
                                content:
                                    <StudentTeamTable
                                        key={unassignedStudentsStr}
                                        childKey={unassignedStudentsStr}
                                        title={unassignedStudentsStr}
                                        students={semester.students}
                                        semesterData={semesters}
                                        noAccordion
                                        viewOnly
                                    />
                            }
                        }]}
                    />
                )
            } else {
                semesterPanels.push(
                    <Accordion
                        key={semester.semester_id}
                        fluid
                        styled
                        onTitleClick={() => {
                            setActive({ ...active, [semester.semester_id]: !active[semester.semester_id] })
                        }}
                        panels={[{
                            key: semester.semester_id,
                            title: `${semester.name} (${Object.keys(semester.projects)?.length})`,
                            active: active[semester.semester_id],
                            content: {
                                content:
                                    Object.keys(semester.projects).map(projectKey => {
                                        return semester.projects[projectKey].students.length > 0 &&
                                            <StudentTeamTable
                                                key={projectKey}
                                                childKey={projectKey}
                                                title={`${semester.projects[projectKey].name} (${semester.projects[projectKey]?.students?.length})`}
                                                students={semester.projects[projectKey].students}
                                                semesterData={semesters}
                                                viewOnly
                                            />
                                    })
                            }
                        }]}
                    />
                )
            }
        })
    }

    return semesterPanels.reverse();
}
