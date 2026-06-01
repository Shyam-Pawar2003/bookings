import React from "react";

export const ObjectPropertiesChildComponent = ({ studentProfile }) => {

    let { firstName, lastName, age, enrolledCourse, getFullName } = studentProfile;

    return (
        <>
            <h1>
                ObjectProperties : FirstName-{firstName} |
                LastName-{lastName} |
                Age-{age} |
                EnrolledCourse-{enrolledCourse} |
                FullName-{getFullName()}
            </h1>
        </>
    );
}