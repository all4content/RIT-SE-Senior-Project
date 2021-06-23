import React, { useEffect, useState, useContext } from "react";
import { Accordion } from "semantic-ui-react";
import { config, USERTYPES } from "../util/constants";
import { SecureFetch } from "../util/secureFetch";
import { UserContext } from "../util/UserContext";
import Timeline from "./Timeline";

export default function TimeLines() {
    const [timelines, setTimelines] = useState([]);
    const [activeSemesters, setActiveSemesters] = useState({});
    const [actionLogs, setActionLogs] = useState();
    const userContext = useContext(UserContext);

    useEffect(() => {
        SecureFetch(config.url.API_GET_ACTIVE_TIMELINES)
            .then((response) => response.json())
            .then((timelinesData) => {
                setTimelines(timelinesData);
            })
            .catch((error) => {
                alert("Failed to get timeline data" + error);
            });

        // TODO: Do pagination
        SecureFetch(config.url.API_GET_ACTION_LOGS)
            .then((response) => response.json())
            .then((action_logs) => {
                setActionLogs(action_logs);
            })
            .catch((error) => {
                alert("Failed to get team files data " + error);
            });
    }, []);

    const submissionMap = {};
    actionLogs?.forEach(submission => {
        if (!submissionMap[submission.action_id]) {
            submissionMap[submission.action_id] = [];
        }
        submissionMap[submission.action_id].push(submission);
    });

    let semesters = {};
    timelines?.forEach((timeline, idx) => {
        if (!semesters[timeline.semester_id]) {
            semesters[timeline.semester_id] = [timeline];
        } else {
            semesters[timeline.semester_id].push(timeline);
        }
    });

    function handleTitleClick(e, itemProps) {
        let isSemesterActive = activeSemesters[itemProps.content];
        setActiveSemesters({
            ...activeSemesters,
            [itemProps.content]: !isSemesterActive,
        });
    }

    const generateTimeLines = () => {
        return Object.keys(semesters).map((semesterKey, idx) => {
            const semesterData = semesters[semesterKey];
            if (activeSemesters[semesterData[0]?.semester_name] === undefined) {
                const parts = semesterData[0].end_date.split("/");
                const endDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                const today = new Date();
                const active = endDate > today;
                activeSemesters[semesterData[0]?.semester_name] = active;
            }

            const semester = [
                {
                    key: semesterData[0]?.semester_id,
                    title: semesterData[0]?.semester_name,
                    active: activeSemesters[semesterData[0]?.semester_name],
                    content: {
                        content: semesterData?.map((timelineElementData) => {

                            // Map submissions to action
                            timelineElementData.actions.forEach((action, idx) => {
                                timelineElementData.actions[idx] = {
                                    ...action,
                                    submissions: submissionMap[action.action_id]
                                }
                            })

                            return <Timeline key={"timeline-"} elementData={timelineElementData} />
                        }),
                    },
                    semester_id: semesterData[0]?.semester_id,
                },
            ];
            if (userContext.user?.role === USERTYPES.STUDENT) {
                return semester[0].content?.content;
            }
            return <Accordion fluid styled panels={semester} key={idx} onTitleClick={handleTitleClick} />;
        });
    };

    return generateTimeLines();
}