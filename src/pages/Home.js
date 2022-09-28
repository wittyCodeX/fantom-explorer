import React from 'react';
import {__} from "../lang/setup";
import Card from "../components/common/Card";

const Home = () => {
    return (
        <div className="min-h-screen flex items-center justify-center text-white  bg-gray-900">
            <div className={""}>
                <h1 className={"capitalize text-4xl"}>{__("hello world")}</h1>
                <h2 className={"capitalize"}>{__('here some examples for using the common components')}</h2>
                <section className={"flex items-between justify-center"}>
                    <p>
                        <Card classes={"text-gray-900"} title={__("card title")}/>
                    </p>
                </section>
            </div>
        </div>

    );
};

export default Home;
