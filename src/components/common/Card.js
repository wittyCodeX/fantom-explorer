import React from 'react';

const Card = (props) => {
    return (
        <div
            className={`bg-white w-96   rounded-xl  ${props.classes ? props.classes : ""}`}>
            {
                props.title
                    ? <div className={"flex items-center"}>
                        <h1 className={"title p-2 sm:p-0"}>{props.title}</h1>
                    </div>

                    : ""
            }
            {props.children}
        </div>
    );
};

export default Card;
