import React from 'react';
import ActionPanel from "./ActionPanel";
import {Accordion} from "semantic-ui-react";

export default function ActionEditor(props) {
    let actionPanels = [];

    if(props.actions){
        for(let i = 0; i < props.actions.length; i ++){
            let actionData = props.actions[i];
            actionPanels.push({
                key: actionData.action_id,
                title: actionData.action_title,
                content: {
                    content: <ActionPanel {...actionData}/>
                }
            })
        }
    }


    return(
        <div>
            <Accordion fluid styled panels={actionPanels} key={'actionEditor'} />
        </div>
    );

}