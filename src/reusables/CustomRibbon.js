// Search.js
import React from 'react';

const CustomRibbon = ({ query, setQuery }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                padding: "20px",
                background: "white",
                width: "100%",
                margin: "auto",
                marginTop: "20px",
                borderRadius: "5px 5px 0px 0px",
            }}
        >
            <input
                type="text"
                placeholder="Search"
                style={{
                    width: "300px",
                    height: "35px",
                    fontSize: "14px",
                    borderRadius: "5px",
                    background: "#EFF0F6",
                    padding: "10px",
                    border: "none",
                }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
};

export default CustomRibbon;
