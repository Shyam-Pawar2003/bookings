import React from "react";
import ObjectPropertiesChildComponent from "./ObjectPropertiesChildComponent";

export const ObjectPropertiesParentComponent = () => {

    let studentProfile = {
        firstName: "Sai",
        lastName: "Pawar",
        age: 24,
        enrolledCourse: "JavaFullStack",

        getFullName: () => {
            return `${studentProfile.firstName} ${studentProfile.lastName}`;
        }
    };

    return (
        <ObjectPropertiesChildComponent studentProfile={studentProfile} />
    );
}