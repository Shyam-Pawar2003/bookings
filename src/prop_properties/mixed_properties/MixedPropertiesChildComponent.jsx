import React from "react";
import "./MixedPropertiesChildComponent.css";

export const MixedPropertiesChildComponent = ({trainerProfiles}) => {
    return(
        <>
            <h1 id="mixed_properties_heading">MixedProperties</h1>

            <table id="trainer_profiles_table">
                <caption id="trainer_profiles_table_caption">
                    TrainerProfiles
                </caption>

                <thead id="trainer_profiles_table_head">
                    <tr className="trainer_profiles_table_head_rows">

                        <th className="trainer_profiles_table_head_cells">
                            Serial<br/>Number
                        </th>

                        <th className="trainer_profiles_table_head_cells">
                            TrainerID
                        </th>

                        <th className="trainer_profiles_table_head_cells">
                            Trainer<br/>Name
                        </th>

                        <th className="trainer_profiles_table_head_cells">
                            Age
                        </th>

                        <th className="trainer_profiles_table_head_cells">
                            Marital<br/>Status
                        </th>

                        <th className="trainer_profiles_table_head_cells">
                            Courses<br/>
                        </th>

                    </tr>
                </thead>

                <tbody id="trainer_profiles_table_body">

                    {
                        trainerProfiles.map((trainerProfile,trainerProfileIndex)=>{
                            return(

                                <tr key={trainerProfile.trainerID}
                                    className="trainer_profiles_table_body_rows">

                                    <td className="trainer_profiles_table_body_cells">
                                        {trainerProfileIndex}
                                    </td>

                                    <td className="trainer_profiles_table_body_cells">
                                        {trainerProfile.trainerID}
                                    </td>

                                    <td className="trainer_profiles_table_body_cells">
                                        {trainerProfile.trainerName}
                                    </td>

                                    <td className="trainer_profiles_table_body_cells">
                                        {trainerProfile.age}
                                    </td>

                                    <td className="trainer_profiles_table_body_cells">
                                        {trainerProfile.isMarried ? "Married" : "Un-Married"}
                                    </td>

                                    <td className="trainer_profiles_table_body_cells"
                                        id="courses_list_item">

                                        <ul id="courses_list">

                                            {
                                                trainerProfile.courses.map((course,courseIndex)=>{
                                                    return(
                                                        <li key={courseIndex}>
                                                            {course}
                                                        </li>
                                                    )
                                                })
                                            }

                                        </ul>

                                    </td>

                                </tr>

                            )
                        })
                    }

                </tbody>

            </table>
        </>
    )
}