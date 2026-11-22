import React from "react";

const FancyRope = ({
    stroke = "#f3a7bd",
    width = "100%",
    height = 900,
    x = "-30px",
    y = 0,
    className = ""
}) => {
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                pointerEvents: "none"
            }}
            className={className}
        >
            <svg
                width={width}
                height={height}
                viewBox="0 0 900 1600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="
            M 0 200
            C 200 50, 350 350, 520 180
            
            C 650 50, 800 320, 500 500
            
            C 350 600, 250 900, 450 1050
            
            C 650 1200, 900 1300, 700 1500
            
            C 550 1650, 200 1600, 50 1500
          "
                    stroke={stroke}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export default FancyRope;