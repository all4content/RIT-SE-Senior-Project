import React from "react";
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Accordion,
} from "semantic-ui-react";
import StudentRow from "./StudentRow";

export default function StudentTeamTable(props) {

    const table = (
        <Table sortable>
            <TableHeader>
                <TableRow key="studentTeamTableHeaders">
                    <TableHeaderCell
                    // sorted={proposalData.column === COLUMNS.DATE ? proposalData.direction : null}
                    // onClick={() => changeSort(COLUMNS.DATE)}
                    >
                        First Name
                    </TableHeaderCell>
                    <TableHeaderCell
                    // sorted={proposalData.column === COLUMNS.DATE ? proposalData.direction : null}
                    // onClick={() => changeSort(COLUMNS.DATE)}
                    >
                        Last Name
                    </TableHeaderCell>

                    <TableHeaderCell
                    // sorted={proposalData.column === COLUMNS.ACTION ? proposalData.direction : null}
                    // onClick={() => changeSort(COLUMNS.ACTION)}
                    >
                        Email
                    </TableHeaderCell>
                    <TableHeaderCell
                    // sorted={proposalData.column === COLUMNS.EDIT ? proposalData.direction : null}
                    // onClick={() => changeSort(COLUMNS.EDIT)}
                    >
                        Action
                    </TableHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {props.students?.map(student =>
                    <StudentRow key={student.system_id} student={student} semesterData={props.semesterData} projectsData={props.projectsData} />
                )}

            </TableBody>
        </Table>
    )

    if (props.unassignedSemester) {
        return table;
    }

    return (
        <Accordion
            fluid
            styled
            panels={[
                {
                    key: props.childKey,
                    title: props.title,
                    content: {
                        content: (table)
                    },
                },
            ]}
        />
    );
}
